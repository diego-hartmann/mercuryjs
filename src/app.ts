import express from 'express';
import { securityMiddleware } from './middlewares/security.middleware';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { router as healthRouter } from './routes/health';

export const app = express();

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// security (helmet, cors, rate limit)
app.use(securityMiddleware);

// logging HTTP
app.use(requestLoggerMiddleware);

// routes
app.use('/health', healthRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'PH Node Service Template is running.' });
});

// global error handler
app.use(errorHandlerMiddleware);
