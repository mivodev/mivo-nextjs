/**
 * Install module type definitions.
 */

export interface InstallInput {
  username: string;
  email: string;
  password: string;
  siteName?: string;
}

export interface InstallResult {
  username: string;
  email: string;
  installedAt: string;
}

export interface SystemStatus {
  isInstalled: boolean;
  hasDatabase: boolean;
  userCount: number;
}
