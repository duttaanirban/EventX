import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Event from '../src/models/Event.js';

let mongo;
let token;
let event;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const user = await User.create({ name: 'Buyer', email: 'buyer@example.com', password: 'Password123' });
  const login = await request(app).post('/api/auth/login').send({ email: user.email, password: 'Password123' });
  token = login.body.data.accessToken;
  const organizer = await User.create({ name: 'Org', email: 'org2@example.com', password: 'Password123', role: 'organizer' });
  event = await Event.create({
    title: 'Booking Event',
    description: 'A valid event for booking intent tests.',
    bannerImage: 'https://example.com/banner.jpg',
    venue: 'Arena',
    city: 'Pune',
    date: new Date('2026-07-01'),
    time: '10:00 AM',
    category: 'Tech',
    ticketPrice: 100,
    totalSeats: 10,
    availableSeats: 10,
    organizer: organizer._id
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Booking API', () => {
  it('creates a booking intent', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ eventId: event._id, ticketCount: 2 });
    expect(res.status).toBe(202);
    expect(res.body.data.amount).toBe(200);
  });
});
