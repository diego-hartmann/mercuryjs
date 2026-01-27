export default function schemaTemplate(pascalName: string): string {
  return `import { z } from 'zod';

/**
 * Resource schema (response / entity)
 */
export const ${pascalName}Schema = z.object({
  id: z.string()
});

/**
 * Body schemas
 */
export const Create${pascalName}BodySchema = z.object({
  // TODO
});

export const Update${pascalName}BodySchema = z.object({
  // TODO
});

/**
 * Params / Query schemas
 */
export const ${pascalName}IdParamSchema = z.object({
  id: z.string().min(1)
});

export const ${pascalName}QuerySchema = z.object({
  // TODO (pagination, filters, etc)
});

/**
 * Request envelopes (match validateZodMiddleware)
 * validateZodMiddleware(schema) parses: { body, query, params }
 */

export const List${pascalName}RequestSchema = z.object({
  body: z.object({}).optional(),
  query: ${pascalName}QuerySchema.optional(),
  params: z.object({}).optional()
});

export const Create${pascalName}RequestSchema = z.object({
  body: Create${pascalName}BodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const Get${pascalName}ByIdRequestSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: ${pascalName}IdParamSchema
});

export const Update${pascalName}RequestSchema = z.object({
  body: Update${pascalName}BodySchema,
  query: z.object({}).optional(),
  params: ${pascalName}IdParamSchema
});

export const Delete${pascalName}RequestSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: ${pascalName}IdParamSchema
});
`;
}
