import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './client';

/**
 * Run pending database migrations programmatically.
 *
 * Called from the `/install` server action so the end‑user never
 * needs to touch a terminal — they just click "Install" in the
 * browser and the schema is provisioned automatically.
 */
export async function runMigrations(): Promise<void> {
  await migrate(db, { migrationsFolder: './drizzle' });
}
