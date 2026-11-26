import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/queries';
import { formatDateTime } from '@/lib/format';
import { ExperienceCreator } from '@/components/admin/experience-creator';
import { venueFor, type ExperienceVenue } from '@/lib/types';

export default async function AdminExperiences() {
  const supabase = await createClient();
  const categories = await getCategories();

  const [{ data: experiences }, { data: counts }, { data: venues }] = await Promise.all([
    supabase
      .from('experiences')
      .select('*')
      .order('starts_at', { ascending: false, nullsFirst: false })
      .limit(80),
    supabase.from('experience_participants').select('experience_id'),
    supabase.from('experience_venues').select('experience_id, venue_name, venue_address'),
  ]);
  const venueList = (venues ?? []) as ExperienceVenue[];

  const countMap = new Map<string, number>();
  (counts ?? []).forEach((c) => {
    const id = c.experience_id as string;
    countMap.set(id, (countMap.get(id) ?? 0) + 1);
  });

  return (
    <div className="space-y-8">
      <div className="border-b border-ink/12 pb-6">
        <p className="label text-ink/35">Experiences</p>
        <h1 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
          Compose a table.
        </h1>
      </div>

      <ExperienceCreator categories={categories} />

      <div className="overflow-x-auto border border-ink/12">
        <table className="w-full min-w-[820px] text-left">
          <thead className="border-b border-ink/12 bg-cream/60">
            <tr>
              {['Experience', 'City', 'When', 'Seats', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-[9px] uppercase tracking-label text-ink/40">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {(experiences ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-ink/40">
                  No experiences created yet. Use the form above to compose the first table.
                </td>
              </tr>
            ) : (
              (experiences ?? []).map((e) => {
                const filled = countMap.get(e.id) ?? 0;
                const cat = categories.find((c) => c.id === e.category_id);
                return (
                  <tr key={e.id} className="hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/experiences/${e.id}`}
                        className="text-[13px] text-ink hover:text-cherry"
                      >
                        {e.name}
                      </Link>
                      <p className="text-[10.5px] text-ink/40">
                        {cat?.name ?? 'No category'}
                        {venueFor(venueList, e.id).name ? ` · ${venueFor(venueList, e.id).name}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-ink/60">{e.city}</td>
                    <td className="px-4 py-3 text-[12px] text-ink/55">
                      {e.starts_at ? formatDateTime(e.starts_at) : 'TBA'}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-ink/60">
                      {filled} / {e.group_size}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={e.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/experiences/${e.id}`}
                        className="text-[10px] uppercase tracking-[0.12em] text-ink/40 hover:text-cherry"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'confirmed'
      ? 'text-olive'
      : status === 'cancelled'
        ? 'text-cherry'
        : status === 'completed'
          ? 'text-ink/45'
          : 'text-ember';
  return <span className={`text-[9px] uppercase tracking-label ${tone}`}>{status}</span>;
}
