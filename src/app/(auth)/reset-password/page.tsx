import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { ResetForm } from '@/components/auth/reset-form';

export const metadata: Metadata = { title: 'Choose a new password' };

export default function ResetPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title={
        <>
          Choose a
          <br />
          <em className="not-italic text-cherry">new password.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/50">
          If this link has expired,{' '}
          <Link href="/forgot-password" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            request another
          </Link>
          .
        </p>
      }
    >
      <ResetForm />
    </AuthShell>
  );
}
