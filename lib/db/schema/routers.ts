import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Routers table — stores MikroTik RouterOS connection details.
 *
 * The `rosVersion` and `connectionType` columns enable the client
 * factory to select the correct communication driver:
 *   • v7 + rest  → HTTP/HTTPS REST API (port 80/443)
 *   • v6 + native → TCP Socket API   (port 8728/8729)
 *   • auto        → attempt REST first, fall back to native socket
 */
export const routers = sqliteTable('routers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sessionName: text('session_name').notNull().unique(),
  ipAddress: text('ip_address').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),

  // RouterOS protocol & version metadata
  rosVersion: text('ros_version').default('v7').notNull(), // 'v6' | 'v7'
  connectionType: text('connection_type').default('auto').notNull(), // 'rest' | 'native' | 'auto'
  port: integer('port').default(80).notNull(),
  useSsl: integer('use_ssl', { mode: 'boolean' }).default(false).notNull(),

  // Router metadata
  hotspotName: text('hotspot_name'),
  dnsName: text('dns_name'),
  currency: text('currency').default('Rp'),
  reloadInterval: integer('reload_interval').default(60),
  description: text('description'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
