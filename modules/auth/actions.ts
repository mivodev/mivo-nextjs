"use server";

import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import type { ActionResult } from "@/lib/action-result";

/**
 * Resolve login identifier (username or email) to an email address.
 * Allows users to log in with either their username (e.g. "admin")
 * or their registered email address.
 */
export async function resolveLoginEmail(
  identifier: string,
): Promise<ActionResult<string>> {
  try {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { success: false, error: "Please enter your username or email." };
    }

    if (trimmed.includes("@")) {
      return { success: true, data: trimmed.toLowerCase() };
    }

    // Look up user by name/username
    const [foundUser] = await db
      .select({ email: user.email })
      .from(user)
      .where(or(eq(user.name, trimmed), eq(user.email, trimmed)))
      .limit(1);

    if (!foundUser) {
      return {
        success: false,
        error: "No account found with this username.",
      };
    }

    return { success: true, data: foundUser.email };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
