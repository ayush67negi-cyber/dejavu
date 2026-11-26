'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push('/app?notice=Your%20password%20has%20been%20updated.');
      router.refresh();
    } catch {
      setError('We could not reach the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div>
        <label htmlFor="password" className="label text-ink/40">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="field mt-2"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirm" className="label text-ink/40">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          className="field mt-2"
          placeholder="Repeat it"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        Update password
      </button>
    </form>
  );
}
