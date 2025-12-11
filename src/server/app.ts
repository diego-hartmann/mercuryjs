import express from 'express';
import { securityMiddleware } from './middlewares/security.middleware';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import routes from './routes';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { HTTP_ERROR } from '../shared/errors/http-error.util';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(securityMiddleware);
app.use(requestLoggerMiddleware);

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'PH Node Service Template is running.' });
});

// monta rotas (ex.: /api)
app.use(routes);

// 404 para rotas inexistentes (opcional mas recomendado)
app.use((_req, _res, next) => next(HTTP_ERROR.notFound('Route not found')));

// error handler no fim
app.use(errorHandlerMiddleware);
