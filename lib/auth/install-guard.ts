import { db } from '@/lib/db/client';
import { user } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

/**
 * Determine whether the system has been installed.
 *
 * The heuristic is simple: if at least one user row exists in the
 * database the system is considered installed.  If the `user` table
 * does not exist yet (first boot), the query will throw and we
 * return `false`.
 */
export async function isSystemInstalled(): Promise<boolean> {
  try {
    const result = await db.select({ value: count() }).from(user);
    const totalUsers = result[0]?.value ?? 0;
    return totalUsers > 0;
  } catch {
    // Table doesn't exist yet — not installed
    return false;
  }
}
