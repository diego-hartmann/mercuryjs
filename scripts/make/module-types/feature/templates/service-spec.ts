export default function serviceSpecTemplate(pascalName: string, kebabName: string): string {
  return `import { ${pascalName}Service } from './${kebabName}.service';

describe('${pascalName}Service', () => {
  it('creates an entity with id', () => {
    const service = new ${pascalName}Service();
    const created = service.create({});
    expect(typeof created.id).toBe('string');
    expect(created.id.length).toBeGreaterThan(0);
  });
});
`;
}
