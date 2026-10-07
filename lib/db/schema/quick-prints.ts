import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { routers } from './routers';

/**
 * Quick Prints table — voucher printing shortcut profiles.
 *
 * Each quick‑print entry is tied to a specific router and
 * pre‑fills the voucher generation form with sensible defaults
 * (profile, prefix, price, time/data limits, etc.).
 */
export const quickPrints = sqliteTable('quick_prints', {
  id: text('id').primaryKey(),
  routerId: text('router_id').references(() => routers.id, {
    onDelete: 'cascade',
  }),
  sessionName: text('session_name').notNull(),
  name: text('name').notNull(),
  server: text('server').notNull(),
  profile: text('profile').notNull(),
  prefix: text('prefix').default(''),
  charLength: integer('char_length').default(4),
  price: integer('price').default(0),
  sellingPrice: integer('selling_price').default(0),
  timeLimit: text('time_limit').default(''),
  dataLimit: text('data_limit').default(''),
  comment: text('comment').default(''),
  color: text('color').default('bg-blue-500'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Voucher Templates table — custom voucher print layouts.
 */
export const voucherTemplates = sqliteTable('voucher_templates', {
  id: text('id').primaryKey(),
  routerId: text('router_id').references(() => routers.id, {
    onDelete: 'cascade',
  }),
  sessionName: text('session_name').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
