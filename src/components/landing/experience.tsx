'use client';

import Image from 'next/image';
import { Reveal, RevealWords, Parallax } from '@/components/ui/motion';

const INCLUDED = [
  'Sorgfältig zusammengestellte Gruppen von 4–6 Personen',
  'Matching nach gemeinsamen Interessen',
  'Erlebnisse in echten Restaurants',
  'Ein Tisch, komponiert statt zufällig besetzt',
  'Eine Begleitung, die den Ton setzt',
  'Ein neues Restaurant zum Entdecken',
];

const NOT_INCLUDED = [
  'Keine Dating-App',
  'Kein Networking-Event',
  'Kein endloser Gruppenchat',
  'Nicht deine Essens- und Getränkerechnung',
];

export function Experience() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ivory md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <Parallax distance={50}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/experience-overhead.jpg"
                  alt="Ein von oben fotografierter Restauranttisch mit vielen kleinen Tellern zum Teilen."
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="label text-ivory/55">Ein typischer Tisch</p>
                  <p className="mt-2 font-serif text-[22px] leading-tight text-ivory">
                    Geteilte Platten. Geteilte Meinungen nicht.
                  </p>
                </div>
              </div>
            </Parallax>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="label text-ivory/45">04 — Das Erlebnis</span>
            </Reveal>
            <h2 className="mt-7 max-w-[18ch] font-serif text-display-sm text-ivory md:text-[clamp(2.6rem,4.8vw,4.2rem)] md:leading-[0.95]">
              <RevealWords text="Ein Abend ohne festen Plan." />
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[48ch] text-[15px] leading-[1.75] text-ivory/60">
                Du kommst an und kennst das Restaurant, die Uhrzeit und eine vage Idee, wer sonst
                noch kommt. Was danach passiert, können wir nicht vorschreiben – und wollen es auch
                nicht.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px bg-ivory/12 sm:grid-cols-2">
              <div className="bg-ink p-6">
                <p className="label text-blush">Was es ist</p>
                <ul className="mt-5 space-y-3">
                  {INCLUDED.map((t) => (
                    <li key={t} className="flex gap-3 text-[14px] leading-snug text-ivory/80">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cherry" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink p-6">
                <p className="label text-ivory/40">Was es nicht ist</p>
                <ul className="mt-5 space-y-3">
                  {NOT_INCLUDED.map((t) => (
                    <li key={t} className="flex gap-3 text-[14px] leading-snug text-ivory/40">
                      <span className="mt-[9px] h-px w-2 shrink-0 bg-ivory/30" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Reveal delay={0.1}>
              <p className="mt-8 border-l-2 border-cherry pl-5 text-[13px] leading-relaxed text-ivory/45">
                DEJAVU organisiert das Zusammensein. Essen und Getränke zahlen Mitglieder selbst im
                Restaurant, sofern ein Erlebnis nicht ausdrücklich etwas anderes angibt.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
