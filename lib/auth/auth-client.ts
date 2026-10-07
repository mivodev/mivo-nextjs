import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

/**
 * Client‑side Better Auth hooks & methods.
 *
 * Provides `useSession`, `signIn`, `signUp`, `signOut`, and
 * admin management utilities (`listUsers`, `banUser`, etc.)
 * for use in React client components.
 */
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
