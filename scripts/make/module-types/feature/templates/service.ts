export default function serviceTemplate(
  pascalName: string,
  kebabName: string,
  isDatabaseEntity: boolean = true
): string {
  if (!isDatabaseEntity) {
    return `export class ${pascalName}Service {
      // TODO add logic here
    }
`;
  }

  return `import { ${pascalName}Repository } from '../repositories/${kebabName}.repository';
import type { ${pascalName} } from '../models/${kebabName}.models';
import type { Pagination } from '../../shared/utils/pagination.util';

export class ${pascalName}Service {
  constructor(private readonly repo = new ${pascalName}Repository()) {}

  async listAll(): Promise<${pascalName}[]> {
    return this.repo.findAll();
  }

  async listPage(pagination: Pagination): Promise<{ data: ${pascalName}[]; total: number }> {
    const [data, total] = await Promise.all([this.repo.findAll(pagination), this.repo.count()]);
    return { data, total };
  }

  async getById(id: string): Promise<${pascalName} | null> {
    return this.repo.findById(id);
  }

  async create(data: Omit<${pascalName}, 'id'>): Promise<${pascalName}> {
    return this.repo.create(data);
  }

  async update(id: string, data: Partial<Omit<${pascalName}, 'id'>>): Promise<${pascalName} | null> {
    return this.repo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
`;
}
