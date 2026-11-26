import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/format';
import { ReportActions } from '@/components/admin/report-actions';

export default async function AdminReports() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from('reports')
    .select('id, category, details, status, created_at, resolution_note, reporter_id, reported_user_id')
    .order('created_at', { ascending: false })
    .limit(80);

  const ids = Array.from(
    new Set(
      (reports ?? []).flatMap((r) => [r.reporter_id, r.reported_user_id].filter(Boolean) as string[]),
    ),
  );

  const { data: people } = ids.length
    ? await supabase.from('profiles').select('id, full_name, status').in('id', ids)
    : { data: [] as { id: string; full_name: string | null; status: string }[] };

  const nameMap = new Map((people ?? []).map((p) => [p.id, p]));

  return (
    <div className="space-y-8">
      <div className="border-b border-ink/12 pb-6">
        <p className="label text-ink/35">Reports</p>
        <h1 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
          Safety and moderation.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[12.5px] leading-relaxed text-ink/45">
          Every report is private to the reporter. Record a decision so there is a written trail.
        </p>
      </div>

      {(reports ?? []).length === 0 ? (
        <div className="border border-dashed border-ink/20 p-10 text-center">
          <p className="font-serif text-[22px] text-ink">No reports on file.</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[12.5px] text-ink/45">
            Nothing has been flagged. Reports from members appear here immediately.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {(reports ?? []).map((r) => {
            const reporter = nameMap.get(r.reporter_id);
            const reported = r.reported_user_id ? nameMap.get(r.reported_user_id) : null;
            return (
              <li key={r.id} className="border border-ink/12">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] uppercase tracking-label text-cherry">{r.category}</span>
                    <span className="text-[10px] uppercase tracking-label text-ink/35">
                      {formatDate(r.created_at)}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-label ${
                        r.status === 'open'
                          ? 'text-ember'
                          : r.status === 'resolved'
                            ? 'text-olive'
                            : 'text-ink/40'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/40">
                    From {reporter?.full_name ?? 'MEMBER'}
                    {reported ? ` about ${reported.full_name ?? 'MEMBER'}` : ''}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[13px] leading-relaxed text-ink/75">{r.details}</p>
                  {r.resolution_note && (
                    <p className="mt-3 border-l-2 border-olive pl-3 text-[12px] text-ink/55">
                      Decision: {r.resolution_note}
                    </p>
                  )}
                  {r.status !== 'resolved' && r.status !== 'dismissed' && (
                    <div className="mt-4">
                      <ReportActions reportId={r.id} reportedUserId={r.reported_user_id} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
