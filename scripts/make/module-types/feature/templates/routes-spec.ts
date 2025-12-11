export default function routesSpecTemplate(
  kebabName: string,
  camelName: string,
  pluralPath: string
): string {
  return `import request from 'supertest';
import express from 'express';
import { ${camelName}Routes } from './${kebabName}.routes';

describe('${camelName}Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/${pluralPath}', ${camelName}Routes);

  it('GET /${pluralPath} returns 200', async () => {
    const res = await request(app).get('/${pluralPath}');
    expect(res.status).toBe(200);
  });
});
`;
}
