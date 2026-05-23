import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  hashToken,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  signResetToken
} from '../utils/tokens.js';
import { env } from '../config/env.js';
import { emailService } from '../services/email.service.js';

const authPayload = (user, res) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  setRefreshCookie(res, refreshToken);
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified
    }
  };
};

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create(req.body);
  await emailService.sendWelcome(user);
  res.status(201).json({ success: true, data: authPayload(user, res) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (user.isBanned) throw new ApiError(403, 'This account is banned');
  res.json({ success: true, data: authPayload(user, res) });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token missing');
  const decoded = jwt.verify(token, env.jwtRefreshSecret);
  const user = await User.findById(decoded.id);
  if (!user || user.tokenVersion !== decoded.tokenVersion) throw new ApiError(401, 'Invalid refresh token');
  res.json({ success: true, data: authPayload(user, res) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  if (req.user) {
    req.user.tokenVersion += 1;
    await req.user.save();
  }
  res.json({ success: true, message: 'Logged out' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = signResetToken(user);
    user.resetPasswordHash = hashToken(token);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    await emailService.sendPasswordReset(user, `${env.clientUrl}/reset-password?token=${token}`);
  }
  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.body.token, env.jwtResetSecret);
  const user = await User.findOne({
    _id: decoded.id,
    resetPasswordHash: crypto.createHash('sha256').update(req.body.token).digest('hex'),
    resetPasswordExpires: { $gt: new Date() }
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.resetPasswordHash = undefined;
  user.resetPasswordExpires = undefined;
  user.tokenVersion += 1;
  await user.save();
  res.json({ success: true, data: authPayload(user, res) });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const payload = authPayload(req.user, res);
  res.redirect(`${env.clientUrl}/oauth/success?token=${payload.accessToken}`);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
