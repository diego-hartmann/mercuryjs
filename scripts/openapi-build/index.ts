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

function zodObjectShape(schema: any) {
  return schema?._def?.shape?.();
}

function unwrapOptional(t: any) {
  return t?._def?.innerType ?? t;
}

function extractEnvelopeParts(schema: any): {
  query?: any;
  bodySchema?: any;
} {
  const shape = zodObjectShape(schema);
  if (!shape) return {};

  const query = shape.query;
  const body = shape.body;

  const bodySchema = body?._def?.innerType ?? body;

  return { query, bodySchema };
}

/**
 * Universal: Zod query object -> OpenAPI query parameters with auto metadata
 */
function querySchemaToParameters(querySchema: any) {
  const shape = zodObjectShape(querySchema);
  if (!shape) return [];

  return Object.entries(shape).map(([key, zodType]: any) => {
    const base = unwrapOptional(zodType);
    const schemaWithParam =
      typeof base?.openapi === 'function'
        ? base.openapi({ param: { name: key, in: 'query' } })
        : base;

    return {
      name: key,
      in: 'query',
      required: false,
      schema: schemaWithParam
    };
  });
}

/**
 * Universal: path '/cars/{id}' -> OpenAPI path parameters
 * (No need to rely on Zod params schema metadata)
 */
function pathToPathParameters(openapiPath: string) {
  const names = Array.from(openapiPath.matchAll(/\{([A-Za-z0-9_]+)\}/g)).map((m) => m[1]);

  return names.map((name) => ({
    name,
    in: 'path',
    required: true,
    schema: z.string().openapi({ param: { name, in: 'path' } })
  }));
}

async function loadContracts(): Promise<ApiContract[]> {
  const pattern = path.join(process.cwd(), 'src/features/routes/*.routes.ts');
  const files = await fg(pattern.replace(/\\/g, '/'));

  const contracts: ApiContract[] = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);

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

      const { query, bodySchema } = extractEnvelopeParts(r.requestSchema);

      const request: any = {};
      if (bodySchema) {
        request.body = {
          content: { 'application/json': { schema: bodySchema } }
        };
      }

      const queryParameters = query ? querySchemaToParameters(query) : [];
      const pathParameters = pathToPathParameters(openapiPath);

      const parameters = [...pathParameters, ...queryParameters];

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
        parameters: parameters.length ? parameters : undefined,
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
  console.log(`🦎  OpenAPI written to openapi.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
