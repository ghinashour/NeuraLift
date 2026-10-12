require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Pinecone is optional — lazy-load so the server boots without it.
let pinecone = null;
function getPinecone() {
  if (pinecone) return pinecone;
  let PineconeClient;
  try {
    ({ PineconeClient } = require('@pinecone-database/pinecone'));
  } catch (err) {
    throw new Error('Pinecone package not installed — assistant retrieval is disabled');
  }
  pinecone = new PineconeClient();
  return pinecone;
}

async function initPinecone() {
  const client = getPinecone();
  if (!client._initialized) {
    await client.init({ apiKey: process.env.PINECONE_API_KEY, environment: process.env.PINECONE_ENVIRONMENT });
    client._initialized = true;
  }
  return client;
}

async function embedText(text) {
  const r = await openai.embeddings.create({ model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small', input: text });
  return r.data[0].embedding;
}

async function retrieveRelevant(query, topK = 5) {
  const client = await initPinecone();
  const indexName = process.env.PINECONE_INDEX;
  if (!indexName) throw new Error('PINECONE_INDEX not set');
  const index = client.Index(indexName);
  const qvec = await embedText(query);
  const queryRes = await index.query({ queryRequest: { topK, vector: qvec, includeMetadata: true } });
  return (queryRes.matches || []).map(m => ({ score: m.score, metadata: m.metadata }));
}

async function handleAssistant(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // Retrieve relevant passages
    const matches = await retrieveRelevant(lastUser, Number(process.env.ASSISTANT_RETRIEVAL_K || 5));

    const context = matches.map((m, i) => `Source:${m.metadata.path || m.metadata.source || 'unknown'}\n${m.metadata.text || m.metadata.content || ''}`).join('\n\n---\n\n');

    const systemPrompt = process.env.ASSISTANT_SYSTEM_PROMPT || 'You are the Neuralift assistant. Use the provided context to answer user questions about the application. If the answer is not in the context, say you don\'t know and point to documentation.';

    const userPrompt = `Context:\n${context}\n\nUser question: ${lastUser}\n\nAnswer concisely and cite sources in brackets like [source:path] when relevant.`;

    const chatPayload = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      messages: chatPayload,
      max_tokens: 600,
      temperature: 0.14,
    });

    const answer = completion.choices?.[0]?.message?.content || '';

    res.json({ answer, sources: matches.map(m => m.metadata.path || m.metadata.source) });
  } catch (err) {
    console.error('assistant error', err);
    res.status(500).json({ error: err.message || 'assistant error' });
  }
}

module.exports = { handleAssistant };
