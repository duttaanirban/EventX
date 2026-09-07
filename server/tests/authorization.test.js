import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongo;
let userToken;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const registered = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Attendee', email: 'attendee@example.com', password: 'Password123' });
  userToken = registered.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

describe('Role-based access control', () => {
  it('blocks attendees from organizer-only event creation', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Insufficient permissions');
  });

  it('blocks attendees from QR validation', async () => {
    const response = await request(app)
      .post('/api/qr/validate')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Insufficient permissions');
  });
});
