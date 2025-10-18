const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId = `session-${Date.now()}`, history, systemPrompt } = req.body;

  // Validate input
  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  try {
    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = new Conversation({ sessionId });
    }

    // Add user message
    conversation.messages.push({
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    });

    // Generate AI response using provided history and optional system prompt
    let aiResponse;
    try {
      aiResponse = await generateAIResponse(message.trim(), { history, systemPrompt });
    } catch (aiError) {
      console.error('AI Service error:', aiError);
      aiResponse = "I'm currently experiencing technical difficulties. Please try again in a moment.";
    }

    // Safeguard: ensure we never return an empty reply. If aiResponse is empty or whitespace, provide a fallback message.
    if (!aiResponse || !aiResponse.toString().trim()) {
      console.warn('AI returned empty response, using fallback message');
      aiResponse = "Thanks for your message — I didn't get a detailed reply from the assistant. Could you rephrase or ask in a different way?";
    }

    // Add AI message
    conversation.messages.push({
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    });

    // Save conversation
    await conversation.save();

    res.status(200).json({
      success: true,
      reply: aiResponse,
      sessionId: conversation.sessionId,
      messageCount: conversation.messages.length
    });

  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500);
    throw new Error('Failed to process message: ' + error.message);
  }
});

// @desc    Get conversation history
// @route   GET /api/chat/:sessionId
// @access  Public
const getConversation = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  res.status(200).json({
    success: true,
    conversation: {
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      startedAt: conversation.startedAt,
      lastActivity: conversation.lastActivity
    }
  });
});

// AI Response Generator - uses OpenAI chat completions when API key is set, otherwise rule-based fallback
const generateAIResponse = async (userMessage, opts = {}) => {
  const { history = [], systemPrompt } = opts || {};

  // If OpenAI key is set, prefer calling the API for contextual responses
  if (process.env.OPENAI_API_KEY) {
    try {
      const messages = [];
      // Default persona: NeuraLift System Support
  // This persona should help end users with the app, assist developers with technical questions,
  // and help students with homework or task-related guidance related to NeuraLift.
  const defaultSystemPrompt = systemPrompt || `You are NeuraLift System Support.\n\nBehaviors and priorities:\n- Act as a friendly, concise, and professional system support agent for the NeuraLift application.\n- Help end users with feature usage, navigation, and troubleshooting steps.\n- Help developers with clear technical explanations, code examples, and debugging guidance related to this project.\n- When asked for homework or learning help, provide educational explanations, step-by-step reasoning, and safe example code without doing work that violates academic integrity policies (provide guidance, not complete graded assignments unless explicitly allowed).\n- If a user asks for sensitive actions (account deletion, admin changes), instruct them to contact an admin and provide safe steps, do not perform destructive actions.\n- Keep answers concise, include actionable steps, and when appropriate, provide references to the repository structure (e.g., where controllers, hooks, or components live).\n- When giving code snippets, prefer small, runnable examples and mention any assumptions (Node/React versions, env vars).\n\nYou have access to contextual conversation history and should use it to provide relevant, stateful responses.`;
  messages.push({ role: 'system', content: defaultSystemPrompt });

      // Append history entries (expecting { role, content } entries)
      if (Array.isArray(history)) {
        history.slice(-40).forEach(h => {
          if (h && h.role && (h.content || h.message)) {
            messages.push({ role: h.role, content: h.content || h.message });
          }
        });
      }

      // Append latest user message
      messages.push({ role: 'user', content: userMessage });

      const openaiUrl = 'https://api.openai.com/v1/chat/completions';
      const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

      // Retry logic for transient failures or empty outputs
      const maxRetries = 2;
      let lastErr = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const resp = await fetch(openaiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({ model, messages, max_tokens: 600, temperature: 0.7 })
          });

          if (!resp.ok) {
            const errText = await resp.text().catch(() => '');
            throw new Error(`OpenAI error ${resp.status}: ${errText}`);
          }

          const data = await resp.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text && text.toString().trim()) return text.trim();

          // If empty response, throw to trigger retry
          throw new Error('OpenAI returned no content');
        } catch (err) {
          lastErr = err;
          console.warn(`OpenAI attempt ${attempt + 1} failed:`, err.message || err);
          if (attempt < maxRetries) {
            // small backoff
            await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
            continue;
          }
          // if out of retries, rethrow to outer catch
          throw lastErr;
        }
      }
    } catch (err) {
      console.error('OpenAI call failed:', err);
      // Fall through to fallback
    }
  }

  // Rule-based fallback when OpenAI is not available or fails
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm the NEURALIFT assistant. How can I help you today?";
  } else if (lowerMessage.includes('story') || lowerMessage.includes('add story')) {
    return "To add a story in NEURALIFT, go to your dashboard and click the 'Add Story' button. You can then upload your content, add a title, and customize your story settings.";
  } else if (lowerMessage.includes('neuralift') || lowerMessage.includes('about')) {
    return "NEURALIFT is a platform that helps creators build and share interactive stories. We provide tools for storytelling, audience engagement, and content management.";
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! You can ask me about:\n- Adding and managing stories\n- NEURALIFT features\n- Getting started\n- Technical support";
  } else if (lowerMessage.includes('get started')) {
    return "To get started with NEURALIFT:\n1. Create your account\n2. Set up your profile\n3. Create your first story\n4. Share with your audience\n5. Engage with analytics";
  } else {
    return `Thank you for your message: "${userMessage}". I understand you're interested in NEURALIFT. Could you tell me more about what you'd like to know?`;
  }
};

// Stream response token-by-token (SSE-style) for clients that want incremental tokens
const streamMessage = asyncHandler(async (req, res) => {
  const { message, sessionId = `session-${Date.now()}`, history, systemPrompt } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  // Set headers for SSE-like streaming (we'll use plain text chunks)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  // Helper to send a chunk
  const sendChunk = (data) => {
    try {
      res.write(`data: ${data}\n\n`);
    } catch (e) {
      // ignore write errors
    }
  };

  // Save the user message first
  let conversation = await Conversation.findOne({ sessionId });
  if (!conversation) conversation = new Conversation({ sessionId });
  conversation.messages.push({ text: message.trim(), sender: 'user', timestamp: new Date() });
  await conversation.save();

  try {
    if (process.env.OPENAI_API_KEY) {
      // Use fetch to OpenAI with stream=true if model supports streaming
      const messages = [];
      const defaultSystemPrompt = systemPrompt || `You are NeuraLift System Support. Provide concise, helpful answers.`;
      messages.push({ role: 'system', content: defaultSystemPrompt });
      if (Array.isArray(history)) {
        history.slice(-40).forEach(h => {
          if (h && h.role && (h.content || h.message)) messages.push({ role: h.role, content: h.content || h.message });
        });
      }
      messages.push({ role: 'user', content: message.trim() });

      const openaiUrl = 'https://api.openai.com/v1/chat/completions';
      const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

      const resp = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model, messages, max_tokens: 600, temperature: 0.7, stream: true })
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`OpenAI error ${resp.status}: ${errText}`);
      }

      // Stream the response body by reading chunks and parsing OpenAI stream lines
      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;
      let buffer = '';
      let assembled = '';
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // OpenAI sends data: <json>\n\n entries. Process complete lines.
          const parts = buffer.split(/\n\n/);
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i].trim();
            if (!part) continue;
            // part may start with 'data: '
            const line = part.replace(/^data:\s*/i, '');
            if (line === '[DONE]') {
              // ignore
              continue;
            }
            try {
              const payload = JSON.parse(line);
              const delta = payload?.choices?.[0]?.delta?.content;
              if (delta) {
                assembled += delta;
                // send only the text delta to client
                sendChunk(delta.replace(/\n/g, '\\n'));
              }
            } catch (e) {
              // If parse fails, forward raw part as fallback
              sendChunk(line.replace(/\n/g, '\\n'));
            }
          }

          // Keep the remaining partial part in buffer
          buffer = parts[parts.length - 1];
        }
      }

      // After stream ends, if we assembled content, persist it. If not, use a fallback generated reply and stream it now.
      if (assembled) {
        conversation.messages.push({ text: assembled, sender: 'ai', timestamp: new Date() });
        await conversation.save();
      } else {
        console.warn('Stream ended but assembled content is empty; generating fallback response');
        try {
          const fallback = await generateAIResponse(message.trim(), { history, systemPrompt });
          const chunkSize = 80;
          for (let i = 0; i < fallback.length; i += chunkSize) {
            const piece = fallback.slice(i, i + chunkSize);
            sendChunk(piece.replace(/\n/g, '\\n'));
            await new Promise(r => setTimeout(r, 50));
          }
          conversation.messages.push({ text: fallback, sender: 'ai', timestamp: new Date() });
          await conversation.save();
        } catch (e) {
          console.error('Fallback generation failed during stream:', e);
        }
      }

      // Signal end
      res.write(`event: done\ndata: [DONE]\n\n`);
      res.end();
      return;
    }

    // Fallback: no OpenAI key - generate fallback and stream it in small chunks
    const fallback = await generateAIResponse(message.trim(), { history, systemPrompt });
    const chunkSize = 40;
    for (let i = 0; i < fallback.length; i += chunkSize) {
      const piece = fallback.slice(i, i + chunkSize);
      sendChunk(piece.replace(/\n/g, '\\n'));
      await new Promise(r => setTimeout(r, 60));
    }

    // Save final message
    conversation.messages.push({ text: fallback, sender: 'ai', timestamp: new Date() });
    await conversation.save();

    res.write(`event: done\ndata: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error('Streaming AI error:', err);
    try { res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`); } catch (e) {}
    res.end();
  }
});

module.exports = {
  sendMessage,
  getConversation,
  streamMessage
};