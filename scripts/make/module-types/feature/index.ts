import path from 'path';
import { ensureDir } from '../../utils/dir';
import { writeFileIfNotExists } from '../../utils/create-file';
import { runPrettierOn } from '../../../shared';
import { toCase } from '../../utils/case';
import repositoryTemplate from './templates/repository';
import serviceTemplate from './templates/service';
import serviceSpecTemplate from './templates/service-spec';
import controllerTemplate from './templates/controller';
import routesTemplate from './templates/routes';
import routesSpecTemplate from './templates/routes-spec';
import schemaTemplate from './templates/schema';
import typesTemplate from './templates/types';
import injectFeatureIntoServerRoutes from '../../utils/inject-feature-into-routes';
import smokeTestTemplate from './templates/smoke-test';
import prismaDatasourceTemplate from './templates/datasource/prisma';
import prismaModelTemplate from './templates/datasource/prisma.model';
import ROOT from '../../../utils/ROOT';

export default async function createFeature(nameInput: string, isEntityInDatabase: boolean) {
  const { kebab, pascal, camel } = toCase(nameInput);

  const pluralKebab = `${kebab}s`;

  const baseDir = path.join(ROOT, 'src', 'features');
  const smokeTestsDir = path.join(ROOT, 'tests', 'api');

  const dirs = {
    controllers: path.join(baseDir, 'controllers'),
    schema: path.join(baseDir, 'validations'),
    types: path.join(baseDir, 'models'),
    repositories: path.join(baseDir, 'repositories'),
    services: path.join(baseDir, 'services'),
    routes: path.join(baseDir, 'routes'),
    smokeTests: path.join(smokeTestsDir, 'smoke'),
    // stores
    dataSources: path.join(baseDir, 'data-sources'),
    //
    prisma: path.join(ROOT, 'prisma/models')
  };

  Object.values(dirs).forEach(ensureDir);

  const files = {
    models: path.join(dirs.types, `${kebab}.models.ts`),
    schema: path.join(dirs.schema, `${kebab}.schema.ts`),
    repository: path.join(dirs.repositories, `${kebab}.repository.ts`),
    service: path.join(dirs.services, `${kebab}.service.ts`),
    serviceSpec: path.join(dirs.services, `${kebab}.service.spec.ts`),
    controller: path.join(dirs.controllers, `${kebab}.controller.ts`),
    routes: path.join(dirs.routes, `${kebab}.routes.ts`),
    routesSpec: path.join(dirs.routes, `${kebab}.routes.spec.ts`),
    smokeTest: path.join(dirs.smokeTests, `${kebab}.smoke.spec.ts`),
    // postgres
    prismaDataSource: path.join(dirs.dataSources, `${kebab}.prisma.ts`),
    prismaModel: path.join(dirs.prisma, `${kebab}.prisma`)
  };

  console.log('\n🦎  Writing basic files...');
  writeFileIfNotExists(files.models, typesTemplate(pascal));
  writeFileIfNotExists(files.schema, schemaTemplate(pascal));
  writeFileIfNotExists(files.service, serviceTemplate(pascal, kebab, isEntityInDatabase));
  writeFileIfNotExists(files.serviceSpec, serviceSpecTemplate(pascal, kebab));
  writeFileIfNotExists(files.controller, controllerTemplate(pascal, kebab, isEntityInDatabase));
  writeFileIfNotExists(files.routes, routesTemplate(pascal, kebab, camel, pluralKebab));
  writeFileIfNotExists(files.routesSpec, routesSpecTemplate(kebab, camel, pluralKebab));
  writeFileIfNotExists(files.smokeTest, smokeTestTemplate(pascal, camel));

  if (isEntityInDatabase) {
    console.log('\n🦎  Writing files for Prisma (PostgresDB)...');
    writeFileIfNotExists(files.repository, repositoryTemplate(pascal, kebab));
    writeFileIfNotExists(files.prismaDataSource, prismaDatasourceTemplate(pascal, kebab, camel));
    writeFileIfNotExists(files.prismaModel, prismaModelTemplate(pascal));
  }

  injectFeatureIntoServerRoutes({
    kebab,
    pluralKebab,
    pluralCamel: camel
  });

  console.log(`\n🦎  Applying prettier in ${nameInput}s files...`);
  runPrettierOn([baseDir]);
}
