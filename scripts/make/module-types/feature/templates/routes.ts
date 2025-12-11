export default function routesTemplate(
  pascalName: string,
  kebabName: string,
  camelName: string
): string {
  return `import { Router } from 'express';
import { ${pascalName}Controller } from '../controllers/${kebabName}.controller';
// validator
import { validateZodMiddleware } from '../../server/middlewares/validate-zod.middleware';
import {
  Create${pascalName}BodySchema,
  Update${pascalName}BodySchema,
  ${pascalName}IdParamSchema
} from '../validations/${kebabName}.schema';

export const ${camelName}Routes = Router();
const controller = new ${pascalName}Controller();

${camelName}Routes.get('/', controller.list);

${camelName}Routes.post(
  '/',
  validateZodMiddleware(Create${pascalName}BodySchema),
  controller.create
);

${camelName}Routes.get(
  '/:id',
  validateZodMiddleware(${pascalName}IdParamSchema),
  controller.getById
);

${camelName}Routes.patch(
  '/:id',
  validateZodMiddleware(Update${pascalName}BodySchema),
  controller.update
);

${camelName}Routes.delete(
  '/:id',
  validateZodMiddleware(${pascalName}IdParamSchema),
  controller.remove
);
`;
}
