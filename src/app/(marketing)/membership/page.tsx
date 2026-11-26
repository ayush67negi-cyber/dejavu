import type { Metadata } from 'next';
import Link from 'next/link';
import { Membership } from '@/components/landing/membership';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'Mitgliedschaft',
  description:
    'DEJAVU-Mitgliedschaft: vier kuratierte Sonntags-Dinner pro Monat. Ein Monat ₹1.999, drei Monate ₹4.999, sechs Monate ₹8.999.',
};

const FAQS = [
  {
    q: 'Was genau ist in der Mitgliedschaft enthalten?',
    a: 'Vier kuratierte Sonntags-Dinner pro Monat, abhängig von Terminplan, Verfügbarkeit und den Mitgliedschaftsbedingungen. Jedes Erlebnis ist ein Tisch mit vier bis sechs Menschen in einem Restaurant in deiner Stadt.',
  },
  {
    q: 'Ist das Essen inklusive?',
    a: 'Nein. Speisen und Getränke zahlst du selbst direkt im Restaurant. Wir übernehmen keine Restaurantrechnungen.',
  },
  {
    q: 'In welchen Städten gibt es DEJAVU?',
    a: 'Wir starten in Delhi, Mumbai und Bengaluru und kommen mit wachsender Mitgliedschaft in weitere Städte. Deine Stadt erfassen wir beim Onboarding, damit wir dort Tische eröffnen können, wo Nachfrage ist.',
  },
  {
    q: 'Was passiert, wenn ich nicht teilnehmen kann?',
    a: 'Sag uns so früh wie möglich über das Dashboard Bescheid. Die Plätze sind begrenzt und von Hand zusammengestellt – kurzfristige Absagen betreffen echte Menschen. Wiederholte No-Shows prüft unser Team.',
  },
  {
    q: 'Wie kündige ich?',
    a: 'Die Verlängerung kannst du jederzeit auf der Mitgliedschaftsseite kündigen. Dein Zugang läuft bis zum Ende des bezahlten Zeitraums, danach wird nichts mehr abgebucht. Bereits bestätigte Tische bleiben bestehen.',
  },
  {
    q: 'Ist DEJAVU eine Dating-App?',
    a: 'Nein. DEJAVU ist eine Mitgliedschaft für gemeinsames Essen, aufgebaut auf Freundschaft und Gespräch. Es gibt kein Matching nach Anziehung, kein Wischen und keine Bewertung von Mitgliedern.',
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHead
        eyebrow="Mitgliedschaft"
        title="Ein Platz am Tisch, vier Sonntage im Monat."
        lead="Eine Mitgliedschaft. Ein monatlicher Rhythmus. Wähle, wie lange du bleiben möchtest – du kannst jederzeit wechseln oder kündigen."
        tone="burgundy"
      />
      <Membership />

      <section className="border-t border-ink/12 bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="label text-ink/40">Bevor du beitrittst</span>
              <h2 className="mt-5 max-w-[18ch] font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[0.95] text-ink">
                Die Bedingungen, in klarer Sprache.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-ink/55">
                Wir wollen, dass du genau verstehst, was du buchst. Wenn unten etwas unklar bleibt,
                schreib uns, bevor du zahlst.
              </p>
              <Link
                href="/terms"
                className="mt-6 inline-block border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.16em] text-ink hover:border-cherry hover:text-cherry"
              >
                Vollständige AGB
              </Link>
            </div>
            <div className="divide-y divide-ink/12 border-y border-ink/12">
              {FAQS.map((f) => (
                <Reveal key={f.q}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-[15px] leading-snug text-ink">
                      {f.q}
                      <span className="mt-0.5 shrink-0 text-[18px] leading-none text-ink/30 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-ink/55">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
