/**
 * RBAC role definitions and permission mappings.
 *
 * Used across the application for type‑safe role checks,
 * middleware guards, and UI conditional rendering.
 */

export const ROLES = {
  SUPERADMIN: 'superadmin',
  TECHNICIAN: 'technician',
  CASHIER: 'cashier',
  USER: 'user',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Permission map — defines what each role is allowed to do.
 *
 * Permissions follow the `resource:action` convention so they
 * can be checked granularly in server actions and API routes.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly string[]> = {
  superadmin: ['all'],
  technician: [
    'router:read',
    'router:write',
    'hotspot:manage',
    'voucher:generate',
    'voucher:print',
    'report:view',
  ],
  cashier: ['voucher:generate', 'voucher:print', 'report:view'],
  user: ['profile:read'],
};

/**
 * Check whether a given role has a specific permission.
 */
export function hasPermission(role: Role, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes('all') || perms.includes(permission);
}
