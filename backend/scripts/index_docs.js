#!/usr/bin/env node
/**
 * Simple indexing script: reads docs/ and README.md + selected source files,
 * chunks them into pieces, computes OpenAI embeddings, and upserts to Pinecone.
 *
 * Usage: from backend folder run: node scripts/index_docs.js
 * Requires: OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { PineconeClient } = require('@pinecone-database/pinecone');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new PineconeClient();

async function init() {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_INDEX) {
    console.error('Please set PINECONE_API_KEY, PINECONE_ENVIRONMENT and PINECONE_INDEX in .env');
    process.exit(1);
  }
  await pinecone.init({ apiKey: process.env.PINECONE_API_KEY, environment: process.env.PINECONE_ENVIRONMENT });
}

function readFilesToIndex(baseDirs = ['../docs', '..']) {
  const files = [];
  // index docs folder
  const docsDir = path.resolve(__dirname, '..', 'docs');
  if (fs.existsSync(docsDir)) {
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.md') || p.endsWith('.txt')) files.push(p);
      }
    };
    walk(docsDir);
  }

  // Add root README
  const readme = path.resolve(__dirname, '..', 'README.md');
  if (fs.existsSync(readme)) files.push(readme);

  // Add key frontend/backend files (adjust as needed)
  const candidates = [
    path.resolve(__dirname, '..', 'backend', 'index.js'),
    path.resolve(__dirname, '..', 'frontend', 'README.md')
  ];
  for (const c of candidates) if (fs.existsSync(c)) files.push(c);

  return Array.from(new Set(files));
}

function chunkText(text, maxChars = 1200) {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let buffer = '';
  for (const p of paragraphs) {
    if ((buffer + '\n\n' + p).length > maxChars) {
      if (buffer) chunks.push(buffer);
      buffer = p;
    } else {
      buffer = buffer ? buffer + '\n\n' + p : p;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

async function embedAndUpsert(index, items) {
  // items: [{id, text, metadata}]
  const batchSize = 10;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const texts = batch.map(b => b.text);
    const resp = await openai.embeddings.create({ model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small', input: texts });
    const vectors = resp.data.map((d, idx) => ({
      id: batch[idx].id,
      values: d.embedding,
      metadata: batch[idx].metadata,
    }));
    await index.upsert({ upsertRequest: { vectors } });
    console.log(`Upserted batch ${i}/${items.length}`);
  }
}

async function main() {
  await init();
  const indexName = process.env.PINECONE_INDEX;
  const index = pinecone.Index(indexName);

  const files = readFilesToIndex();
  console.log('Files to index:', files);

  const items = [];
  let idCounter = 1;
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const chunks = chunkText(raw, 1200);
      chunks.forEach((c, idx) => {
        items.push({ id: `${path.basename(file)}-${idx}-${idCounter++}`, text: c, metadata: { path: path.relative(path.resolve(__dirname, '..'), file), chunkIndex: idx, content: c } });
      });
    } catch (err) {
      console.warn('Failed to read', file, err.message);
    }
  }

  console.log(`Prepared ${items.length} chunks for indexing`);
  if (items.length === 0) return console.log('No items to index');

  await embedAndUpsert(index, items);
  console.log('Indexing complete');
}

if (require.main === module) {
  main().catch(err => { console.error(err); process.exit(1); });
}
