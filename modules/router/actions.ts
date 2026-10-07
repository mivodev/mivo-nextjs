"use server";

/**
 * Router module — server actions for CRUD operations.
 *
 * All mutations go through Drizzle ORM against the `routers` table.
 * No direct DB access is allowed from client/page components.
 */

import { db } from "@/lib/db/client";
import { routers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { ActionResult } from "@/lib/action-result";
import type { RouterRecord, CreateRouterInput, UpdateRouterInput, RouterSessionInfo } from "./types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all registered routers. */
export async function getRouters(): Promise<ActionResult<RouterRecord[]>> {
  try {
    const rows = await db.select().from(routers);
    return { success: true, data: rows as RouterRecord[] };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Fetch lightweight router list for sidebar / session switcher. */
export async function getRouterSessions(): Promise<ActionResult<RouterSessionInfo[]>> {
  try {
    const rows = await db
      .select({
        id: routers.id,
        name: routers.name,
        sessionName: routers.sessionName,
        ipAddress: routers.ipAddress,
        hotspotName: routers.hotspotName,
      })
      .from(routers);
    return { success: true, data: rows };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Fetch a single router by its session name. */
export async function getRouterBySessionName(
  sessionName: string,
): Promise<ActionResult<RouterRecord | null>> {
  try {
    const [row] = await db
      .select()
      .from(routers)
      .where(eq(routers.sessionName, sessionName))
      .limit(1);
    return { success: true, data: (row as RouterRecord) ?? null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Create a new router connection. */
export async function createRouter(
  input: CreateRouterInput,
): Promise<ActionResult<RouterRecord>> {
  try {
    const now = new Date();
    const id = randomUUID();

    const record = {
      id,
      name: input.name,
      sessionName: input.sessionName,
      ipAddress: input.ipAddress,
      username: input.username,
      password: input.password,
      rosVersion: input.rosVersion ?? "v7",
      connectionType: input.connectionType ?? "auto",
      port: input.port ?? 80,
      useSsl: input.useSsl ?? false,
      hotspotName: input.hotspotName ?? null,
      dnsName: input.dnsName ?? null,
      currency: input.currency ?? "Rp",
      reloadInterval: input.reloadInterval ?? 60,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(routers).values(record);
    return { success: true, data: record as RouterRecord, message: "Router created successfully" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Update an existing router. */
export async function updateRouter(
  input: UpdateRouterInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, ...fields } = input;
    await db
      .update(routers)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(routers.id, id));
    return { success: true, data: { id }, message: "Router updated successfully" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Delete a router by ID. */
export async function deleteRouter(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await db.delete(routers).where(eq(routers.id, id));
    return { success: true, data: { id }, message: "Router deleted successfully" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
