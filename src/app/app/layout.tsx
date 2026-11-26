import { redirect } from 'next/navigation';
import { getProfile, getSession, getIsAdmin, getMembership } from '@/lib/queries';
import { AppShell } from '@/components/app/app-shell';

export const dynamic = 'force-dynamic';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?next=/app');

  const [profile, isAdmin, membership] = await Promise.all([
    getProfile(),
    getIsAdmin(),
    getMembership(),
  ]);

  // Anyone who has not finished onboarding is sent back to it.
  if (profile && !profile.onboarding_completed) redirect('/onboarding');

  if (profile && profile.status === 'suspended') {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ivory px-5">
        <div className="max-w-[520px] border border-ink/15 p-8">
          <p className="label text-cherry">Account suspended</p>
          <h1 className="mt-4 font-serif text-[32px] leading-tight text-ink">
            Your account is currently suspended.
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
            This usually follows a safety review. Write to us and we will explain why and what
            happens next.
          </p>
          <a href="/contact" className="btn mt-6 bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
            Contact DEJAVU
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      profile={profile}
      isAdmin={isAdmin}
      membershipStatus={membership?.status ?? null}
      email={session.email ?? ''}
    >
      {children}
    </AppShell>
  );
}
