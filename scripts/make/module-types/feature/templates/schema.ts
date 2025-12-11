export default function schemaTemplate(pascalName: string): string {
  return `import { z } from 'zod';

export const ${pascalName}Schema = z.object({
  id: z.string()
});

export const Create${pascalName}BodySchema = z.object({
  // TODO
});

export const Update${pascalName}BodySchema = z.object({
  // TODO
});

export const ${pascalName}IdParamSchema = z.object({
  id: z.string().min(1)
});
`;
}
