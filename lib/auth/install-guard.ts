import { db } from '@/lib/db/client';
import { user } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

let cachedInstalled: boolean | null = null;

/**
 * Determine whether the system has been installed.
 *
 * If at least one user exists, system is installed.
 * Uses an in-memory cache once installed is true to prevent
 * repeated database roundtrips on every page navigation.
 */
export async function isSystemInstalled(): Promise<boolean> {
  if (cachedInstalled === true) {
    return true;
  }

  try {
    const result = await db.select({ value: count() }).from(user);
    const totalUsers = result[0]?.value ?? 0;
    const installed = totalUsers > 0;
    if (installed) {
      cachedInstalled = true;
    }
    return installed;
  } catch {
    // Table doesn't exist yet — not installed
    return false;
  }
}

/**
 * Invalidate the in-memory installed cache flag.
 * Used immediately after running initial setup.
 */
export function invalidateInstallCache(): void {
  cachedInstalled = null;
}
