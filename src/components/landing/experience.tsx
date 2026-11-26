'use client';

import Image from 'next/image';
import { Reveal, RevealWords, Parallax } from '@/components/ui/motion';

const INCLUDED = [
  'Curated groups of 4–6 people',
  'Interest-based matching',
  'Restaurant-based experiences',
  'A table composed, not randomised',
  'A facilitator who sets the tone',
  'A new restaurant to discover',
];

const NOT_INCLUDED = [
  'Not a dating app',
  'Not a networking mixer',
  'Not an endless group chat',
  'Not your food and drinks bill',
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
                  alt="A shared restaurant table of small plates seen from above"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="label text-ivory/50">A typical table</p>
                  <p className="mt-2 font-serif text-[22px] leading-tight text-ivory">
                    Shared plates. Unshared opinions.
                  </p>
                </div>
              </div>
            </Parallax>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="label text-ivory/40">04 — The experience</span>
            </Reveal>
            <h2 className="mt-7 max-w-[18ch] font-serif text-display-sm text-ivory md:text-[clamp(2.6rem,4.8vw,4.2rem)] md:leading-[0.95]">
              <RevealWords text="An evening that doesn’t need an agenda." />
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[48ch] text-[15px] leading-[1.75] text-ivory/60">
                You arrive knowing a restaurant, a time and a rough idea of who else is coming. What
                happens after that is the part we can’t script — and wouldn’t want to.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px bg-ivory/12 sm:grid-cols-2">
              <div className="bg-ink p-6">
                <p className="label text-blush">What it is</p>
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
                <p className="label text-ivory/35">What it isn’t</p>
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
                DEJAVU facilitates the gathering. Members pay for their own food and drinks at the
                restaurant unless an experience explicitly states otherwise.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
