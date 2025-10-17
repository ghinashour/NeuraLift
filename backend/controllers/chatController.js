const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId = `session-${Date.now()}` } = req.body;

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

    // Generate AI response (for now, using test response)
    let aiResponse;
    try {
      aiResponse = await generateAIResponse(message.trim());
    } catch (aiError) {
      console.error('AI Service error:', aiError);
      aiResponse = "I'm currently experiencing technical difficulties. Please try again in a moment.";
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

// AI Response Generator (Test version - replace with actual OpenAI)
const generateAIResponse = async (userMessage) => {
  // For now, return test responses based on keywords
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
    // Default response
    return `Thank you for your message: "${userMessage}". I understand you're interested in NEURALIFT. Could you tell me more about what you'd like to know?`;
  }

  // TODO: Replace with actual OpenAI API call
  /*
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for NEURALIFT. Provide concise, friendly responses about the platform.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!openaiResponse.ok) {
    throw new Error('OpenAI API error');
  }

  const data = await openaiResponse.json();
  return data.choices[0].message.content;
  */
};

module.exports = {
  sendMessage,
  getConversation
};