import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getProfile, getSession, getCategories } from '@/lib/queries';
import { Wordmark } from '@/components/ui/logo';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { LogoutButton } from '@/components/ui/logout-button';

export const metadata: Metadata = { title: 'Erzähl uns von dir' };

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/onboarding');

  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);

  return (
    <div className="min-h-[100svh] bg-ivory">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Wordmark href={null} />
          <div className="flex items-center gap-5">
            <span className="hidden text-[10px] uppercase tracking-label text-ink/35 sm:block">
              Onboarding
            </span>
            <LogoutButton className="text-[10px] uppercase tracking-[0.16em] text-ink/40 hover:text-cherry" />
          </div>
        </div>
      </header>

      <OnboardingFlow
        profile={profile}
        categories={categories}
        email={session.email ?? ''}
        initiallyComplete={Boolean(profile?.onboarding_completed)}
      />
    </div>
  );
}
