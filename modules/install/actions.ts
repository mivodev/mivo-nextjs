"use server";

import { db } from "@/lib/db/client";
import { user, settings } from "@/lib/db/schema";
import { auth } from "@/lib/auth/auth";
import { runMigrations } from "@/lib/db/migrate";
import { isSystemInstalled, invalidateInstallCache } from "@/lib/auth/install-guard";
import { eq, count } from "drizzle-orm";
import type { ActionResult } from "@/lib/action-result";
import type { InstallInput, InstallResult, SystemStatus } from "./types";

/**
 * Check current system installation status.
 */
export async function getSystemStatus(): Promise<ActionResult<SystemStatus>> {
  try {
    const installed = await isSystemInstalled();
    let totalUsers = 0;
    try {
      const result = await db.select({ value: count() }).from(user);
      totalUsers = result[0]?.value ?? 0;
    } catch {
      // Table may not exist yet
    }

    return {
      success: true,
      data: {
        isInstalled: installed,
        hasDatabase: true,
        userCount: totalUsers,
      },
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Execute system installation:
 * 1. Provision database tables (run Drizzle migrations)
 * 2. Create the first superadministrator account via Better Auth
 * 3. Seed default system settings
 * 4. Update the installation state
 */
export async function runSystemInstall(
  input: InstallInput,
): Promise<ActionResult<InstallResult>> {
  try {
    // 1. Pre-validation checks
    if (!input.username?.trim()) {
      return { success: false, error: "Username is required." };
    }
    if (!input.email?.trim() || !input.email.includes("@")) {
      return { success: false, error: "A valid email address is required." };
    }
    if (!input.password || input.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    // 2. Prevent re-installation if already completed
    const alreadyInstalled = await isSystemInstalled();
    if (alreadyInstalled) {
      return {
        success: false,
        error: "The system is already installed. Re-installation is blocked.",
      };
    }

    // 3. Run database migrations to ensure all tables exist
    await runMigrations();

    // 4. Create superadmin account via Better Auth
    await auth.api.signUpEmail({
      body: {
        name: input.username.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
      },
    });

    // 5. Elevate role to superadmin
    await db
      .update(user)
      .set({ role: "superadmin" })
      .where(eq(user.email, input.email.trim().toLowerCase()));

    // 6. Seed default system settings
    const now = new Date().toISOString();
    const defaultSettings = [
      { key: "system_installed", value: "true" },
      { key: "site_name", value: input.siteName?.trim() || "MIVO" },
      { key: "currency", value: "Rp" },
      { key: "installed_at", value: now },
    ];

    for (const item of defaultSettings) {
      await db
        .insert(settings)
        .values(item)
        .onConflictDoUpdate({ target: settings.key, set: { value: item.value } });
    }

    // 7. Clear install cache
    invalidateInstallCache();

    return {
      success: true,
      data: {
        username: input.username.trim(),
        email: input.email.trim().toLowerCase(),
        installedAt: now,
      },
      message: "Installation completed successfully.",
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
