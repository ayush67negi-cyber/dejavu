'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton({ className = '', label = 'Sign out' }: { className?: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } finally {
          router.push('/');
          router.refresh();
        }
      }}
      className={className}
    >
      {busy ? 'Signing out…' : label}
    </button>
  );
}
