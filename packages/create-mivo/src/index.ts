import { Command } from 'commander';
import React from 'react';
import { render } from 'ink';
import chalk from 'chalk';
import gradientString from 'gradient-string';
import { App } from './cli.js';
import { runDoctor } from './core/doctor.js';
import { generateSecret, writeEnvFile } from './core/env.js';
import { scaffoldProject } from './core/scaffold.js';
import { initializeDatabase } from './core/database.js';
import { seedAdmin, seedSettings } from './core/admin.js';
import { execAsync } from './core/exec.js';
import path from 'node:path';
import type { MivoConfig, PackageManager } from './types/index.js';
import { detectDefaultPackageManager, getRunCommand } from './core/pm.js';

// ─── Package metadata ───────────────────────────────────────────
const VERSION = '0.1.2';
const DEFAULT_DIR = 'mivo-app';

// ─── ASCII Banner (for non-interactive mode) ────────────────────
const BANNER = `
  __  __ _____ _    _  ____  
 |  \\/  |_   _| |  | |/ __ \\ 
 | \\  / | | | | |  | | |  | |
 | |\\/| | | | \\ \\  / / |  | |
 | |  | |_| |_ \\ \\/ /| |__| |
 |_|  |_|_____| \\__/  \\____/ 
`;

const mivoGradient = gradientString(['#6366f1', '#8b5cf6', '#a855f7']);
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// ─── Non-Interactive (Headless) Executor ────────────────────────
async function runHeadless(config: MivoConfig): Promise<void> {
  console.log(mivoGradient(BANNER));
  console.log(chalk.dim('  Next-Gen MikroTik Voucher Management Platform\n'));

  const doctor = runDoctor(config.projectDir);
  console.log(
    `  ${doctor.nodeOk ? chalk.green('✔') : chalk.red('✘')} Node.js runtime ${chalk.dim(`(${doctor.nodeVersion})`)}`,
  );
  console.log(
    `  ${doctor.dirWritable ? chalk.green('✔') : chalk.red('✘')} Directory permissions ${chalk.dim('verified')}`,
  );
  console.log();

  if (!doctor.allPassed) {
    if (!doctor.nodeOk) {
      console.error(
        chalk.red(`  Node.js >= 20.0.0 is required. Current: ${doctor.nodeVersion}`),
      );
    }
    if (!doctor.dirWritable) {
      console.error(chalk.red('  Cannot write to the target directory.'));
    }
    process.exit(1);
  }

  if (config.dryRun) {
    console.log(chalk.yellow('  Dry run mode — no files will be written.\n'));
    console.log(chalk.dim(JSON.stringify(config, null, 2)));
    process.exit(0);
  }

  // Task runner (asynchronous sequential with live animated spinner)
  const tasks = [
    {
      label: 'Scaffolding MIVO application core',
      run: async () => { await scaffoldProject(config.projectDir); },
    },
    {
      label: 'Generating cryptographic secret & .env',
      run: () => writeEnvFile(config.projectDir, config.secret),
    },
    {
      label: `Installing dependencies (${config.packageManager})`,
      run: async () => {
        await execAsync(`${config.packageManager} install`, {
          cwd: path.resolve(config.projectDir),
          env: { ...process.env, CI: 'true' },
        });
      },
    },
    {
      label: 'Provisioning SQLite database & running migrations',
      run: () => initializeDatabase(config.projectDir),
    },
    {
      label: 'Seeding superadmin account',
      run: async () => {
        await seedAdmin(config.projectDir, config.adminUser, config.adminEmail, config.adminPassword);
      },
    },
    {
      label: 'Writing system defaults',
      run: () => seedSettings(config.projectDir, config.secret),
    },
  ];

  const isTTY = Boolean(process.stdout.isTTY);

  for (const task of tasks) {
    let frameIdx = 0;
    let timer: NodeJS.Timeout | undefined;

    if (isTTY) {
      process.stdout.write(chalk.dim(`  ${SPINNER_FRAMES[0]} ${task.label}...`));
      timer = setInterval(() => {
        frameIdx = (frameIdx + 1) % SPINNER_FRAMES.length;
        process.stdout.write(`\r  ${chalk.cyan(SPINNER_FRAMES[frameIdx])} ${chalk.dim(`${task.label}...`)}`);
      }, 80);
    } else {
      console.log(chalk.dim(`  ⠋ ${task.label}...`));
    }

    try {
      await task.run();
      if (timer) clearInterval(timer);
      if (isTTY) {
        process.stdout.write(`\r  ${chalk.green('✔')} ${task.label}                            \n`);
      } else {
        console.log(`  ${chalk.green('✔')} ${task.label}`);
      }
    } catch (err) {
      if (timer) clearInterval(timer);
      if (isTTY) {
        process.stdout.write(`\r  ${chalk.red('✘')} ${task.label}                            \n`);
      } else {
        console.log(`  ${chalk.red('✘')} ${task.label}`);
      }
      const message = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`    └─ ${message}`));
      process.exit(1);
    }
  }

  // Initialize git
  try {
    const resolvedDir = path.resolve(config.projectDir);
    await execAsync('git init', { cwd: resolvedDir });
    await execAsync('git add -A', { cwd: resolvedDir });
    await execAsync('git commit -m "Initial commit from create-mivo"', { cwd: resolvedDir });
  } catch { /* Git not available — non-fatal */ }

  const dir = path.basename(path.resolve(config.projectDir));
  console.log();
  console.log(chalk.green.bold('  🎉 MIVO successfully initialized!'));
  console.log();
  console.log(chalk.white('  Next steps:'));
  console.log(chalk.cyan(`    1. cd ${dir}`));
  console.log(chalk.cyan(`    2. ${config.packageManager} install`));
  console.log(chalk.cyan(`    3. ${getRunCommand(config.packageManager, 'dev')}`));
  console.log();
  console.log(chalk.dim(`  Open ${chalk.underline('http://localhost:3000/login')} in your browser.`));
  console.log(chalk.dim(`  Administrator: ${config.adminEmail}`));
  console.log();
}

function resolvePmOption(options: Record<string, unknown>): PackageManager | undefined {
  if (typeof options.pm === 'string') {
    const val = options.pm.toLowerCase();
    if (['pnpm', 'npm', 'yarn', 'bun'].includes(val)) {
      return val as PackageManager;
    }
    console.error(chalk.red(`Invalid package manager "${options.pm}". Must be pnpm, npm, yarn, or bun.`));
    process.exit(1);
  }
  if (options.usePnpm) return 'pnpm';
  if (options.useBun) return 'bun';
  if (options.useYarn) return 'yarn';
  if (options.useNpm) return 'npm';
  return undefined;
}

// ─── Main CLI ───────────────────────────────────────────────────
const program = new Command();

program
  .name('create-mivo')
  .description('Scaffold and initialize a MIVO MikroTik management platform')
  .version(VERSION)
  .argument('[dir]', 'Target project directory', DEFAULT_DIR)
  .option('--admin-user <name>', 'Superadmin username')
  .option('--admin-email <email>', 'Superadmin email address')
  .option('--admin-password <pass>', 'Superadmin password (min 8 chars)')
  .option('--secret <hex>', 'Custom 32-byte auth secret key')
  .option('--pm <manager>', 'Package manager to use (pnpm, npm, yarn, bun)')
  .option('--use-pnpm', 'Use pnpm as package manager')
  .option('--use-npm', 'Use npm as package manager')
  .option('--use-yarn', 'Use yarn as package manager')
  .option('--use-bun', 'Use bun as package manager')
  .option('-y, --yes', 'Skip all prompts and accept defaults', false)
  .option('--dry-run', 'Simulate without writing files', false)
  .action(async (dir: string, options: Record<string, unknown>) => {
    const isNonInteractive = options.yes as boolean;
    const isDryRun = options.dryRun as boolean;
    const pmChoice = resolvePmOption(options);

    if (isNonInteractive) {
      // ── Headless mode (CI/CD, Docker, scripting) ──
      if (!options.adminPassword) {
        console.error(
          chalk.red('Error: --admin-password is required in non-interactive mode (--yes).'),
        );
        process.exit(1);
      }

      const config: MivoConfig = {
        projectDir: dir,
        packageManager: pmChoice || detectDefaultPackageManager(),
        adminUser: (options.adminUser as string) || 'admin',
        adminEmail: (options.adminEmail as string) || 'admin@mivo.local',
        adminPassword: options.adminPassword as string,
        secret: (options.secret as string) || generateSecret(),
        nonInteractive: true,
        dryRun: isDryRun,
      };

      await runHeadless(config);
    } else {
      // ── Interactive mode (Ink React terminal UI) ──
      const initialConfig: Partial<MivoConfig> = {
        projectDir: dir !== DEFAULT_DIR ? dir : undefined,
        packageManager: pmChoice,
        adminUser: options.adminUser as string | undefined,
        adminEmail: options.adminEmail as string | undefined,
        adminPassword: options.adminPassword as string | undefined,
        secret: options.secret as string | undefined,
        dryRun: isDryRun,
      };

      render(React.createElement(App, { initialConfig }));
    }
  });

program.parse();
