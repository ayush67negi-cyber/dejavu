import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { NotificationRow } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { MarkAllRead } from '@/components/app/mark-all-read';
import { Bell } from 'lucide-react';

export const metadata: Metadata = { title: 'Mitteilungen' };

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(60);

  const list = (data ?? []) as NotificationRow[];
  const unread = list.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-ink/12 pb-8 md:flex-row md:items-end">
        <div>
          <p className="label text-ink/40">Mitteilungen</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
            Was angekommen ist.
          </h1>
          <p className="mt-3 text-[14px] text-ink/55">
            {unread > 0 ? `${unread} ungelesen` : 'Nichts Ungelesenes.'}
          </p>
        </div>
        {unread > 0 && <MarkAllRead />}
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-ink/20 p-12 text-center">
          <Bell className="mx-auto h-6 w-6 text-ink/25" strokeWidth={1.25} />
          <p className="mt-4 font-serif text-[22px] text-ink">Gerade ist es still.</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-ink/50">
            Match-Bestätigungen, Ortsangaben und Erinnerungen zu Erlebnissen erscheinen hier.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {list.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-4 py-5 ${n.read_at ? 'opacity-60' : ''}`}
            >
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                  n.read_at ? 'bg-ink/20' : 'bg-cherry'
                }`}
              />
              <div className="flex-1">
                <p className="text-[14px] leading-snug text-ink">{n.title}</p>
                {n.body && (
                  <p className="mt-1.5 max-w-[62ch] text-[13px] leading-relaxed text-ink/55">{n.body}</p>
                )}
                <p className="mt-2 text-[10px] uppercase tracking-[0.13em] text-ink/30">
                  {n.type.replace(/_/g, ' ')} · {formatDateTime(n.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
