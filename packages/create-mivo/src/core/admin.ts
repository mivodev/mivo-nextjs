import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Seed the superadmin account directly into the SQLite database.
 *
 * This bypasses the Better Auth runtime and inserts directly into
 * the `user` and `account` tables, matching the schema from drizzle.
 * Password is hashed using scrypt (same algorithm Better Auth uses).
 */
export async function seedAdmin(
  projectDir: string,
  adminUser: string,
  adminEmail: string,
  adminPassword: string,
  dbUrl = 'mivo.db',
): Promise<void> {
  const resolved = path.resolve(projectDir);
  const dbPath = path.resolve(resolved, dbUrl);

  let Database: typeof import('better-sqlite3');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Database = require('better-sqlite3');
  } catch {
    const localPath = path.resolve(resolved, 'node_modules', 'better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Database = require(localPath);
  }

  const db = new (Database as any)(dbPath);

  const now = Date.now();
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();

  // Hash the password using scrypt (Better Auth compatible)
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(adminPassword, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
  const passwordHash = `${salt}:${hash}`;

  const seedTransaction = db.transaction(() => {
    // Insert into `user` table
    db.prepare(
      `INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at, role, banned, ban_reason, ban_expires)
       VALUES (?, ?, ?, ?, NULL, ?, ?, ?, 0, NULL, NULL)`,
    ).run(userId, adminUser, adminEmail.toLowerCase(), 1, now, now, 'superadmin');

    // Insert into `account` table (credential provider)
    db.prepare(
      `INSERT INTO "account" (id, user_id, account_id, provider_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?, ?)`,
    ).run(accountId, userId, userId, 'credential', passwordHash, now, now);
  });

  seedTransaction();
  db.close();
}

/**
 * Seed default system settings into the `settings` table.
 */
export function seedSettings(
  projectDir: string,
  secret: string,
  siteName = 'MIVO',
  dbUrl = 'mivo.db',
): void {
  const resolved = path.resolve(projectDir);
  const dbPath = path.resolve(resolved, dbUrl);

  let Database: typeof import('better-sqlite3');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Database = require('better-sqlite3');
  } catch {
    const localPath = path.resolve(resolved, 'node_modules', 'better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Database = require(localPath);
  }

  const db = new (Database as any)(dbPath);
  const now = new Date().toISOString();

  const entries = [
    { key: 'system_installed', value: 'true' },
    { key: 'site_name', value: siteName },
    { key: 'currency', value: 'Rp' },
    { key: 'auth_secret_key', value: secret },
    { key: 'installed_at', value: now },
  ];

  const upsert = db.prepare(
    `INSERT INTO "settings" ("key", "value") VALUES (?, ?)
     ON CONFLICT ("key") DO UPDATE SET "value" = excluded."value"`,
  );

  const seedTransaction = db.transaction(() => {
    for (const entry of entries) {
      upsert.run(entry.key, entry.value);
    }
  });

  seedTransaction();
  db.close();
}
