import { HTTP_STATUS } from '../models/http-response.models';

export class HttpErrorHandler extends Error {
  constructor(
    readonly status: HTTP_STATUS,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const HTTP_ERROR = {
  /**
   * 401 Unauthorized
   * @param message
   */
  unauthorized: (message: string = 'Unauthorized') =>
    new HttpErrorHandler(HTTP_STATUS.UNAUTHORIZED, message),

  /**
   * 402 Payment Required
   * @param message
   */
  paymentRequired: (message: string = 'Payment Required') =>
    new HttpErrorHandler(HTTP_STATUS.PAYMENT_REQUIRED, message),

  /**
   * 403 Forbidden
   * @param message
   */
  forbidden: (message: string = 'Forbidden') =>
    new HttpErrorHandler(HTTP_STATUS.FORBIDDEN, message),

  /**
   * 400 Bad Request
   * @param message
   */
  badRequest: (message: string = 'Bad Request') =>
    new HttpErrorHandler(HTTP_STATUS.BAD_REQUEST, message),

  /**
   * 404 Not Found
   * @param message
   */
  notFound: (message: string = 'Not Found') => new HttpErrorHandler(HTTP_STATUS.NOT_FOUND, message),

  /**
   * 408 Request Timeout
   * @param message
   */
  requestTimeout: (message: string = 'Request Timeout') =>
    new HttpErrorHandler(HTTP_STATUS.REQUEST_TIMEOUT, message),

  /**
   * 409 Conflict
   * @param message
   */
  conflict: (message: string = 'Conflict') => new HttpErrorHandler(HTTP_STATUS.CONFLICT, message),

  /**
   * 500 Internal Server Error
   * @param message
   */
  internalError: (message: string = 'Internal Server Error') =>
    new HttpErrorHandler(HTTP_STATUS.INTERNAL_SERVER_ERROR, message),

  /**
   * 503 Service Unavailable
   * @param message
   */
  serviceUnavailable: (message: string = 'Service Unavailable') =>
    new HttpErrorHandler(HTTP_STATUS.SERVICE_UNAVAILABLE, message)
};
