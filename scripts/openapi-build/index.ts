import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fg from 'fast-glob';
import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry
} from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

type ApiRoute = {
  method: HttpMethod;
  path: string; // express style, e.g. '/:id'
  requestSchema?: unknown; // zod envelope: { body, query, params }
  responses: Record<number, { description: string; schema?: unknown }>;
};

type ApiContract = {
  basePath: string; // e.g. '/users'
  tag: string;
  routes: ApiRoute[];
};

function isContract(v: any): v is ApiContract {
  return (
    v &&
    typeof v === 'object' &&
    typeof v.basePath === 'string' &&
    typeof v.tag === 'string' &&
    Array.isArray(v.routes)
  );
}

function expressToOpenApiPath(p: string) {
  // '/:id' -> '/{id}'
  return p.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function extractEnvelopeParts(schema: any): {
  params?: any;
  query?: any;
  bodySchema?: any;
} {
  if (!schema || !schema._def) return {};
  // z.object shape lives here
  const shape = schema._def.shape?.();
  if (!shape) return {};

  const params = shape.params;
  const query = shape.query;
  const body = shape.body;

  // Body pode ser optional() ou z.object({})
  const bodySchema = body?._def?.innerType ?? body;

  return { params, query, bodySchema };
}

async function loadContracts(): Promise<ApiContract[]> {
  const pattern = path.join(process.cwd(), 'src/features/routes/*.routes.ts');
  const files = await fg(pattern.replace(/\\/g, '/'));

  const contracts: ApiContract[] = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);

    // procura qualquer export que “pareça” um contract
    for (const value of Object.values(mod)) {
      if (isContract(value)) contracts.push(value);
    }
  }

  return contracts;
}

async function main() {
  const registry = new OpenAPIRegistry();
  const contracts = await loadContracts();

  for (const c of contracts) {
    for (const r of c.routes) {
      const fullPath = `${c.basePath}${r.path === '/' ? '' : r.path}`;
      const openapiPath = expressToOpenApiPath(fullPath);

      const { params, query, bodySchema } = extractEnvelopeParts(r.requestSchema);

      const request: any = {};
      if (params) request.params = params;
      if (query) request.query = query;
      if (bodySchema) {
        request.body = {
          content: {
            'application/json': { schema: bodySchema }
          }
        };
      }

      const responses: any = {};
      for (const [statusStr, resp] of Object.entries(r.responses || {})) {
        const status = Number(statusStr);
        const hasSchema = !!resp.schema;

        responses[status] = hasSchema
          ? {
              description: resp.description,
              content: { 'application/json': { schema: resp.schema } }
            }
          : { description: resp.description };
      }

      registry.registerPath({
        method: r.method,
        path: openapiPath,
        tags: [c.tag],
        request: Object.keys(request).length ? request : undefined,
        responses
      });
    }
  }

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: '3.0.3',
    info: { title: 'IguanaJS API', version: '1.0.0' }
  });

  const out = path.resolve(process.cwd(), 'openapi.json');
  fs.writeFileSync(out, JSON.stringify(doc, null, 2), 'utf-8');
  console.log(`✅ OpenAPI written to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
