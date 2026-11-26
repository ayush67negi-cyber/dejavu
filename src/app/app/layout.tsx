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

  // Wer das Onboarding nicht abgeschlossen hat, landet wieder dort.
  if (profile && !profile.onboarding_completed) redirect('/onboarding');

  if (profile && profile.status === 'suspended') {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ivory px-5">
        <div className="max-w-[520px] border border-ink/15 p-8">
          <p className="label text-cherry">Konto gesperrt</p>
          <h1 className="mt-4 font-serif text-[32px] leading-tight text-ink">
            Dein Konto ist derzeit gesperrt.
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
            Meist folgt das auf eine Sicherheitsprüfung. Schreib uns – wir erklären dir, warum, und
            wie es weitergeht.
          </p>
          <a href="/contact" className="btn mt-6 bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
            Schreib DEJAVU
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
