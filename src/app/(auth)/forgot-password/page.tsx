import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotForm } from '@/components/auth/forgot-form';

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen',
  description: 'Fordere einen Link zum Zurücksetzen deines DEJAVU-Passworts an.',
};

export default function ForgotPage() {
  return (
    <AuthShell
      eyebrow="Konto wiederherstellen"
      title={
        <>
          Ein neuer
          <br />
          <em className="not-italic text-cherry">Schlüssel.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/60">
          Doch wieder eingefallen?{' '}
          <Link href="/login" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Anmelden
          </Link>
          .
        </p>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
