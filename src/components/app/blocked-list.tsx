'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function BlockedList({ blocked }: { blocked: { id: string; full_name: string | null }[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function unblock(id: string) {
    setPending(id);
    try {
      const supabase = createClient();
      await supabase.from('blocked_users').delete().eq('blocked_id', id);
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="border-t border-ink/12 pt-6">
      <p className="label text-ink/40">Blocked members</p>
      <p className="mt-3 max-w-[56ch] text-[12.5px] leading-relaxed text-ink/45">
        Blocked members are never placed at a table with you, and cannot find you in Discover.
      </p>
      {blocked.length === 0 ? (
        <p className="mt-4 text-[12.5px] text-ink/35">You have not blocked anyone.</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          {blocked.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-3">
              <span className="text-[13px] text-ink/70">{b.full_name ?? 'Member'}</span>
              <button
                onClick={() => unblock(b.id)}
                disabled={pending === b.id}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry disabled:opacity-50"
              >
                {pending === b.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ShieldOff className="h-3 w-3" strokeWidth={1.5} />
                )}
                Unblock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
