import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { CLIENT_ORIGIN } from './config.js';
import { notFoundHandler, errorHandler } from './middleware/errors.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: CLIENT_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
