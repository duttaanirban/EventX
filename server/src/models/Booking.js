import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    qrCode: { type: String, required: true },
    qrPayload: { type: Object, required: true, select: false },
    ticketCount: { type: Number, required: true, min: 1 },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'refunded'],
      default: 'pending'
    },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
