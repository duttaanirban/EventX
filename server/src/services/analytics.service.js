import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const analyticsService = {
  organizer: async (organizerId) => {
    const events = await Event.find({ organizer: organizerId }).select('_id title totalSeats availableSeats');
    const eventIds = events.map((event) => event._id);
    const payments = await Payment.find({ event: { $in: eventIds }, paymentStatus: 'paid' });
    const bookings = await Booking.find({ event: { $in: eventIds }, bookingStatus: 'confirmed' });
    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const ticketsSold = bookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
    const checkedIn = bookings.filter((booking) => booking.checkedIn).length;
    const monthlySales = await Payment.aggregate([
      { $match: { event: { $in: eventIds }, paymentStatus: 'paid' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$amount' } } },
      { $sort: { _id: 1 } }
    ]);

    return {
      revenue,
      ticketsSold,
      attendancePercentage: bookings.length ? Math.round((checkedIn / bookings.length) * 100) : 0,
      popularEvents: events.map((event) => ({
        name: event.title,
        sold: event.totalSeats - event.availableSeats
      })),
      monthlySales: monthlySales.map((item) => ({ month: item._id, revenue: item.revenue }))
    };
  },

  admin: async () => {
    const [totalUsers, totalOrganizers, totalTransactions, paid] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'organizer' }),
      Payment.countDocuments(),
      Payment.find({ paymentStatus: 'paid' })
    ]);
    return {
      totalUsers,
      totalOrganizers,
      totalTransactions,
      platformRevenue: paid.reduce((sum, payment) => sum + payment.amount, 0)
    };
  }
};
