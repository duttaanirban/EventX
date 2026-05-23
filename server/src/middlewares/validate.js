import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });
  if (!parsed.success) {
    throw new ApiError(400, 'Validation failed', parsed.error.flatten());
  }
  req.validated = parsed.data;
  next();
};
