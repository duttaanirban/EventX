import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new ApiError(401, 'Authentication required');

  const decoded = jwt.verify(token, env.jwtAccessSecret);
  const user = await User.findById(decoded.id).select('+role +isBanned +tokenVersion');
  if (!user || user.isBanned) throw new ApiError(401, 'Account unavailable');
  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) throw new ApiError(403, 'Insufficient permissions');
  next();
};
