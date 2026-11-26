'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError('Wir konnten den Server nicht erreichen. Bitte versuche es noch einmal.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-ink/15 p-6">
        <CheckCircle2 className="h-5 w-5 text-olive" strokeWidth={1.5} />
        <p className="mt-4 font-serif text-[22px] leading-tight text-ink">Schau in dein Postfach.</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">
          Falls es ein Konto für {email} gibt, ist ein Link zum Zurücksetzen unterwegs. Der Link
          verfällt nach einer Stunde.
        </p>
      </div>
    );
  }

  return (
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="border-l-2 border-cherry bg-cherry/5 py-3 pl-3 text-[13px] text-cherry">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn w-full bg-ink py-[17px] text-ivory transition-colors duration-500 hover:bg-cherry disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : null}
        Link zum Zurücksetzen senden
      </button>
    </form>
  );
}
