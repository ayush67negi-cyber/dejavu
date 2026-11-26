'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function MarkAllRead() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      onClick={async () => {
        setBusy(true);
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('notifications')
              .update({ read_at: new Date().toISOString() })
              .eq('user_id', user.id)
              .is('read_at', null);
          }
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      disabled={busy}
      className="btn border border-ink/25 px-6 py-3 text-[10px] text-ink hover:border-ink disabled:opacity-50"
    >
      {busy ? 'Marking…' : 'Mark all as read'}
    </button>
  );
}
