import path from 'path';
import ROOT from '../../utils/ROOT';
import { toCase } from '../../utils/case';
import { writeFileIfNotExists } from '../../utils/create-file';
import middlewareTemplate from './templates/middleware';
import { runPrettierOn } from '../../../shared';

export default async function createMiddleware(nameInput: string) {
  const { kebab, camel } = toCase(nameInput);

  const baseDir = path.join(ROOT, 'src', 'server', 'middlewares');

  writeFileIfNotExists(path.join(baseDir, `${kebab}.middleware.ts`), middlewareTemplate(camel));

  runPrettierOn([baseDir]);
  console.log(`🚀  Created middleware '${kebab}'`);
}
