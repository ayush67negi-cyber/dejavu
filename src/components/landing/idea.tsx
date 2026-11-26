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
                <span className="label text-ink/40">01 — The idea</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
            </Reveal>

            <h2 className="mt-10 font-serif text-display-sm text-ink md:text-[clamp(2.8rem,5.4vw,4.6rem)] md:leading-[0.95]">
              <RevealWords text="Your next favourite person" />
              <br />
              <span className="text-ink/35">
                <RevealWords text="is probably a stranger." delay={0.2} />
              </span>
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <p className="text-[15px] leading-[1.75] text-ink/70">
                  We think the best conversations rarely happen in your inbox. They happen across a
                  table, over food, between people who didn’t know they needed to meet.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[15px] leading-[1.75] text-ink/50">
                  DEJAVU exists to make that happen on purpose. Carefully composed tables. Interesting
                  company. A restaurant worth the trip and an evening without an agenda.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.28}>
              <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ink/15 pt-7">
                {[
                  ['4–6', 'people per table'],
                  ['Sunday', 'the usual seating'],
                  ['Not', 'a dating app'],
                ].map(([big, small]) => (
                  <div key={small}>
                    <p className="font-serif text-[26px] leading-none text-ink">{big}</p>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-ink/40">
                      {small}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Parallax distance={40}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/idea-conversation.jpg"
                  alt="Two people in deep conversation over coffee"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
            <Reveal delay={0.2}>
              <div className="absolute -bottom-6 -left-4 max-w-[220px] bg-cherry p-5 text-ivory md:-left-10">
                <p className="font-serif text-[19px] leading-tight">
                  “I forgot we had only just met.”
                </p>
                <p className="mt-3 text-[9px] uppercase tracking-label text-ivory/60">
                  The DEJAVU effect
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
