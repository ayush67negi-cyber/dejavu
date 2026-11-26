import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { ResetForm } from '@/components/auth/reset-form';

export const metadata: Metadata = {
  title: 'Neues Passwort wählen',
  description: 'Wähle ein neues Passwort für dein DEJAVU-Konto.',
};

export default function ResetPage() {
  return (
    <AuthShell
      eyebrow="Konto wiederherstellen"
      title={
        <>
          Wähle ein
          <br />
          <em className="not-italic text-cherry">neues Passwort.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/60">
          Falls dieser Link abgelaufen ist,{' '}
          <Link href="/forgot-password" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            fordere einen neuen an
          </Link>
          .
        </p>
      }
    >
      <ResetForm />
    </AuthShell>
  );
}
