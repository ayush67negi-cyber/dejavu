import 'server-only';
import { redirect } from 'next/navigation';
import { getIsAdmin, getSession } from '@/lib/queries';

/**
 * Server-side authorisation. Every admin page and admin server action must call
 * this — a hidden link in the UI is never treated as access control.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/login?next=/admin');
  const admin = await getIsAdmin();
  if (!admin) redirect('/app?notice=That%20area%20is%20for%20the%20DEJAVU%20team.');
  return session;
}

export async function requireAdminApi() {
  const session = await getSession();
  if (!session) return { ok: false as const, status: 401, error: 'Not authenticated.' };
  const admin = await getIsAdmin();
  if (!admin) return { ok: false as const, status: 403, error: 'Not authorised.' };
  return { ok: true as const, user: session };
}

export async function requireMemberApi() {
  const session = await getSession();
  if (!session) return { ok: false as const, status: 401, error: 'Not authenticated.' };
  return { ok: true as const, user: session };
}
