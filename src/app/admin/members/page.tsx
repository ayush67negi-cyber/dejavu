import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/format';

export default async function AdminMembers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('id, full_name, city, occupation, status, onboarding_completed, visibility, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (q) query = query.ilike('full_name', `%${q}%`);
  if (status && status !== 'all') query = query.eq('status', status);

  const { data: members } = await query;

  return (
    <div className="space-y-7">
      <div className="border-b border-ink/12 pb-6">
        <p className="label text-ink/35">Members</p>
        <h1 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
          Everyone in the room.
        </h1>
      </div>

      <form className="flex flex-wrap items-end gap-3" action="/admin/members">
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="q" className="label block text-ink/40">
            Search by name
          </label>
          <input id="q" name="q" defaultValue={q ?? ''} className="field mt-1.5" placeholder="Name" />
        </div>
        <div>
          <label htmlFor="status" className="label block text-ink/40">
            Status
          </label>
          <select id="status" name="status" defaultValue={status ?? 'all'} className="field mt-1.5">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
        <button type="submit" className="btn bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto border border-ink/12">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-ink/12 bg-cream/60">
            <tr>
              {['Member', 'City', 'Occupation', 'Onboarding', 'Visibility', 'Joined', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-[9px] uppercase tracking-label text-ink/40">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {(members ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-ink/40">
                  No members match that search.
                </td>
              </tr>
            ) : (
              (members ?? []).map((m) => (
                <tr key={m.id} className="hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/members/${m.id}`} className="text-[13px] text-ink hover:text-cherry">
                      {m.full_name || 'Unnamed'}
                    </Link>
                    {m.status !== 'active' && (
                      <span className="ml-2 text-[9px] uppercase tracking-label text-cherry">
                        {m.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-ink/60">{m.city ?? '—'}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink/60">{m.occupation ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-[0.12em] ${
                        m.onboarding_completed ? 'text-olive' : 'text-ember'
                      }`}
                    >
                      {m.onboarding_completed ? 'Complete' : 'Incomplete'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink/50">{m.visibility}</td>
                  <td className="px-4 py-3 text-[12px] text-ink/50">{formatDate(m.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="text-[10px] uppercase tracking-[0.12em] text-ink/40 hover:text-cherry"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink/35">
        Showing up to 100 members. Use search to narrow. Private questionnaire answers are visible
        only on the member review page, for matching purposes.
      </p>
    </div>
  );
}
