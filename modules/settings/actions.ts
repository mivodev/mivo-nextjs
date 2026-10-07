"use server";

/**
 * Settings module — server actions for system settings, voucher templates,
 * logos, API CORS, and plugins management.
 *
 * Settings use a key-value store in the `settings` table.
 * Voucher templates use the `voucher_templates` table.
 * Logos and plugins use filesystem-based operations.
 */

import { db } from "@/lib/db/client";
import { settings } from "@/lib/db/schema";
import { voucherTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { ActionResult } from "@/lib/action-result";
import type {
  SettingEntry,
  VoucherTemplate,
  CreateVoucherTemplateInput,
  LogoItem,
  CorsRule,
  PluginItem,
} from "./types";

// ---------------------------------------------------------------------------
// System Settings (Key-Value Store)
// ---------------------------------------------------------------------------

/** Get all settings as a key-value map. */
export async function getAllSettings(): Promise<ActionResult<Record<string, string>>> {
  try {
    const rows = await db.select().from(settings);
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return { success: true, data: map };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Get a single setting value by key. */
export async function getSetting(key: string): Promise<ActionResult<string | null>> {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return { success: true, data: row?.value ?? null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Upsert a setting key-value pair. */
export async function upsertSetting(
  key: string,
  value: string,
): Promise<ActionResult<SettingEntry>> {
  try {
    // SQLite upsert via INSERT OR REPLACE
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
    return { success: true, data: { key, value }, message: "Setting updated" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Bulk upsert settings. */
export async function bulkUpsertSettings(
  entries: SettingEntry[],
): Promise<ActionResult<{ count: number }>> {
  try {
    for (const entry of entries) {
      await db
        .insert(settings)
        .values(entry)
        .onConflictDoUpdate({ target: settings.key, set: { value: entry.value } });
    }
    return { success: true, data: { count: entries.length }, message: "Settings updated" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// Voucher Templates
// ---------------------------------------------------------------------------

/** Get all voucher templates. */
export async function getVoucherTemplates(): Promise<ActionResult<VoucherTemplate[]>> {
  try {
    const rows = await db.select().from(voucherTemplates);
    return { success: true, data: rows as VoucherTemplate[] };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Create a new voucher template. */
export async function createVoucherTemplate(
  input: CreateVoucherTemplateInput,
): Promise<ActionResult<VoucherTemplate>> {
  try {
    const now = new Date();
    const record = {
      id: randomUUID(),
      routerId: input.routerId ?? null,
      sessionName: input.sessionName,
      name: input.name,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(voucherTemplates).values(record);
    return { success: true, data: record as VoucherTemplate, message: "Template created" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Delete a voucher template by ID. */
export async function deleteVoucherTemplate(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await db.delete(voucherTemplates).where(eq(voucherTemplates.id, id));
    return { success: true, data: { id }, message: "Template deleted" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// Logos (Filesystem-based — placeholder until file upload is implemented)
// ---------------------------------------------------------------------------

/** Get all uploaded logos. Currently returns empty — filesystem integration pending. */
export async function getLogos(): Promise<ActionResult<LogoItem[]>> {
  // TODO: Scan `public/assets/img/` directory for uploaded logos
  return { success: true, data: [] };
}

// ---------------------------------------------------------------------------
// API CORS Rules (stored as JSON setting)
// ---------------------------------------------------------------------------

const CORS_SETTINGS_KEY = "api_cors_rules";

/** Get all CORS rules. */
export async function getCorsRules(): Promise<ActionResult<CorsRule[]>> {
  try {
    const result = await getSetting(CORS_SETTINGS_KEY);
    if (!result.success) return result as ActionResult<CorsRule[]>;
    const rules: CorsRule[] = result.data ? JSON.parse(result.data) : [];
    return { success: true, data: rules };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/** Save CORS rules. */
export async function saveCorsRules(
  rules: CorsRule[],
): Promise<ActionResult<{ count: number }>> {
  try {
    await upsertSetting(CORS_SETTINGS_KEY, JSON.stringify(rules));
    return { success: true, data: { count: rules.length }, message: "CORS rules saved" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ---------------------------------------------------------------------------
// Plugins (Filesystem-based — placeholder until plugin system is implemented)
// ---------------------------------------------------------------------------

/** Get all installed plugins. Currently returns empty — filesystem scan pending. */
export async function getPlugins(): Promise<ActionResult<PluginItem[]>> {
  // TODO: Scan `plugins/` directory for installed plugin manifests
  return { success: true, data: [] };
}
