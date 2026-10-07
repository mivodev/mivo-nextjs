/**
 * Router module — shared TypeScript types.
 *
 * These types replace the mock interfaces that were previously
 * defined in `lib/mock-data.ts`. They are derived from the
 * Drizzle schema (`lib/db/schema/routers.ts`).
 */

export interface RouterRecord {
  id: string;
  name: string;
  sessionName: string;
  ipAddress: string;
  username: string;
  password: string;
  rosVersion: string;
  connectionType: string;
  port: number;
  useSsl: boolean;
  hotspotName: string | null;
  dnsName: string | null;
  currency: string | null;
  reloadInterval: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Payload for creating a new router connection. */
export interface CreateRouterInput {
  name: string;
  sessionName: string;
  ipAddress: string;
  username: string;
  password: string;
  rosVersion?: string;
  connectionType?: string;
  port?: number;
  useSsl?: boolean;
  hotspotName?: string;
  dnsName?: string;
  currency?: string;
  reloadInterval?: number;
  description?: string;
}

/** Payload for updating an existing router. */
export interface UpdateRouterInput extends Partial<CreateRouterInput> {
  id: string;
}

/** Lightweight router info for sidebar / session switcher. */
export interface RouterSessionInfo {
  id: string;
  name: string;
  sessionName: string;
  ipAddress: string;
  hotspotName: string | null;
}
