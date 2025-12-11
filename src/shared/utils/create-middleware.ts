import type { Request, Response, NextFunction, RequestHandler } from 'express';

export type Middleware = RequestHandler;

export function createMiddleware(
  fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
): Middleware {
  return (req, res, next): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
