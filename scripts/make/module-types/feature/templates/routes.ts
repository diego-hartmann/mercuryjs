export default function routesTemplate(
  pascalName: string,
  kebabName: string,
  camelName: string,
  pluralKebab: string
): string {
  return `import { Router, type RequestHandler } from 'express';
import { z, type ZodTypeAny } from 'zod';
import { ${pascalName}Controller } from '../controllers/${kebabName}.controller';

// validator
import { validateZodMiddleware } from '../../server/middlewares/validate-zod.middleware';

import {
  ${pascalName}Schema,
  List${pascalName}RequestSchema,
  Create${pascalName}RequestSchema,
  Get${pascalName}ByIdRequestSchema,
  Update${pascalName}RequestSchema,
  Delete${pascalName}RequestSchema
} from '../validations/${kebabName}.schema';

type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

export type ApiRoute = {
  method: HttpMethod;
  path: string; // relative to basePath
  handler: RequestHandler;
  requestSchema: ZodTypeAny; // always validate
  responses: Record<number, { description: string; schema?: ZodTypeAny }>;
};

export type ApiContract = {
  basePath: string;
  tag: string;
  routes: ApiRoute[];
};

const controller = new ${pascalName}Controller();

export const ${camelName}Contract: ApiContract = {
  basePath: '/${pluralKebab}',
  tag: '${pascalName}',
  routes: [
    {
      method: 'get',
      path: '/',
      handler: controller.list,
      requestSchema: List${pascalName}RequestSchema,
      responses: {
        200: { description: 'OK', schema: z.array(${pascalName}Schema) }
      }
    },
    {
      method: 'post',
      path: '/',
      handler: controller.create,
      requestSchema: Create${pascalName}RequestSchema,
      responses: {
        201: { description: 'Created', schema: ${pascalName}Schema }
      }
    },
    {
      method: 'get',
      path: '/:id',
      handler: controller.getById,
      requestSchema: Get${pascalName}ByIdRequestSchema,
      responses: {
        200: { description: 'OK', schema: ${pascalName}Schema },
        404: { description: 'Not found' }
      }
    },
    {
      method: 'patch',
      path: '/:id',
      handler: controller.update,
      requestSchema: Update${pascalName}RequestSchema,
      responses: {
        200: { description: 'OK', schema: ${pascalName}Schema },
        404: { description: 'Not found' }
      }
    },
    {
      method: 'delete',
      path: '/:id',
      handler: controller.remove,
      requestSchema: Delete${pascalName}RequestSchema,
      responses: {
        204: { description: 'No Content' },
        404: { description: 'Not found' }
      }
    }
  ]
};

export const ${camelName}Routes = Router();

// Single source of truth: contract -> router
${camelName}Contract.routes.forEach((r) => {
  ${camelName}Routes[r.method](
    r.path,
    validateZodMiddleware(r.requestSchema as any),
    r.handler
  );
});
`;
}
