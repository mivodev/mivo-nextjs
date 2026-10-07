import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Settings table — generic key‑value store for system‑wide configuration.
 *
 * Examples: `app_name`, `language`, `timezone`, `theme`, etc.
 */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
