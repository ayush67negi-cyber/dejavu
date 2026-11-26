import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';
import { Reveal, RevealWords } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: "So funktioniert's",
  description:
    'Vier Schritte von der Anmeldung bis zum Platz am DEJAVU-Tisch: anmelden, matchen lassen, Tischrunde treffen, den Abend entstehen lassen.',
};

const STEPS = [
  {
    n: '01',
    title: 'Melde dich an',
    copy: 'Erzähl uns ein bisschen von dir.',
    body: 'Ein kurzer, ehrlicher Fragebogen – deine Stadt, worüber du gerne sprichst, wie du an einem Tisch bist und was du lieber vermeidest. Zehn Minuten, einmal. Alles, was du schreibst, ist standardmäßig privat und wird nie öffentlich gezeigt.',
  },
  {
    n: '02',
    title: 'Wir finden dein Match',
    copy: 'Wir bringen dich mit Menschen zusammen, die du gerne kennenlernen wirst.',
    body: 'Tische werden von Hand zusammengestellt – geleitet von gemeinsamen Interessen, passenden Persönlichkeiten, Ernährungsbedürfnissen und den Kategorien, die du gewählt hast. Wir suchen Bandbreite ebenso wie Überschneidung: Die besten Tische bestehen nicht aus fast identischen Menschen.',
  },
  {
    n: '03',
    title: 'Triff deine Tischrunde',
    copy: 'Sechs Menschen. Ein Restaurant. Keine komplizierte Planung.',
    body: 'Du bekommst ein bestätigtes Restaurant, eine Uhrzeit und eine kurze Notiz, was dich erwartet. Du bestellst, was du magst, und zahlst dein eigenes Essen. Keine Gruppenchats, keine Verhandlung über den Ort.',
  },
  {
    n: '04',
    title: 'Lass den Abend entstehen',
    copy: 'Beim Dessert fühlen sich die ersten Vorstellungen vielleicht schon überflüssig an.',
    body: 'Eine Begleitung eröffnet das Gespräch und zieht sich dann zurück. Keine Kennenlernspiele, keine Namensschilder. Danach kannst du uns erzählen, wie es war – daraus stellen wir beim nächsten Mal einen besseren Tisch zusammen.',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHead
        eyebrow="So funktioniert’s"
        title="Vier Schritte. Und dann übernimmt der Tisch."
        lead="DEJAVU ist kein Feed und kein Wischen. Es ist ein kleiner, bewusster Ablauf: Wir stellen Tische mit vier bis sechs Menschen zusammen, und du kommst einfach."
        tone="ink"
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 md:px-10">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="grid gap-6 border-b border-ink/12 py-12 md:grid-cols-[140px_1fr_1.2fr] md:gap-12 md:py-16"
            >
              <Reveal>
                <span className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-none text-ink/15">
                  {s.n}
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="font-serif text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[0.95] text-ink">
                  {s.title}
                </h2>
                <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-cherry">{s.copy}</p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="text-[14.5px] leading-[1.8] text-ink/60">{s.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24">
        <div className="mx-auto grid max-w-[1300px] items-center gap-12 px-5 md:grid-cols-2 md:px-10">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/cat-founders.jpg" alt="Eine Tischrunde im Gespräch bei DEJAVU." fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <Reveal>
              <span className="label text-ink/45">Was dich erwartet</span>
            </Reveal>
            <h2 className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.95] text-ink">
              <RevealWords text="Ein Tisch, keine Transaktion." />
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                'Gruppen von vier bis sechs Menschen, immer persönlich, immer in deiner Stadt.',
                'Ein Restaurant pro Erlebnis – ausgewählt für den Raum ebenso wie für die Karte.',
                'Eine Begleitung, die den Abend eröffnet und sich dann zurücknimmt.',
                'Deine Ernährungswünsche gehen vorab an das Restaurant.',
                'Kein Dating-Druck. Keine Bewertungen. Kein Wischen.',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[14px] leading-relaxed text-ink/65">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cherry" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-cherry pl-5 text-[13px] leading-relaxed text-ink/55">
              DEJAVU organisiert das Zusammensein. Essen und Getränke zahlen Mitglieder selbst im
              Restaurant, sofern ein Erlebnis nicht ausdrücklich etwas anderes angibt.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex bg-ink px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-ivory transition-colors duration-500 hover:bg-cherry"
            >
              Finde deinen Tisch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
