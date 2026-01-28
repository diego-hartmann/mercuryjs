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
export const Create${pascalName}BodySchema = z.object({});
export const Update${pascalName}BodySchema = z.object({});

/**
 * Params / Query schemas
 */
export const ${pascalName}IdParamSchema = z.object({
  id: z.string().min(1)
});

// default empty; add pagination/filters later
export const ${pascalName}QuerySchema = z.object({});

/**
 * Request envelopes (match validateZodMiddleware)
 * validateZodMiddleware(schema) parses: { body, query, params }
 */

// LIST → tem query
export const List${pascalName}RequestSchema = z.object({
  body: z.object({}).optional(),
  query: ${pascalName}QuerySchema.optional(),
  params: z.object({}).optional()
});

// CREATE → sem query
export const Create${pascalName}RequestSchema = z.object({
  body: Create${pascalName}BodySchema,
  params: z.object({}).optional()
});

// GET BY ID → sem query
export const Get${pascalName}ByIdRequestSchema = z.object({
  body: z.object({}).optional(),
  params: ${pascalName}IdParamSchema
});

// UPDATE → sem query
export const Update${pascalName}RequestSchema = z.object({
  body: Update${pascalName}BodySchema,
  params: ${pascalName}IdParamSchema
});

// DELETE → sem query
export const Delete${pascalName}RequestSchema = z.object({
  body: z.object({}).optional(),
  params: ${pascalName}IdParamSchema
});
`;
}
