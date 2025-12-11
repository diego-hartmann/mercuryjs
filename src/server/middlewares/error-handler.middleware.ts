import type express from 'express';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HTTP_ERROR, HttpErrorHandler } from '../../shared/errors/http-error.util';
import { logger } from '../../config/logger';

type ErrorResponse = {
  message: string;
  issues?: unknown;
};

const createErrorInstance = (err: unknown): HttpErrorHandler => {
  if (err instanceof HttpErrorHandler) return err;

  if (err instanceof ZodError) {
    return HTTP_ERROR.badRequest('Validation error');
  }

  if (err instanceof Error) {
    return HTTP_ERROR.internalError(err.message);
  }

  return HTTP_ERROR.internalError('Unexpected error');
};

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
): void => {
  const httpError = createErrorInstance(err);

  const payload: ErrorResponse = { message: httpError.message };

  // include Zod issues only for 400 validation errors
  if (err instanceof ZodError) {
    payload.issues = err.errors;
  }

  // log with correct level (based on final status)
  logger(req.method, req.originalUrl, httpError.status);

  res.status(httpError.status).json(payload);
};
