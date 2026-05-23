import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Event.deleteMany()]);

  const [admin, organizer, user] = await User.create([
    { name: 'Admin One', email: 'admin@eventx.app', password: 'Password123', role: 'admin', isVerified: true },
    { name: 'Aarav Organizer', email: 'organizer@eventx.app', password: 'Password123', role: 'organizer', isVerified: true },
    { name: 'Naina User', email: 'user@eventx.app', password: 'Password123', role: 'user', isVerified: true }
  ]);

  await Event.create([
    {
      title: 'Product Leaders Summit',
      description: 'A premium conference for product builders, founders, and growth teams.',
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      venue: 'Jio World Convention Centre',
      city: 'Mumbai',
      date: new Date('2026-08-18'),
      time: '10:00 AM',
      category: 'Business',
      ticketPrice: 2499,
      totalSeats: 500,
      availableSeats: 500,
      organizer: organizer._id
    },
    {
      title: 'Indie Music Nights',
      description: 'An intimate live music showcase featuring emerging independent artists.',
      bannerImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
      venue: 'Phoenix Arena',
      city: 'Bengaluru',
      date: new Date('2026-09-05'),
      time: '7:30 PM',
      category: 'Music',
      ticketPrice: 999,
      totalSeats: 300,
      availableSeats: 300,
      organizer: organizer._id
    }
  ]);

  console.log({ admin: admin.email, organizer: organizer.email, user: user.email, password: 'Password123' });
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
