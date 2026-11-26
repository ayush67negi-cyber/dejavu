import Link from 'next/link';
import { ArrowUpRight, Flag, Users, CalendarRange, IndianRupee, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/format';

export default async function AdminOverview() {
  const supabase = await createClient();

  const [
    { count: memberCount },
    { count: onboardedCount },
    { count: activeMemberships },
    { count: pendingMemberships },
    { count: openReports },
    { count: totalExperiences },
    { count: confirmedExperiences },
    { count: pendingRequests },
    { data: upcoming },
    { data: recentMembers },
    { data: feedback },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
    supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).in('status', ['open', 'reviewing']),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('experience_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('experiences')
      .select('id, name, city, starts_at, status, group_size')
      .order('starts_at', { ascending: true })
      .limit(6),
    supabase
      .from('profiles')
      .select('id, full_name, city, created_at, onboarding_completed')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('feedback').select('rating').limit(500),
  ]);

  const ratings = (feedback ?? []).map((f) => f.rating as number);
  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="space-y-10">
      <div className="border-b border-ink/12 pb-7">
        <p className="label text-ink/35">Overview</p>
        <h1 className="mt-3 font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[0.98] text-ink">
          The room, at a glance.
        </h1>
        <p className="mt-2 text-[13px] text-ink/50">
          Live numbers from the database. Nothing here is illustrative.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-ink/12 md:grid-cols-4">
        <Stat label="Members" value={memberCount ?? 0} sub={`${onboardedCount ?? 0} onboarded`} icon={<Users className="h-4 w-4" strokeWidth={1.5} />} />
        <Stat
          label="Active memberships"
          value={activeMemberships ?? 0}
          sub={pendingMemberships ? `${pendingMemberships} pending payment` : 'No pending payments'}
          icon={<IndianRupee className="h-4 w-4" strokeWidth={1.5} />}
        />
        <Stat
          label="Experiences"
          value={totalExperiences ?? 0}
          sub={`${confirmedExperiences ?? 0} confirmed`}
          icon={<CalendarRange className="h-4 w-4" strokeWidth={1.5} />}
        />
        <Stat
          label="Open reports"
          value={openReports ?? 0}
          sub={pendingRequests ? `${pendingRequests} seat requests` : 'No seat requests'}
          icon={<Flag className="h-4 w-4" strokeWidth={1.5} />}
          tone={openReports ? 'cherry' : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="flex items-baseline justify-between border-b border-ink/12 pb-3">
            <h2 className="label text-ink/50">Experiences</h2>
            <Link href="/admin/experiences" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
              Manage
            </Link>
          </div>
          {(upcoming ?? []).length === 0 ? (
            <p className="py-6 text-[13px] text-ink/40">
              No experiences yet.{' '}
              <Link href="/admin/experiences" className="text-cherry hover:underline">
                Create the first one
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {(upcoming ?? []).map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                  <div>
                    <p className="text-[13.5px] text-ink">{e.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink/40">
                      {e.city} · {e.starts_at ? formatDateTime(e.starts_at) : 'Date TBA'} · {e.group_size} seats
                    </p>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-label ${
                      e.status === 'confirmed'
                        ? 'text-olive'
                        : e.status === 'cancelled'
                          ? 'text-cherry'
                          : 'text-ember'
                    }`}
                  >
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="border border-ink/12 p-5">
            <div className="flex items-center justify-between">
              <p className="label text-ink/40">Feedback</p>
              <Star className="h-4 w-4 text-ink/25" strokeWidth={1.5} />
            </div>
            {avgRating ? (
              <>
                <p className="mt-3 font-serif text-[34px] leading-none text-ink">
                  {avgRating}
                  <span className="ml-1 text-[12px] uppercase tracking-[0.14em] text-ink/35">/ 5</span>
                </p>
                <p className="mt-2 text-[11.5px] text-ink/45">
                  From {ratings.length} submitted {ratings.length === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/45">
                No feedback submitted yet. Ratings appear once completed experiences are reviewed.
              </p>
            )}
          </section>

          <section className="border border-ink/12 p-5">
            <p className="label text-ink/40">Newest members</p>
            {(recentMembers ?? []).length === 0 ? (
              <p className="mt-3 text-[12.5px] text-ink/45">No members yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {(recentMembers ?? []).map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/admin/members/${m.id}`}
                        className="text-[13px] text-ink hover:text-cherry"
                      >
                        {m.full_name || 'Unnamed member'}
                      </Link>
                      <p className="text-[10.5px] text-ink/40">
                        {m.city ?? 'No city'} · {m.onboarding_completed ? 'Onboarded' : 'Incomplete'}
                      </p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink/25" strokeWidth={1.5} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  tone?: 'cherry';
}) {
  return (
    <div className="bg-ivory p-5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-label text-ink/35">{label}</p>
        <span className={tone === 'cherry' ? 'text-cherry' : 'text-ink/25'}>{icon}</span>
      </div>
      <p className={`mt-3 font-serif text-[36px] leading-none ${tone === 'cherry' ? 'text-cherry' : 'text-ink'}`}>
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-ink/40">{sub}</p>
    </div>
  );
}
