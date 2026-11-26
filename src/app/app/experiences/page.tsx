import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { MyExperience } from '@/lib/types';
import { formatDate, formatTime, relativeDay } from '@/lib/format';
import { FeedbackForm } from '@/components/app/feedback-form';
import { ReportDialog } from '@/components/app/report-dialog';

export const metadata: Metadata = { title: 'Meine Erlebnisse' };

export default async function ExperiencesPage() {
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_my_experiences');
  const experiences = (data ?? []) as MyExperience[];

  const now = Date.now();
  const upcoming = experiences.filter(
    (e) => e.status !== 'cancelled' && (!e.starts_at || new Date(e.starts_at).getTime() >= now),
  );
  const past = experiences.filter(
    (e) => e.status === 'completed' || (e.starts_at && new Date(e.starts_at).getTime() < now),
  );
  const cancelled = experiences.filter((e) => e.status === 'cancelled');

  // feedback already left
  const { data: myFeedback } = await supabase.from('feedback').select('experience_id');
  const given = new Set((myFeedback ?? []).map((f) => f.experience_id as string));

  return (
    <div className="space-y-12">
      <div className="border-b border-ink/12 pb-8">
        <p className="label text-ink/40">Erlebnisse</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.98] text-ink">
          Jeder Tisch, an dem du gesessen hast.
        </h1>
        <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-ink/55">
          Ortsangaben erscheinen, sobald ein Tisch bestätigt ist. Profile anderer Teilnehmender
          sehen nur die Menschen am selben Tisch.
        </p>
      </div>

      <Section title="Anstehend" count={upcoming.length}>
        {upcoming.length === 0 ? (
          <Empty
            title="Noch kein Tisch im Kalender."
            copy="Wir stellen Tische jede Woche von Hand zusammen. Sieh dir anstehende Erlebnisse an, für die du dich bewerben kannst."
            cta={{ href: '/app/discover', label: 'Tische entdecken' }}
          />
        ) : (
          upcoming.map((e) => <ExperienceCard key={e.id} experience={e} />)
        )}
      </Section>

      <Section title="Abgeschlossen" count={past.length}>
        {past.length === 0 ? (
          <Empty title="Noch nichts hinter dir." copy="Deine Historie entsteht hier nach deinem ersten Tisch." />
        ) : (
          past.map((e) => (
            <ExperienceCard
              key={e.id}
              experience={e}
              muted
              footer={
                e.status === 'completed' && !given.has(e.id) ? (
                  <FeedbackForm experienceId={e.id} />
                ) : given.has(e.id) ? (
                  <p className="text-[11px] uppercase tracking-[0.14em] text-olive">
                    Feedback abgegeben
                  </p>
                ) : null
              }
            />
          ))
        )}
      </Section>

      {cancelled.length > 0 && (
        <Section title="Abgesagt" count={cancelled.length}>
          {cancelled.map((e) => (
            <ExperienceCard key={e.id} experience={e} muted />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between border-b border-ink/12 pb-3">
        <h2 className="label text-ink/50">{title}</h2>
        <span className="text-[10px] uppercase tracking-label text-ink/30">{count}</span>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ExperienceCard({
  experience: e,
  muted = false,
  footer,
}: {
  experience: MyExperience;
  muted?: boolean;
  footer?: React.ReactNode;
}) {
  const statusTone =
    e.status === 'confirmed'
      ? 'text-olive'
      : e.status === 'cancelled'
        ? 'text-cherry'
        : e.status === 'completed'
          ? 'text-ink/40'
          : 'text-ember';

  return (
    <div className={`border border-ink/12 ${muted ? 'opacity-80' : ''}`}>
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_260px] md:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-[9px] uppercase tracking-label ${statusTone}`}>
              {e.status === 'confirmed'
                ? 'Bestätigt'
                : e.status === 'matching'
                  ? 'Wird zusammengestellt'
                  : e.status === 'draft'
                    ? 'Entwurf'
                    : e.status === 'completed'
                      ? 'Abgeschlossen'
                      : e.status === 'cancelled'
                        ? 'Abgesagt'
                        : e.status}
            </span>
            {e.category_slug && (
              <span className="text-[9px] uppercase tracking-label text-ink/30">
                · {e.category_slug.replace('-', ' ')}
              </span>
            )}
          </div>
          <h3 className="mt-2.5 font-serif text-[clamp(1.4rem,2.2vw,1.85rem)] leading-tight text-ink">
            {e.name}
          </h3>
          {e.description && (
            <p className="mt-2.5 max-w-[54ch] text-[13.5px] leading-relaxed text-ink/55">
              {e.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            <Meta icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />}>
              {e.starts_at ? `${formatDate(e.starts_at)} · ${relativeDay(e.starts_at)}` : 'Termin wird noch bekannt gegeben'}
            </Meta>
            <Meta icon={<Clock className="h-3.5 w-3.5" strokeWidth={1.5} />}>
              {e.starts_at ? formatTime(e.starts_at) : 'Uhrzeit wird noch bekannt gegeben'}
            </Meta>
            <Meta icon={<MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />}>
              {e.venue_name
                ? `${e.venue_name}${e.venue_address ? `, ${e.venue_address}` : ''}`
                : `${e.city} · Ort wird nach der Bestätigung genannt`}
            </Meta>
          </div>

          {e.instructions && (
            <p className="mt-5 border-l-2 border-cherry pl-4 text-[13px] leading-relaxed text-ink/65">
              {e.instructions}
            </p>
          )}

          {footer && <div className="mt-6 border-t border-ink/10 pt-5">{footer}</div>}
        </div>

        <div className="border-t border-ink/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="label text-ink/40">Der Tisch</p>
          <p className="mt-2 font-serif text-[30px] leading-none text-ink">
            {e.group_size}
            <span className="ml-1 text-[13px] uppercase tracking-[0.14em] text-ink/45">Plätze</span>
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink/45">
            {e.status === 'confirmed'
              ? 'Die Vorstellungen der Teilnehmenden teilen wir vorher mit dem Tisch.'
              : 'Die Profile der Teilnehmenden werden sichtbar, sobald der Tisch bestätigt ist.'}
          </p>
          {e.status === 'confirmed' && (
            <div className="mt-4">
              <ReportDialog experienceId={e.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[12.5px] text-ink/60">
      <span className="text-ink/35">{icon}</span>
      {children}
    </span>
  );
}

function Empty({ title, copy, cta }: { title: string; copy: string; cta?: { href: string; label: string } }) {
  return (
    <div className="border border-dashed border-ink/20 p-8 text-center">
      <p className="font-serif text-[22px] leading-tight text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-ink/50">{copy}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-5 inline-block border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
