import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { db } from '@/lib/db/client';
import * as schema from '@/lib/db/schema';

/**
 * Server‑side Better Auth instance.
 *
 * • Drizzle adapter with SQLite provider — zero external DB needed.
 * • Email + password sign‑in enabled for self‑hosted environments.
 * • Admin plugin provides RBAC with `superadmin` and `user` roles.
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'mivo_dev_secret_key_change_in_production_32bytes',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRole: 'superadmin',
    }),
  ],
});
