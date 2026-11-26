'use client';

import Image from 'next/image';
import { Reveal, RevealWords, Parallax } from '@/components/ui/motion';

export function Idea() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:pt-6">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="label text-ink/45">01 — Die Idee</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
            </Reveal>

            <h2 className="mt-10 font-serif text-display-sm leading-[1.02] text-ink md:text-[clamp(2.4rem,4.6vw,3.9rem)] md:leading-[1.0]">
              <RevealWords text="Dein nächster Lieblingsmensch" />
              <br />
              <span className="text-ink/40">
                <RevealWords text="ist vielleicht noch ein Fremder." delay={0.2} />
              </span>
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <p className="text-[15px] leading-[1.8] text-ink/70">
                  Wir glauben, dass die besten Gespräche selten im Posteingang beginnen. Sie
                  entstehen an einem Tisch, bei gutem Essen und zwischen Menschen, die sich vorher
                  noch nicht kannten.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[15px] leading-[1.8] text-ink/55">
                  DEJAVU lässt genau das absichtlich passieren. Sorgfältig zusammengestellte
                  Tischrunden. Interessante Gesellschaft. Ein Restaurant, für das sich der Weg
                  lohnt – und ein Abend ohne Agenda.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.28}>
              <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-ink/15 pt-7">
                {[
                  ['4–6', 'Personen pro Tisch'],
                  ['Sonntag', 'der übliche Termin'],
                  ['Kein', 'Dating-App'],
                ].map(([big, small]) => (
                  <div key={small}>
                    <p className="font-serif text-[26px] leading-none text-ink">{big}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-ink/45">
                      {small}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Parallax distance={40}>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
                <Image
                  src="/images/idea-conversation.jpg"
                  alt="Zwei Menschen in einem konzentrierten Gespräch bei Kaffee in einem warm beleuchteten Café."
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
            <Reveal delay={0.2}>
              <div className="absolute -bottom-6 left-0 max-w-[240px] bg-cherry p-5 text-ivory md:-left-10">
                <p className="font-serif text-[19px] leading-tight">
                  „Ich hatte vergessen, dass wir uns gerade erst kennengelernt haben.“
                </p>
                <p className="mt-3 text-[9px] uppercase tracking-label text-ivory/70">
                  Der DEJAVU-Effekt
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
