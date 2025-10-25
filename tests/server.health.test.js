import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server/src/index.js';

describe('Health', () => {
  it('GET /api/health => ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
