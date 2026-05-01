import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import v1Router from './routes/v1/index.js';

export function createApp() {
  const app = express();

  // ── Security & parsing ──────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Logging ─────────────────────────────────────────────────────────────────
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // ── Health check ────────────────────────────────────────────────────────────
  app.get('/health', (_, res) =>
    res.json({ success: true, status: 'ok', env: env.NODE_ENV })
  );

  // ── API routes ──────────────────────────────────────────────────────────────
  app.use('/api/v1', v1Router);

  // ── 404 & error handler ─────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
