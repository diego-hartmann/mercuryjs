import jwt from 'jsonwebtoken';
import { HTTP_ERROR } from '../../shared/errors/http-error.util';
import { createMiddleware, Middleware } from '../../shared/utils/create-middleware';

export type JwtPayload = {
  sub: string;
  roles?: string[];
};

const requireJwtMiddleware: Middleware = createMiddleware((req) => {
  const auth = req.header('authorization');
  if (!auth?.startsWith('Bearer ')) throw HTTP_ERROR.unauthorized('Missing token');

  const secret = process.env.JWT_SECRET;
  if (!secret) throw HTTP_ERROR.internalError('Missing JWT_SECRET');

  const token = auth.slice('Bearer '.length);

  try {
    (req as any).user = jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw HTTP_ERROR.unauthorized('Invalid token');
  }
});

const requireApiKeyMiddleware: Middleware = createMiddleware((req) => {
  const apiKey = req.header('x-api-key');
  if (apiKey && apiKey === process.env.API_KEY) return;
  throw HTTP_ERROR.unauthorized();
});

export const authenticationMiddleware = {
  jwt: requireJwtMiddleware,
  apiKey: requireApiKeyMiddleware
} as const;
