import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { analyticsService } from '../services/analytics.service.js';

export const organizerAnalytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await analyticsService.organizer(req.user._id) });
});

export const adminAnalytics = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await analyticsService.admin() });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, data: { users } });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const update = {};
  if (typeof req.body.isBanned === 'boolean') update.isBanned = req.body.isBanned;
  if (req.body.role) update.role = req.body.role;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { user } });
});

export const listPayments = asyncHandler(async (_req, res) => {
  const payments = await Payment.find().populate('user', 'name email').populate('event', 'title').sort('-createdAt');
  res.json({ success: true, data: { payments } });
});
