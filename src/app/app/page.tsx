import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile, getMembership, getCategories } from '@/lib/queries';
import { MEMBERSHIP_STATUS_LABEL, PLAN_COPY } from '@/lib/constants';
import type { MyExperience, NotificationRow, Profile } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/format';

export const metadata: Metadata = { title: 'Overview' };

export default async function OverviewPage() {
  const supabase = await createClient();
  const [profile, membership, categories] = await Promise.all([
    getProfile(),
    getMembership(),
    getCategories(),
  ]);

  const [{ data: experiences }, { data: notifications }] = await Promise.all([
    supabase.rpc('get_my_experiences'),
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const all = (experiences ?? []) as MyExperience[];
  const now = Date.now();
  const upcoming = all
    .filter((e) => e.starts_at && new Date(e.starts_at).getTime() >= now && e.status !== 'cancelled')
    .sort((a, b) => new Date(a.starts_at!).getTime() - new Date(b.starts_at!).getTime())[0];

  const completion = profileCompletion(profile);
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const notifs = (notifications ?? []) as NotificationRow[];
  const unread = notifs.filter((n) => !n.read_at).length;

  const recommended = categories
    .filter((c) => !(profile?.preferred_categories ?? []).includes(c.slug))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 border-b border-ink/12 pb-8 md:flex-row md:items-end">
        <div>
          <p className="label text-ink/35">Overview</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
            {upcoming
              ? 'Your next table is confirmed. Everything you need is below.'
              : 'No table confirmed yet. We compose them by hand each week — you will hear from us.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/discover" className="btn bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
            Discover tables
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Upcoming experience */}
        <div className="border border-ink/12">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <p className="label text-ink/40">Next experience</p>
            <CalendarDays className="h-4 w-4 text-ink/30" strokeWidth={1.5} />
          </div>
          {upcoming ? (
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-label text-cherry">
                {upcoming.status === 'confirmed' ? 'Confirmed' : 'Being composed'}
              </p>
              <h2 className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                {upcoming.name}
              </h2>
              <div className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2">
                <Detail label="Date" value={upcoming.starts_at ? formatDate(upcoming.starts_at) : 'To be announced'} />
                <Detail label="Time" value={upcoming.starts_at ? formatTime(upcoming.starts_at) : 'To be announced'} />
                <Detail
                  label="Restaurant"
                  value={upcoming.venue_name ?? 'Revealed once confirmed'}
                />
                <Detail label="City" value={upcoming.city} />
              </div>
              {upcoming.instructions && (
                <p className="mt-6 border-l-2 border-cherry pl-4 text-[13px] leading-relaxed text-ink/60">
                  {upcoming.instructions}
                </p>
              )}
              <Link
                href="/app/experiences"
                className="mt-7 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.18em] text-ink hover:border-cherry hover:text-cherry"
              >
                View all experiences <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-cherry" strokeWidth={1.25} />
                <div>
                  <h2 className="font-serif text-[24px] leading-tight text-ink">
                    We’re composing your first table.
                  </h2>
                  <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/55">
                    Tables are assembled by hand from members in your city with overlapping
                    interests. When yours is confirmed you’ll get a notification with the restaurant
                    and the time.
                  </p>
                  <Link
                    href="/app/discover"
                    className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cherry hover:text-claret"
                  >
                    Browse upcoming tables <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* right rail */}
        <div className="space-y-6">
          {/* profile completion */}
          <div className="border border-ink/12 p-6">
            <div className="flex items-baseline justify-between">
              <p className="label text-ink/40">Profile</p>
              <p className="font-serif text-[22px] leading-none text-ink">{completion}%</p>
            </div>
            <div className="mt-4 h-px w-full bg-ink/12">
              <div className="h-px bg-cherry transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink/50">
              {completion === 100
                ? 'Complete. Better matches come from better detail.'
                : 'A fuller profile makes for a better table. Add what’s missing.'}
            </p>
            <Link
              href="/app/profile"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-cherry"
            >
              Edit profile →
            </Link>
          </div>

          {/* membership */}
          <div className="border border-ink/12 p-6">
            <p className="label text-ink/40">Membership</p>
            {membership ? (
              <>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-serif text-[20px] leading-none text-ink">
                    {PLAN_COPY[membership.plan_id]?.name ?? membership.plan_id}
                  </p>
                  <span
                    className={`text-[9px] uppercase tracking-label ${
                      membership.status === 'active' ? 'text-olive' : 'text-cherry'
                    }`}
                  >
                    {MEMBERSHIP_STATUS_LABEL[membership.status]}
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] text-ink/50">
                  {membership.status === 'active' && membership.ends_at
                    ? `Renews or expires ${formatDate(membership.ends_at)}`
                    : membership.status === 'pending'
                      ? 'Awaiting verified payment. Tables unlock once activated.'
                      : 'No active period.'}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 font-serif text-[20px] leading-tight text-ink">
                  No membership yet.
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50">
                  Membership is what puts you at a table. Choose a period when you’re ready.
                </p>
              </>
            )}
            <Link
              href="/app/membership"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-cherry"
            >
              Manage membership →
            </Link>
          </div>

          {/* notifications */}
          <div className="border border-ink/12 p-6">
            <div className="flex items-center justify-between">
              <p className="label text-ink/40">Notifications</p>
              {unread > 0 && (
                <span className="bg-cherry px-2 py-0.5 text-[9px] uppercase tracking-label text-ivory">
                  {unread} new
                </span>
              )}
            </div>
            {notifs.length === 0 ? (
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/45">
                Nothing yet. Confirmations and venue details will arrive here.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {notifs.map((n) => (
                  <li key={n.id} className="border-b border-ink/10 pb-3 last:border-0 last:pb-0">
                    <p className={`text-[12.5px] leading-snug ${n.read_at ? 'text-ink/50' : 'text-ink'}`}>
                      {n.title}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink/30">
                      {formatDate(n.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/app/notifications"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-cherry"
            >
              All notifications →
            </Link>
          </div>
        </div>
      </div>

      {/* recommended tables */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-end justify-between border-b border-ink/12 pb-4">
            <p className="label text-ink/40">Worth a look</p>
            <Link href="/app/discover" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
              All tables
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {recommended.map((c) => (
              <Link
                key={c.slug}
                href={`/tables/${c.slug}`}
                className="group border border-ink/12 p-5 transition-colors hover:border-ink/35"
              >
                <span
                  className="block h-1 w-8 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: c.accent ?? '#C4172F' }}
                />
                <p className="mt-5 font-serif text-[22px] leading-none text-ink">{c.name}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!profile?.adult_confirmed && (
        <div className="flex items-start gap-3 border-l-2 border-cherry bg-cherry/5 p-5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cherry" strokeWidth={1.5} />
          <p className="text-[13px] leading-relaxed text-ink/70">
            Age confirmation is missing from your profile. Complete it in{' '}
            <Link href="/onboarding" className="underline decoration-ink/30 underline-offset-2">
              onboarding
            </Link>{' '}
            so we can place you at a table.
          </p>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-4">
      <p className="text-[9px] uppercase tracking-label text-ink/35">{label}</p>
      <p className="mt-1.5 text-[13.5px] leading-snug text-ink">{value}</p>
    </div>
  );
}

function profileCompletion(profile: Profile | null) {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.full_name),
    Boolean(profile.avatar_url),
    Boolean(profile.city),
    Boolean(profile.occupation),
    Boolean(profile.bio),
    (profile.food_preferences?.length ?? 0) > 0,
    (profile.dietary_restrictions?.length ?? 0) > 0,
    (profile.social_preferences?.length ?? 0) > 0,
    (profile.preferred_categories?.length ?? 0) > 0,
    Boolean(profile.date_of_birth),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
