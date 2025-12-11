export default function controllerTemplate(pascalName: string, kebabName: string): string {
  return `import { Request, Response } from 'express';
import { ${pascalName}Service } from '../services/${kebabName}.service';
import {
  Create${pascalName}BodySchema,
  Update${pascalName}BodySchema
} from '../validations/${kebabName}.schema';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_ERROR } from '../../shared/errors/http-error.util';
import { parsePagination, toPaginatedResponse } from '../../shared/utils/pagination.util';

export class ${pascalName}Controller {
  constructor(private readonly service = new ${pascalName}Service()) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const all = req.query.all === 'true';

    if (all) {
      const data = this.service.listAll();
      res.status(200).json({ data });
      return;
    }

    const pagination = parsePagination(req.query);
    const { data, total } = this.service.listPage(pagination);

    res.status(200).json(toPaginatedResponse(data, total, pagination));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const entity = this.service.getById(req.params.id!);
    if (!entity) throw HTTP_ERROR.notFound('${pascalName} not found');
    res.status(200).json(entity);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const data = Create${pascalName}BodySchema.parse(req.body);
    const created = this.service.create(data);
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const data = Update${pascalName}BodySchema.parse(req.body);
    const updated = this.service.update(req.params.id!, data);
    if (!updated) throw HTTP_ERROR.notFound('${pascalName} not found');
    res.status(200).json(updated);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    this.service.remove(req.params.id!);
    res.status(204).send();
  });
}
`;
}
