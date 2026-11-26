import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Anmelden',
  description:
    'Melde dich in deinem DEJAVU-Konto an, um deine Tische, Erlebnisse und deine Mitgliedschaft zu sehen.',
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Nur für Mitglieder"
      title={
        <>
          Schön, dass du
          <br />
          <em className="not-italic text-cherry">wieder da bist.</em>
        </>
      }
      image="/images/final-connection.jpg"
      imageAlt="Eine kleine Runde sitzt am Ende eines langen Abends entspannt und lachend am Restauranttisch."
      aside={
        <p className="text-[13px] leading-relaxed text-ink/60">
          Noch kein Mitglied?{' '}
          <Link href="/signup" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Werde Teil von DEJAVU
          </Link>
          .
        </p>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse bg-ink/5" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
