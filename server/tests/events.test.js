import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongo;
let token;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Org', email: 'org@example.com', password: 'Password123', role: 'organizer' });
  token = res.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Event API', () => {
  it('creates and lists events', async () => {
    const event = {
      title: 'Developer Conf',
      description: 'A focused developer conference with talks and workshops.',
      bannerImage: 'https://example.com/banner.jpg',
      venue: 'Main Hall',
      city: 'Delhi',
      date: '2026-07-01',
      time: '10:00 AM',
      category: 'Technology',
      ticketPrice: 500,
      totalSeats: 100
    };

    const created = await request(app).post('/api/events').set('Authorization', `Bearer ${token}`).send(event);
    expect(created.status).toBe(201);

    const list = await request(app).get('/api/events?city=Delhi');
    expect(list.status).toBe(200);
    expect(list.body.data.events).toHaveLength(1);
  });
});
