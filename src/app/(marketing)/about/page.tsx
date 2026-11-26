import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal, RevealWords } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'Über uns',
  description:
    'DEJAVU ist eine Plattform für gemeinsames Essen für Menschen, die lieber Menschen treffen als wischen. Kleine Tische, echte Restaurants, echte Freundschaften.',
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="Über DEJAVU"
        title="Wir haben den Tisch gebaut, an dem wir selbst sitzen wollten."
        lead="DEJAVU begann mit einer kleinen, unbequemen Beobachtung: Es ist leichter geworden, online hundert Menschen zu treffen, als beim Essen ein gutes Gespräch zu führen."
        tone="sand"
      />

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:px-10 md:py-24">
          <div className="space-y-6 text-[15px] leading-[1.85] text-ink/70">
            <p className="font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.4] text-ink">
              Die meisten sozialen Produkte sind dafür gebaut, dich scrollen zu lassen. DEJAVU ist
              dafür gebaut, dass du das Haus verlässt.
            </p>
            <p>
              Die besten Gespräche passieren selten im Postfach. Sie passieren an einem Tisch, über
              Essen hinweg, zwischen Menschen, die nicht wussten, dass sie sich begegnen wollten.
            </p>
            <p>
              Also übernehmen wir den wirklich schwierigen Teil: vier bis sechs Menschen in deiner
              Stadt finden, die sich wahrscheinlich mögen, ein Restaurant wählen, das zum Abend
              passt, und alles zusammenhalten, damit niemand organisieren muss.
            </p>
            <p>
              DEJAVU ist keine Dating-App. Kein Wischen, keine Bewertung von Gesichtern, kein Druck,
              beeindrucken zu müssen. Eher eine Einladung zu einem sehr gut organisierten Dinner –
              von jemandem, der den Geschmack aller kennt.
            </p>
            <p>
              Wir sind ein kleines Team, wir wachsen bewusst, und wir führen lieber wenige, bessere
              Tische als einen vollen Kalender.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src="/images/idea-conversation.jpg" alt="Ein Gespräch an einem Tisch im warmen Restaurantlicht." fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="border border-ink/15 p-6">
              <p className="label text-ink/45">Woran wir glauben</p>
              <ul className="mt-4 space-y-3">
                {[
                  'Kleine Gruppen schlagen große Events.',
                  'Überschneidung ist ein Anfang, nicht das Ganze.',
                  'Ein gutes Restaurant übernimmt die Hälfte des Gastgebens.',
                  'Niemand sollte beim Essen etwas vorspielen müssen.',
                  'Freundschaft verdient Infrastruktur.',
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-[13px] leading-relaxed text-ink/65">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cherry" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ['Keine Dating-App', 'Kein Matching nach Anziehung. Freundschaft ist der Auftrag.'],
              ['Nur für Erwachsene', 'DEJAVU ist strikt ab 18. Das Alter wird beim Onboarding geprüft.'],
              ['Klein, mit Absicht', 'Vier bis sechs Plätze pro Tisch, damit wirklich alle sprechen können.'],
            ].map(([title, copy], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="border-t border-ivory/20 pt-6">
                  <p className="label text-ivory/35">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 font-serif text-[24px] leading-tight text-ivory">{title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ivory/55">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 border-t border-ivory/15 pt-10">
            <h2 className="max-w-[20ch] font-serif text-[clamp(2rem,4.4vw,3.2rem)] leading-[0.95]">
              <RevealWords text="Vielleicht hast du deine Menschen noch gar nicht kennengelernt." />
            </h2>
            <Link
              href="/signup"
              className="mt-8 inline-flex bg-ivory px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-cherry hover:text-ivory"
            >
              Finde deinen Tisch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
