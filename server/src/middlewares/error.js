import mongoose from 'mongoose';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode =
    err.statusCode || (err instanceof mongoose.Error.ValidationError ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
    details: err.details || undefined
  });
};
