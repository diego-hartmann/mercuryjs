export default function repositoryTemplate(pascalName: string, kebabName: string): string {
  return `import { ${pascalName} } from '../models/${kebabName}.models';

type FindAllParams = {
  limit?: number;
  offset?: number;
};

export class ${pascalName}Repository {
  private store = new Map<string, ${pascalName}>();

  count(): number {
    return this.store.size;
  }

  findAll(params?: FindAllParams): ${pascalName}[] {
    const values = Array.from(this.store.values());

    if (!params?.limit && !params?.offset) return values;

    const offset = params.offset ?? 0;
    const limit = params.limit ?? values.length;

    return values.slice(offset, offset + limit);
  }

  findById(id: string): ${pascalName} | undefined {
    return this.store.get(id);
  }

  create(entity: ${pascalName}): ${pascalName} {
    this.store.set(entity.id, entity);
    return entity;
  }

  update(id: string, data: Partial<${pascalName}>): ${pascalName} | undefined {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    const updated: ${pascalName} = { ...existing, ...data };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
`;
}
