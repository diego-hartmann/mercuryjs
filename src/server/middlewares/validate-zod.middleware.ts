import type { AnyZodObject } from 'zod';
import { createMiddleware, Middleware } from '../../shared/utils/create-middleware';

export const validateZodMiddleware = (schema: AnyZodObject): Middleware =>
  createMiddleware((req) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    // por causa do 'createMiddleware', se falhar, Zod lança → errorHandler
    // se passar, segue automaticamente
  });
