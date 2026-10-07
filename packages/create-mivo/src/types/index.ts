/**
 * Shared type definitions for the create-mivo CLI.
 */

/** Supported package managers */
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

/** User-provided configuration collected during interactive prompts. */
export interface MivoConfig {
  /** Target project directory (relative or absolute path). */
  projectDir: string;

  /** Package manager to use for installing dependencies. */
  packageManager: PackageManager;

  /** Superadmin display name / username. */
  adminUser: string;

  /** Superadmin email address. */
  adminEmail: string;

  /** Superadmin password (minimum 8 characters). */
  adminPassword: string;

  /** 32-byte hex-encoded BETTER_AUTH_SECRET. Auto-generated if omitted. */
  secret: string;

  /** Skip all interactive prompts and use defaults + flags. */
  nonInteractive: boolean;

  /** Simulate execution without writing files. */
  dryRun: boolean;
}

/** Result from a single task in the execution pipeline. */
export interface TaskResult {
  name: string;
  success: boolean;
  message?: string;
  durationMs: number;
}

/** Environment doctor check result. */
export interface DoctorResult {
  nodeVersion: string;
  nodeOk: boolean;
  dirWritable: boolean;
  dirExists: boolean;
  allPassed: boolean;
}
