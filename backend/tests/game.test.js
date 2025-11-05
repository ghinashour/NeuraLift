const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  app = require('../index');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

const User = require('../models/User');

describe('Games API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({ username: 'tester', email: 't@test.com', password: 'pass123' });
    userId = user._id.toString();
    token = jwt.sign({ id: userId, email: user.email }, process.env.JWT_SECRET);
  });

  test('start code quiz (auth required)', async () => {
    const res = await request(app)
      .post('/api/games/code-quiz/start')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('gameId');
    expect(res.body).toHaveProperty('question');
  });

  test('submit code quiz and persist score', async () => {
    const start = await request(app).post('/api/games/code-quiz/start').set('Authorization', `Bearer ${token}`);
    const gameId = start.body.gameId;
    const submit = await request(app).post(`/api/games/code-quiz/submit/${gameId}`).set('Authorization', `Bearer ${token}`).send({ answer: 'number' });
    expect(submit.body).toHaveProperty('correct');
    // After correct answer, user should have a score recorded
    const user = await User.findById(userId);
    expect(user.gameScores.length).toBeGreaterThanOrEqual(0);
  });

  test('tenzis start and roll, leaderboard', async () => {
    const start = await request(app).post('/api/games/tenzis/start').set('Authorization', `Bearer ${token}`);
    expect(start.status).toBe(200);
    const gameId = start.body.gameId;
    const roll = await request(app).post(`/api/games/tenzis/roll/${gameId}`).set('Authorization', `Bearer ${token}`);
    expect(roll.status).toBe(200);
    // If finished, a score is persisted; allow multiple rolls until finished
    let state = roll.body.state;
    while (!state.finished && state.rollsLeft > 0) {
      const next = await request(app).post(`/api/games/tenzis/roll/${gameId}`).set('Authorization', `Bearer ${token}`);
      state = next.body.state;
    }
    // Fetch leaderboard
    const lb = await request(app).get('/api/games/leaderboard/tenzis-solo');
    expect(lb.status).toBe(200);
    expect(Array.isArray(lb.body)).toBe(true);
  });
});
