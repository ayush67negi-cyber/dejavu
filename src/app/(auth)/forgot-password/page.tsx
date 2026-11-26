import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotForm } from '@/components/auth/forgot-form';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title={
        <>
          A new
          <br />
          <em className="not-italic text-cherry">key.</em>
        </>
      }
      aside={
        <p className="text-[13px] leading-relaxed text-ink/50">
          Remembered it?{' '}
          <Link href="/login" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Sign in
          </Link>
          .
        </p>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
