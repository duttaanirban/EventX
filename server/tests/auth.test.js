import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', password: 'Password123', role: 'user' };
    const register = await request(app).post('/api/auth/register').send(payload);
    expect(register.status).toBe(201);
    expect(register.body.data.accessToken).toBeTruthy();

    const login = await request(app).post('/api/auth/login').send({ email: payload.email, password: payload.password });
    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe(payload.email);
  });
});
