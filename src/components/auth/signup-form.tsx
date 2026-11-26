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
            ? 'Für diese E-Mail-Adresse gibt es bereits ein Konto. Melde dich stattdessen an.'
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
        `Wir haben einen Bestätigungslink an ${parsed.data.email} geschickt. Öffne ihn, um dein Konto zu aktivieren, und vervollständige danach dein Profil.`,
      );
    } catch {
      setState('error');
      setMessage('Wir konnten den Server nicht erreichen. Bitte versuche es noch einmal.');
    }
  }

  if (state === 'verify') {
    return (
      <div className="border border-ink/15 p-6">
        <CheckCircle2 className="h-5 w-5 text-olive" strokeWidth={1.5} />
        <p className="mt-4 font-serif text-[22px] leading-tight text-ink">Schau in dein Postfach.</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{message}</p>
        <Link
          href="/login"
          className="mt-6 inline-block border-b border-ink/40 pb-0.5 text-[11px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
        >
          Zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div>
        <label htmlFor="fullName" className="label text-ink/40">
          Vollständiger Name
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          className="field mt-2"
          placeholder="So möchtest du vorgestellt werden"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="label text-ink/40">
          E-Mail
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
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="field mt-2"
          placeholder="Mindestens 8 Zeichen"
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
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Konto wird erstellt
          </>
        ) : (
          'Konto erstellen'
        )}
      </button>

      <p className="text-[11px] leading-relaxed text-ink/40">
        Mit deinem Beitritt bestätigst du, dass du mindestens 18 Jahre alt bist, und akzeptierst
        unsere{' '}
        <Link href="/terms" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
          AGB
        </Link>{' '}
        und die{' '}
        <Link href="/privacy" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
          Datenschutzerklärung
        </Link>
        . DEJAVU ist eine Plattform für Freundschaften, keine Dating-App.
      </p>
    </form>
  );
}
