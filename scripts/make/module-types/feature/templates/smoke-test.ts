export default function smokeTestTemplate(pascalName: string, camelName: string): string {
  return `import request from 'supertest';
import { app } from '../../../src/server/app';

describe('🚬 Smoke: ${pascalName}', () => {
  const baseUrl = '/${camelName}s';

  it('GET / -> 200', async () => {
    await request(app).get(baseUrl).expect(200);
  });

  it('GET /:id (inexistente) -> 404 + { message }', async () => {
    const res = await request(app)
      .get(\`\${baseUrl}/__smoke_not_found__\`)
      .expect(404);

    expect(res.body).toEqual({
      message: expect.any(String)
    });
  });
});
`;
}
