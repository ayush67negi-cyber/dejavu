'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function RequestToJoin({ experienceId }: { experienceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="text-[10px] uppercase tracking-[0.14em] text-ember">
        Anfrage erhalten · wird geprüft
      </p>
    );
  }

  async function request() {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Bitte melde dich erneut an.');
      const { error: err } = await supabase
        .from('experience_requests')
        .insert({ experience_id: experienceId, user_id: user.id });
      if (err) {
        if (err.code === '23505' || err.message.includes('duplicate')) {
          setSent(true);
          return;
        }
        throw new Error(err.message);
      }
      setSent(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Die Anfrage konnte nicht gesendet werden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={request}
        disabled={loading}
        className="btn w-full border border-ink/25 py-3 text-[10px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory disabled:opacity-50"
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Platz anfragen
      </button>
      {error && <p className="mt-2 text-[11px] text-cherry">{error}</p>}
    </div>
  );
}
