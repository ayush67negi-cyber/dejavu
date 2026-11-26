import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Members only"
      title={
        <>
          Welcome
          <br />
          <em className="not-italic text-cherry">back.</em>
        </>
      }
      image="/images/final-cta.jpg"
      imageAlt="A group leaving a restaurant at dusk"
      aside={
        <p className="text-[13px] leading-relaxed text-ink/50">
          Not a member yet?{' '}
          <Link href="/signup" className="border-b border-ink/40 pb-0.5 text-ink hover:border-cherry hover:text-cherry">
            Join DEJAVU
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
