import { execSync } from 'node:child_process';
import type { PackageManager } from '../types/index.js';

/**
 * Check if a package manager binary is accessible on the host system.
 */
export function isBinaryAvailable(bin: string): boolean {
  try {
    execSync(`${bin} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect the most suitable package manager:
 * 1. Honors npm_config_user_agent if run via pnpm / bun / yarn.
 * 2. If run via npx / npm, prioritizes pnpm if pnpm is installed (since MIVO uses pnpm-lock.yaml).
 * 3. Fallbacks to bun -> yarn -> npm depending on availability.
 */
export function detectDefaultPackageManager(): PackageManager {
  const agent = process.env.npm_config_user_agent ?? '';

  if (agent.startsWith('pnpm')) return 'pnpm';
  if (agent.startsWith('bun')) return 'bun';
  if (agent.startsWith('yarn')) return 'yarn';

  // Even if invoked via npx, check if pnpm is available because MIVO is optimized for pnpm
  if (isBinaryAvailable('pnpm')) return 'pnpm';
  if (isBinaryAvailable('bun')) return 'bun';
  if (isBinaryAvailable('yarn')) return 'yarn';

  return 'npm';
}

/**
 * Get script execution command for a given package manager.
 * e.g., pnpm dev vs npm run dev
 */
export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'bun':
      return `bun ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'npm':
      return `npm run ${script}`;
  }
}
