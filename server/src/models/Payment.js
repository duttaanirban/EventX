import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    amount: { type: Number, required: true },
    ticketCount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created'
    },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    failureReason: String
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
