import { execSync } from 'child_process';

export function runPrettierOn(paths: string[]) {
  try {
    const quoted = paths.map((p) => `"${p}"`).join(' ');
    execSync(`npx prettier --write ${quoted}`, { stdio: 'inherit' });
  } catch (e) {
    console.warn(`⚠️  Prettier failed or not installed. Skipping format. ${e}`);
  }
}
