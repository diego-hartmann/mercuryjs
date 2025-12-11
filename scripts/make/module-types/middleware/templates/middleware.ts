export default function middlewareTemplate(camel: string): string {
  return `import { createMiddleware, Middleware } from '../../shared/utils/create-middleware';
    export const ${camel}Middleware: Middleware = createMiddleware((req, res, next) => {
  })`;
}
