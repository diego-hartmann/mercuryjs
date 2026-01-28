export default function repositoryTemplate(pascalName: string, kebabName: string): string {
  return `import { getPrisma } from '../../../store/prisma-client';
import type { ${pascalName} } from '../models/${kebabName}.models';
import { PrismaCrudRepository } from '../data-sources/base-classes/prisma-crud.repository';

export class ${pascalName}Repository extends PrismaCrudRepository<${pascalName}> {
  constructor() {
    super(getPrisma().${kebabName});
  }

  // TODO Add custom methods here (e.g. findByEmail, search, etc)
}
`;
}
