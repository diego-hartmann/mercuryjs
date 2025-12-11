export default function serviceTemplate(pascalName: string, kebabName: string): string {
  return `import { randomUUID } from 'crypto';
import { ${pascalName}Repository } from '../repositories/${kebabName}.repository';
import { ${pascalName} } from '../models/${kebabName}.models';

type Pagination = {
  limit: number;
  offset: number;
};

export class ${pascalName}Service {
  constructor(private readonly repo = new ${pascalName}Repository()) {}

  listAll(): ${pascalName}[] {
    return this.repo.findAll();
  }

  listPage(pagination: Pagination): { data: ${pascalName}[]; total: number } {
    const total = this.repo.count();
    const data = this.repo.findAll({
      limit: pagination.limit,
      offset: pagination.offset
    });
    return { data, total };
  }

  getById(id: string): ${pascalName} | undefined {
    return this.repo.findById(id);
  }

  create(data: Omit<${pascalName}, 'id'>): ${pascalName} {
    const entity: ${pascalName} = {
      id: randomUUID(),
      ...data
    };
    return this.repo.create(entity);
  }

  update(id: string, data: Partial<Omit<${pascalName}, 'id'>>): ${pascalName} | undefined {
    return this.repo.update(id, data as Partial<${pascalName}>);
  }

  remove(id: string): void {
    this.repo.delete(id);
  }
}
`;
}
