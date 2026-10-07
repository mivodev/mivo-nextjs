/**
 * Standardized Action Result type for all server actions and API handlers.
 *
 * Every mutation/query in the application MUST return this type
 * to ensure consistent error handling across the frontend.
 */

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | {
      success: false;
      error: string;
      code?: string;
      validationErrors?: Record<string, string[]>;
    };
