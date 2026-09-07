// server/tests/concurrency.test.js
import crypto from 'crypto';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Event from '../src/models/Event.js';
import Payment from '../src/models/Payment.js';
import Booking from '../src/models/Booking.js';

let mongo;
let token;
let event;
let buyer;

// Must match whatever payment.service.js reads: process.env.RAZORPAY_KEY_SECRET || env.razorpayKeySecret
const RAZORPAY_SECRET = 'rzp_secret';

function signFor(orderId, paymentId) {
  return crypto.createHmac('sha256', RAZORPAY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
}

beforeAll(async () => {
  process.env.RAZORPAY_KEY_SECRET = RAZORPAY_SECRET;

  // Transactions require a replica set — plain MongoMemoryServer is standalone
  // and will throw on session.withTransaction().
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri());

  buyer = await User.create({ name: 'Buyer', email: 'buyer@example.com', password: 'Password123' });
  const login = await request(app).post('/api/auth/login').send({ email: buyer.email, password: 'Password123' });
  token = login.body.data.accessToken;

  const organizer = await User.create({
    name: 'Org', email: 'org3@example.com', password: 'Password123', role: 'organizer'
  });

  event = await Event.create({
    title: 'Race Condition Test Event',
    description: 'A single-seat event used to test concurrent booking safety.',
    bannerImage: 'https://example.com/banner.jpg',
    venue: 'Arena',
    city: 'Pune',
    date: new Date('2026-08-01'),
    time: '10:00 AM',
    category: 'Tech',
    ticketPrice: 100,
    totalSeats: 1,
    availableSeats: 1,
    organizer: organizer._id
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

describe('Booking concurrency', () => {
  it('does not oversell the last seat when two payments verify simultaneously', async () => {
    // Bypass real Razorpay order creation (needs live credentials) — create
    // the Payment records directly, matching what createOrder would leave behind.
    const paymentA = await Payment.create({
      user: buyer._id,
      event: event._id,
      amount: 100,
      ticketCount: 1,
      razorpayOrderId: 'order_A'
    });
    const paymentB = await Payment.create({
      user: buyer._id,
      event: event._id,
      amount: 100,
      ticketCount: 1,
      razorpayOrderId: 'order_B'
    });

    const payloadA = {
      razorpay_order_id: 'order_A',
      razorpay_payment_id: 'pay_A',
      razorpay_signature: signFor('order_A', 'pay_A')
    };
    const payloadB = {
      razorpay_order_id: 'order_B',
      razorpay_payment_id: 'pay_B',
      razorpay_signature: signFor('order_B', 'pay_B')
    };

    // Fire both verifications concurrently — this is the actual race condition.
    // NOTE: assumes POST /api/payments/verify — confirm against payment.routes.js
    const [resA, resB] = await Promise.all([
      request(app).post('/api/payments/verify').set('Authorization', `Bearer ${token}`).send(payloadA),
      request(app).post('/api/payments/verify').set('Authorization', `Bearer ${token}`).send(payloadB)
    ]);

    const statuses = [resA.status, resB.status].sort();
    // One succeeds (200), the other gets 409 "Seats are no longer available"
    expect(statuses).toEqual([200, 409]);

    const finalEvent = await Event.findById(event._id);
    expect(finalEvent.availableSeats).toBe(0); // never negative, never double-decremented

    const bookings = await Booking.find({ event: event._id });
    expect(bookings).toHaveLength(1); // only one booking created

    const [refreshedA, refreshedB] = await Promise.all([
      Payment.findById(paymentA._id),
      Payment.findById(paymentB._id)
    ]);
    const paidCount = [refreshedA.paymentStatus, refreshedB.paymentStatus].filter((s) => s === 'paid').length;
    expect(paidCount).toBe(1);
  });
});