'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/validation';

type State = 'idle' | 'loading' | 'verify' | 'error';

export function SignupForm({ plan }: { plan?: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMessage('');

    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      setState('error');
      setMessage(parsed.error.issues[0]?.message ?? 'Please check your details.');
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { full_name: parsed.data.fullName, preferred_plan: plan ?? null },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        setState('error');
        setMessage(
          error.message.includes('already registered')
            ? 'An account already exists for this email. Try signing in instead.'
            : error.message,
        );
        return;
      }

      if (data.session) {
        router.push('/onboarding');
        router.refresh();
        return;
      }

      setState('verify');
      setMessage(
        `We’ve sent a confirmation link to ${parsed.data.email}. Open it to activate your account, then finish your profile.`,
      );
    } catch {
      setState('error');
      setMessage('We could not reach the server. Please try again.');
    }
  }

  if (state === 'verify') {
    return (
      <div className="border border-ink/15 p-6">
        <CheckCircle2 className="h-5 w-5 text-olive" strokeWidth={1.5} />
        <p className="mt-4 font-serif text-[22px] leading-tight text-ink">Check your inbox.</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{message}</p>
        <Link
          href="/login"
          className="mt-6 inline-block border-b border-ink/40 pb-0.5 text-[11px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div>
        <label htmlFor="fullName" className="label text-ink/40">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          className="field mt-2"
          placeholder="As you’d like to be introduced"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="label text-ink/40">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="field mt-2"
          placeholder="you@domain.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="label text-ink/40">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="field mt-2"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      {state === 'error' && (
        <p className="flex items-start gap-2 border-l-2 border-cherry bg-cherry/5 py-3 pl-3 text-[13px] text-cherry">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn w-full bg-ink py-[17px] text-ivory transition-colors duration-500 hover:bg-cherry disabled:opacity-60"
      >
        {state === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Creating your account
          </>
        ) : (
          'Create account'
        )}
      </button>

      <p className="text-[11px] leading-relaxed text-ink/40">
        By joining you confirm you are 18 or older and accept our{' '}
        <Link href="/terms" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
          terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
          privacy policy
        </Link>
        . DEJAVU is a friendship platform, not a dating app.
      </p>
    </form>
  );
}
