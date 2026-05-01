import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';

  if (env.NODE_ENV !== 'test') {
    console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.path} — ${message}`);
    if (status === 500) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && status === 500 ? { stack: err.stack } : {}),
  });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}
