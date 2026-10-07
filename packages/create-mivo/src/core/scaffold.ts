import fs from 'node:fs';
import path from 'node:path';
import { execAsync } from './exec.js';

/**
 * Scaffold the MIVO project by cloning from the Git repository.
 *
 * Strategy:
 *  1. If `git` is available, perform a shallow clone (--depth 1).
 *  2. Remove .git directory so the user starts fresh.
 *  3. Remove packages/ directory (this CLI package itself).
 */
export async function scaffoldProject(projectDir: string): Promise<void> {
  const resolved = path.resolve(projectDir);

  if (fs.existsSync(resolved)) {
    const entries = fs.readdirSync(resolved);
    if (entries.length > 0) {
      throw new Error(
        `Directory "${resolved}" already exists and is not empty.`,
      );
    }
  }

  // Shallow clone the repository asynchronously
  const repoUrl = 'https://github.com/mivodev/mivo-nextjs.git';
  await execAsync(`git clone --depth 1 ${repoUrl} "${resolved}"`, {
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });

  // Clean up git history and CI artifacts — user should init fresh
  const gitDir = path.join(resolved, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  // Remove the CLI package directory from the scaffolded project
  const packagesDir = path.join(resolved, 'packages');
  if (fs.existsSync(packagesDir)) {
    fs.rmSync(packagesDir, { recursive: true, force: true });
  }

  // Remove workspace config since the scaffolded app is standalone
  const workspaceYaml = path.join(resolved, 'pnpm-workspace.yaml');
  if (fs.existsSync(workspaceYaml)) {
    // Rewrite without the packages: field
    const content = [
      'allowBuilds:',
      '  sharp: true',
      '  unrs-resolver: true',
      '  msw: false',
      '  better-sqlite3: true',
      '  esbuild: true',
      "  '@prisma/client': true",
      '',
    ].join('\n');
    fs.writeFileSync(workspaceYaml, content, 'utf8');
  }

  // Remove .gitmodules if present (mivo-php submodule)
  const gitmodules = path.join(resolved, '.gitmodules');
  if (fs.existsSync(gitmodules)) {
    fs.unlinkSync(gitmodules);
  }

  // Remove mivo-php submodule directory
  const mivoPhp = path.join(resolved, 'mivo-php');
  if (fs.existsSync(mivoPhp)) {
    fs.rmSync(mivoPhp, { recursive: true, force: true });
  }
}
