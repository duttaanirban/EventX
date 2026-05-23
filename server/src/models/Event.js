import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true },
    bannerImage: { type: String, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    category: { type: String, required: true, index: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
