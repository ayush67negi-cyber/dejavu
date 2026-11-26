'use client';

import { Reveal } from '@/components/ui/motion';

const LINES = [
  'Meeting new people',
  'Making genuine friends',
  'Exploring restaurants',
  'Conversations beyond small talk',
  'People outside your usual circle',
  'Different perspectives',
  'A social life, offline',
];

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 md:py-20">
      <Reveal>
        <p className="label mb-8 px-5 text-ink/35 md:px-10">DEJAVU is about</p>
      </Reveal>
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {LINES.map((l, i) => (
              <span key={`${dup}-${l}`} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-serif text-[clamp(1.6rem,3.6vw,3rem)] leading-none text-ink md:px-10">
                  {l}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: i % 3 === 0 ? '#C4172F' : i % 3 === 1 ? '#E2571E' : '#3F4A2E' }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
