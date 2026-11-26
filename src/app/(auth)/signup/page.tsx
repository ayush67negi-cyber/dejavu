import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Join DEJAVU',
  description:
    'Become a DEJAVU member: four curated Sunday dining experiences a month at restaurants you would choose anyway. Not a dating app.',
  alternates: { canonical: '/signup' },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <AuthShell
      eyebrow="Membership · Step one"
      title={
        <>
          Begin with
          <br />
          <em className="not-italic text-cherry">your name.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/50">
          Already a member?{' '}
          <Link href="/login" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Sign in
          </Link>
          . We will ask about you after this — about ten minutes, once.
        </p>
      }
    >
      <SignupForm plan={plan} />
    </AuthShell>
  );
}
