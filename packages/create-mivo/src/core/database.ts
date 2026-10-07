import path from 'node:path';
import fs from 'node:fs';

/**
 * Initialize the SQLite database and run Drizzle migrations
 * inside the scaffolded project directory.
 *
 * This executes migrations by reading the SQL files from drizzle/
 * and applying them directly via better-sqlite3.
 */
export function initializeDatabase(projectDir: string, dbUrl = 'mivo.db'): void {
  const resolved = path.resolve(projectDir);
  const dbPath = path.resolve(resolved, dbUrl);
  const migrationsDir = path.resolve(resolved, 'drizzle');

  // Dynamically import better-sqlite3 at the resolved project path
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  let Database: typeof import('better-sqlite3');
  try {
    Database = require('better-sqlite3');
  } catch {
    // If not available globally, try the project's node_modules
    const localPath = path.resolve(resolved, 'node_modules', 'better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Database = require(localPath);
  }

  // Create / open the database
  const db = new (Database as any)(dbPath);

  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');

  // Create the Drizzle migrations journal table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at INTEGER
    );
  `);

  // Read and apply migration files in order
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  const metaDir = path.join(migrationsDir, 'meta');
  const journalPath = path.join(metaDir, '_journal.json');

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Drizzle journal not found: ${journalPath}`);
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
  const entries: Array<{ idx: number; tag: string; when: number }> = journal.entries;

  // Get already-applied migrations
  const applied = new Set<string>();
  try {
    const rows = db.prepare('SELECT hash FROM "__drizzle_migrations"').all() as Array<{ hash: string }>;
    for (const row of rows) {
      applied.add(row.hash);
    }
  } catch {
    // Table might not have rows yet
  }

  // Apply pending migrations
  for (const entry of entries) {
    const hash = entry.tag;
    if (applied.has(hash)) continue;

    const sqlFile = path.join(migrationsDir, `${hash}.sql`);
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`Migration file not found: ${sqlFile}`);
    }

    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split on Drizzle's statement breakpoint and execute each statement
    const statements = sql
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean);

    const applyMigration = db.transaction(() => {
      for (const stmt of statements) {
        db.exec(stmt);
      }
      db.prepare(
        'INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?)',
      ).run(hash, Date.now());
    });

    applyMigration();
  }

  db.close();
}
