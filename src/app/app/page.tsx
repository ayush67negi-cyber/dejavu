import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProfile, getMembership, getCategories } from '@/lib/queries';
import { MEMBERSHIP_STATUS_LABEL, PLAN_COPY } from '@/lib/constants';
import type { MyExperience, NotificationRow, Profile } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/format';

export const metadata: Metadata = { title: 'Übersicht' };

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
  const firstName = profile?.full_name?.split(' ')[0] ?? 'du';
  const notifs = (notifications ?? []) as NotificationRow[];
  const unread = notifs.filter((n) => !n.read_at).length;

  const recommended = categories
    .filter((c) => !(profile?.preferred_categories ?? []).includes(c.slug))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 border-b border-ink/12 pb-8 md:flex-row md:items-end">
        <div>
          <p className="label text-ink/40">Übersicht</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
            Schön, dich zu sehen, {firstName}.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink/55">
            {upcoming
              ? 'Dein nächster Tisch ist bestätigt. Alles Wichtige findest du unten.'
              : 'Noch kein Tisch bestätigt. Wir stellen sie jede Woche von Hand zusammen – du hörst von uns.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/discover" className="btn bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
            Tische entdecken
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Upcoming experience */}
        <div className="border border-ink/12">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <p className="label text-ink/45">Nächstes Erlebnis</p>
            <CalendarDays className="h-4 w-4 text-ink/30" strokeWidth={1.5} />
          </div>
          {upcoming ? (
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-label text-cherry">
                {upcoming.status === 'confirmed' ? 'Bestätigt' : 'Wird zusammengestellt'}
              </p>
              <h2 className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
                {upcoming.name}
              </h2>
              <div className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2">
                <Detail label="Datum" value={upcoming.starts_at ? formatDate(upcoming.starts_at) : 'Wird noch bekannt gegeben'} />
                <Detail label="Uhrzeit" value={upcoming.starts_at ? formatTime(upcoming.starts_at) : 'Wird noch bekannt gegeben'} />
                <Detail
                  label="Restaurant"
                  value={upcoming.venue_name ?? 'Wird nach der Bestätigung genannt'}
                />
                <Detail label="Stadt" value={upcoming.city} />
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
                Alle Erlebnisse ansehen <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-cherry" strokeWidth={1.25} />
                <div>
                  <h2 className="font-serif text-[24px] leading-tight text-ink">
                    Wir stellen deinen ersten Tisch zusammen.
                  </h2>
                  <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-ink/55">
                    Tische werden von Hand aus Mitgliedern deiner Stadt mit ähnlichen Interessen
                    zusammengestellt. Sobald deiner bestätigt ist, bekommst du eine Mitteilung mit
                    Restaurant und Uhrzeit.
                  </p>
                  <Link
                    href="/app/discover"
                    className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cherry hover:text-claret"
                  >
                    Anstehende Tische ansehen <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
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
              <p className="label text-ink/45">Profil</p>
              <p className="font-serif text-[22px] leading-none text-ink">{completion}%</p>
            </div>
            <div className="mt-4 h-px w-full bg-ink/12">
              <div className="h-px bg-cherry transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink/50">
              {completion === 100
                ? 'Vollständig. Bessere Matches entstehen aus besseren Details.'
                : 'Ein vollständigeres Profil ergibt einen besseren Tisch. Ergänze, was noch fehlt.'}
            </p>
            <Link
              href="/app/profile"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-cherry"
            >
              Profil bearbeiten →
            </Link>
          </div>

          {/* membership */}
          <div className="border border-ink/12 p-6">
            <p className="label text-ink/45">Mitgliedschaft</p>
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
                    ? `Verlängert sich oder endet am ${formatDate(membership.ends_at)}`
                    : membership.status === 'pending'
                      ? 'Warten auf bestätigte Zahlung. Tische werden nach der Aktivierung freigeschaltet.'
                      : 'Kein aktiver Zeitraum.'}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 font-serif text-[20px] leading-tight text-ink">
                  Noch keine Mitgliedschaft.
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50">
                  Die Mitgliedschaft bringt dich an einen Tisch. Wähle einen Zeitraum, wenn du bereit bist.
                </p>
              </>
            )}
            <Link
              href="/app/membership"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.16em] text-ink/60 hover:text-cherry"
            >
              Mitgliedschaft verwalten →
            </Link>
          </div>

          {/* notifications */}
          <div className="border border-ink/12 p-6">
            <div className="flex items-center justify-between">
              <p className="label text-ink/45">Mitteilungen</p>
              {unread > 0 && (
                <span className="bg-cherry px-2 py-0.5 text-[9px] uppercase tracking-label text-ivory">
                  {unread} neu
                </span>
              )}
            </div>
            {notifs.length === 0 ? (
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/45">
                Noch nichts. Bestätigungen und Angaben zum Ort erscheinen hier.
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
              Alle Mitteilungen →
            </Link>
          </div>
        </div>
      </div>

      {/* recommended tables */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-end justify-between border-b border-ink/12 pb-4">
            <p className="label text-ink/45">Ein Blick wert</p>
            <Link href="/app/discover" className="text-[10px] uppercase tracking-[0.14em] text-ink/40 hover:text-cherry">
              Alle Tische
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
            In deinem Profil fehlt die Altersbestätigung. Ergänze sie im{' '}
            <Link href="/onboarding" className="underline decoration-ink/30 underline-offset-2">
              Onboarding
            </Link>{' '}
            , damit wir dich an einen Tisch setzen können.
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
