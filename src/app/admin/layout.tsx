import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin studio', template: '%s · DEJAVU Admin' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell email={session.email ?? ''}>{children}</AdminShell>;
}
