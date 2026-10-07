import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

/**
 * Singleton SQLite database connection.
 *
 * WAL (Write‑Ahead Logging) is enabled for improved concurrent
 * read/write performance on self‑hosted deployments.
 */
const sqlite = new Database(process.env.DATABASE_URL || 'mivo.db');
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
