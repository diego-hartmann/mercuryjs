import type express from 'express';
import { type ErrorRequestHandler } from 'express';

export enum HTTP_STATUS {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  OK = 200
}

export class HttpErrorHandler extends Error {
  constructor(
    readonly status: HTTP_STATUS,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpErrorHandler.prototype);
    Error.captureStackTrace(this, HttpErrorHandler);
  }
}

export const HTTP_ERROR = {
  badRequest: (message: string) => new HttpErrorHandler(HTTP_STATUS.BAD_REQUEST, message),
  unauthorized: (message: string) => new HttpErrorHandler(HTTP_STATUS.UNAUTHORIZED, message),
  paymentRequired: (message: string) => new HttpErrorHandler(HTTP_STATUS.PAYMENT_REQUIRED, message),
  forbidden: (message: string) => new HttpErrorHandler(HTTP_STATUS.FORBIDDEN, message),
  notFound: (message: string) => new HttpErrorHandler(HTTP_STATUS.NOT_FOUND, message),
  requestTimeout: (message: string) => new HttpErrorHandler(HTTP_STATUS.REQUEST_TIMEOUT, message),
  conflict: (message: string) => new HttpErrorHandler(HTTP_STATUS.CONFLICT, message),
  internalError: (message: string) => new HttpErrorHandler(HTTP_STATUS.INTERNAL_ERROR, message),
  serviceUnavailable: (message: string) =>
    new HttpErrorHandler(HTTP_STATUS.SERVICE_UNAVAILABLE, message)
};

const createErrorInstance = (err: unknown): HttpErrorHandler => {
  if (err instanceof HttpErrorHandler) return err;

  if (err instanceof Error) return HTTP_ERROR.internalError(err.message);

  return HTTP_ERROR.internalError(`Unknown error: ${JSON.stringify(err)}`);
};

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
): void => {
  const httpError = createErrorInstance(err);

  // logger.error(sanitize(`${req.method} ${req.originalUrl} -> ${httpError.status}: ${httpError.message}`));

  res.status(httpError.status).json({ message: httpError.message });
};
