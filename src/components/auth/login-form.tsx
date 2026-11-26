'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/app';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const notice = params.get('notice');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Bitte prüfe deine Angaben.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (err) {
        setError(
          err.message.toLowerCase().includes('invalid')
            ? 'Diese Kombination aus E-Mail und Passwort passt zu keinem Konto.'
            : err.message,
        );
        setLoading(false);
        return;
      }
      router.push(next.startsWith('/') ? next : '/app');
      router.refresh();
    } catch {
      setError('Wir konnten den Server nicht erreichen. Bitte versuche es noch einmal.');
      setLoading(false);
    }
  }

  async function google() {
    setError('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
      });
      if (err) {
        setError(
          'Die Anmeldung mit Google ist für dieses Projekt noch nicht aktiviert. Hinterlege die Google-Zugangsdaten in Supabase → Authentication → Providers.',
        );
      }
    } catch {
      setError('Die Anmeldung mit Google ist gerade nicht verfügbar.');
    }
  }

  return (
    <div>
      {notice && (
        <p className="mb-6 border-l-2 border-olive bg-olive/5 py-3 pl-3 text-[13px] text-ink/70">
          {notice}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-7" noValidate>
        <div>
          <label htmlFor="email" className="label text-ink/40">
            E-Mail
          </label>
          <input
            id="email"
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
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="label text-ink/40">
              Passwort
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry"
            >
              Vergessen?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="field mt-2"
            placeholder="Dein Passwort"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {error && (
          <p className="flex items-start gap-2 border-l-2 border-cherry bg-cherry/5 py-3 pl-3 text-[13px] text-cherry">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-ink py-[17px] text-ivory transition-colors duration-500 hover:bg-cherry disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Anmeldung läuft
            </>
          ) : (
            'Anmelden'
          )}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="text-[10px] uppercase tracking-label text-ink/35">oder</span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <button
        onClick={google}
        type="button"
        className="btn w-full border border-ink/20 py-[16px] text-ink transition-colors duration-500 hover:border-ink"
      >
        Mit Google fortfahren
      </button>
    </div>
  );
}
