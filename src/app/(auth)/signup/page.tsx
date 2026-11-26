import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Werde Teil von DEJAVU',
  description:
    'Werde DEJAVU-Mitglied: vier kuratierte Sonntags-Dinner pro Monat in Restaurants, die du auch selbst wählen würdest. Keine Dating-App.',
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
      eyebrow="Mitgliedschaft · Schritt eins"
      title={
        <>
          Fang mit deinem
          <br />
          <em className="not-italic text-cherry">Namen an.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/60">
          Schon Mitglied?{' '}
          <Link href="/login" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Anmelden
          </Link>
          . Danach fragen wir ein paar Dinge über dich — etwa zehn Minuten, einmalig.
        </p>
      }
    >
      <SignupForm plan={plan} />
    </AuthShell>
  );
}
