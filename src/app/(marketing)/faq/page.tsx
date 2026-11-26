import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Häufige Fragen zu DEJAVU: Tische, Matching, Mitgliedschaft, Sicherheit und Städte.',
};

const GROUPS = [
  {
    title: 'Das Wichtigste',
    items: [
      {
        q: 'Ist DEJAVU eine Dating-App?',
        a: 'Nein. DEJAVU ist eine Mitgliedschaft für gemeinsames Essen, aufgebaut auf Freundschaft und Gespräch. Tische entstehen nicht nach Anziehung, niemand wird bewertet, und es gibt nichts zu wischen.',
      },
      {
        q: 'Was passiert an einem Tisch tatsächlich?',
        a: 'Du kommst zur vereinbarten Zeit in ein Restaurant und triffst auf vier bis sechs Menschen und eine DEJAVU-Begleitung. Sie eröffnet den Abend und zieht sich dann zurück. Du bestellst, was du magst, zahlst dein Essen und sprichst. Die meisten bleiben über den Dessert hinaus.',
      },
      {
        q: 'Wie groß sind die Tische?',
        a: 'Zwischen vier und sechs Menschen. Klein genug, dass alle zu Wort kommen, groß genug, dass Bandbreite im Gespräch entsteht.',
      },
    ],
  },
  {
    title: 'Matching',
    items: [
      {
        q: 'Wie werden Tische zusammengestellt?',
        a: 'Von Hand, mit unserem Kompatibilitäts-Score als Leitlinie. Wir gewichten Stadt, gemeinsame Interessen, deine gewählten Kategorien, Verfügbarkeit, Ernährung und Persönlichkeitsmerkmale. Die letzte Entscheidung trifft immer ein Mensch – ein guter Tisch ist keine Tabelle.',
      },
      {
        q: 'Sitze ich jedes Mal mit denselben Menschen?',
        a: 'Nein. Jeder Tisch wird neu zusammengestellt. Du kannst jemanden wiedersehen, aber es geht um Breite – andere Räume, andere Perspektiven.',
      },
      {
        q: 'Kann ich wählen, mit wem ich sitze?',
        a: 'Du wählst Kategorien und Vorlieben, keine Personen. Wenn du nicht mit jemandem an einem Tisch sitzen möchtest, blockiere die Person in deinem Profil – wir halten euch dann getrennt.',
      },
      {
        q: 'Was, wenn mir die Runde nicht gefällt?',
        a: 'Sag es uns. Nach jedem abgeschlossenen Erlebnis fragen wir nach deinem Feedback. Passt es wiederholt nicht, ändern wir, wie deine Tische zusammengestellt werden.',
      },
    ],
  },
  {
    title: 'Mitgliedschaft und Kosten',
    items: [
      {
        q: 'Was kostet die Mitgliedschaft?',
        a: 'Ein Monat ₹1.999, drei Monate ₹4.999, sechs Monate ₹8.999. Die aktuelle Verfügbarkeit findest du auf der Seite zur Mitgliedschaft.',
      },
      {
        q: 'Ist das Essen enthalten?',
        a: 'Nein. Speisen und Getränke zahlst du selbst im Restaurant. Die DEJAVU-Mitgliedschaft deckt die Kuratierung, den Tisch und die Begleitung.',
      },
      {
        q: 'Wie kündige ich?',
        a: 'Über die Mitgliedschaftsseite in deinem Dashboard. Die Verlängerung stoppt sofort, dein Zugang läuft bis zum Ende des bezahlten Zeitraums weiter.',
      },
    ],
  },
  {
    title: 'Sicherheit und Privatsphäre',
    items: [
      {
        q: 'Wer sieht mein Profil?',
        a: 'Nur Menschen, die am selben Tisch sitzen – und nur die Felder, die du freigegeben hast. Deine E-Mail-Adresse, deine Fragebogenantworten und Meldungen werden nie an andere Mitglieder weitergegeben.',
      },
      {
        q: 'Wie melde ich jemanden?',
        a: 'Über die Meldefunktion bei jedem bestätigten Erlebnis in deinem Dashboard. Meldungen sind privat und werden von unserem Team geprüft.',
      },
      {
        q: 'Ist DEJAVU ab 18?',
        a: 'Ja, strikt. Das Alter wird beim Onboarding geprüft und von der Plattform durchgesetzt.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHead
        eyebrow="Häufige Fragen"
        title="Fragen, die wirklich gestellt werden."
        lead="Wenn deine Frage fehlt: Schreib uns – ein Mensch antwortet dir."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[260px_1fr]">
            <nav className="hidden lg:block">
              <div className="sticky top-[100px] space-y-2">
                {GROUPS.map((g) => (
                  <p key={g.title} className="text-[11px] uppercase tracking-[0.13em] text-ink/40">
                    {g.title}
                  </p>
                ))}
              </div>
            </nav>

            <div className="space-y-14">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <h2 className="border-b border-ink/15 pb-3 font-serif text-[24px] leading-none text-ink">
                    {group.title}
                  </h2>
                  <div className="divide-y divide-ink/10">
                    {group.items.map((item) => (
                      <details key={item.q} className="group py-5">
                        <summary className="flex cursor-pointer items-start justify-between gap-6 text-[15px] leading-snug text-ink">
                          {item.q}
                          <span className="mt-0.5 shrink-0 text-[18px] leading-none text-ink/25 transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-ink/55">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border border-ink/15 p-7">
                <p className="font-serif text-[22px] leading-tight text-ink">
                  Noch etwas unklar?
                </p>
                <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-ink/55">
                  Schreib uns. Wir beantworten lieber eine Frage, als dass du unsicher beitrittst.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-block bg-ink px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-cherry"
                >
                  Schreib DEJAVU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
