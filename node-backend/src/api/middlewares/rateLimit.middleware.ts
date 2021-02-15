import rateLimit from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : Number.MAX_SAFE_INTEGER,
  message: { message: 'You reached the conversion limit for this demo ;) try again later' },
});

export default rateLimitMiddleware;
