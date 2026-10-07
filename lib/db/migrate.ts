import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './client';
import path from 'path';

/**
 * Run pending database migrations programmatically.
 * Uses path.resolve to guarantee absolute path resolution in all runtimes.
 */
export async function runMigrations(): Promise<void> {
  const migrationsFolder = path.resolve(process.cwd(), 'drizzle');
  await migrate(db, { migrationsFolder });
}
