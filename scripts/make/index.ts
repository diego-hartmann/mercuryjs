import prompts from 'prompts';
import { ArtifactType } from './module-types/feature/models';
import createFeature from './module-types/feature';
import createMiddleware from './module-types/middleware';

function promptMessage(text: string, prefix: string = ''): string {
  return `${prefix}👷🏻‍ "${text}"`;
}

async function main() {
  const { type } = await prompts({
    type: 'select',
    name: 'type',
    message: promptMessage('Hello! What would you like to create?'),
    choices: [
      { title: 'Feature', value: 'feature' },
      { title: 'Middleware', value: 'middleware' }
    ]
  });

  if (!type) {
    console.log('Canceled.');
    process.exit(0);
  }

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: promptMessage(`Great! How would you like to name your new ${type}?`),
    validate: (value) =>
      !value || !value.trim() ? promptMessage(`Whoops, your ${type}'s name cannot be empty.`) : true
  });

  const trimmed = String(name).trim();
  if (!trimmed) {
    await prompts({
      type: 'text',
      name: 'name',
      message: promptMessage(`Whoops, this name is invalid. Aborting creation of ${type}.`, '⚠️ ')
    });
    process.exit(1);
  }

  const artifactMapper: Record<ArtifactType, () => Promise<void>> = {
    feature: async () => createFeature(trimmed),
    middleware: async () => createMiddleware(trimmed)
  };
  try {
    const createdMethod = artifactMapper[type as ArtifactType];
    if (!createdMethod) {
      console.log(
        promptMessage(`Whoops, '${type}' is an invalid option. Aborting creation.`, '⚠️ ')
      );
      process.exit(1);
    }
    await createdMethod();
    console.log(
      promptMessage(`Great news! Your ${type} '${trimmed}' has been created successfully!`, '🔥 ')
    );
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => {
  console.error('Error running make.ts:', err);
  process.exit(1);
});
