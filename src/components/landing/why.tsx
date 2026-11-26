'use client';

import { Reveal, RevealWords } from '@/components/ui/motion';
import { Smartphone, UtensilsCrossed, Users, Compass, Heart, Ban } from 'lucide-react';

const REASONS = [
  { icon: UtensilsCrossed, title: 'Real conversations', copy: 'A table, a time, and nowhere else to be. That is the whole technology.' },
  { icon: Users, title: 'Real people', copy: 'Verified members, adult-only, in the same city. Every profile is reviewed before the first table.' },
  { icon: Compass, title: 'Small groups', copy: 'Four to six seats per table. Big enough for range, small enough for everyone to speak.' },
  { icon: Heart, title: 'Shared interests', copy: 'You are seated with people who chose the same table you did — that is already something in common.' },
  { icon: Ban, title: 'No dating pressure', copy: 'DEJAVU is not a dating app. Nobody is being scored, and there is nothing to swipe.' },
  { icon: Smartphone, title: 'No endless swiping', copy: 'You join once. The introductions arrive. The rest of your week is your own.' },
];

export function Why() {
  return (
    <section className="relative overflow-hidden bg-sand py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="label text-ink/40">05 — Why DEJAVU</span>
            </Reveal>
            <h2 className="mt-7 font-serif text-display-sm text-ink md:text-[clamp(3rem,6vw,5.2rem)] md:leading-[0.9]">
              <RevealWords text="Less scrolling." />
              <br />
              <span className="text-cherry">
                <RevealWords text="More stories." delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink/60">
              We built DEJAVU because the alternative — another app, another feed, another
              half-conversation that dies by Tuesday — was not working for us either.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 0.05}>
                <div className="group h-full bg-sand p-7 transition-colors duration-500 hover:bg-ivory md:p-9">
                  <Icon
                    className="h-5 w-5 text-ink/40 transition-colors duration-500 group-hover:text-cherry"
                    strokeWidth={1.25}
                  />
                  <h3 className="mt-8 font-serif text-[24px] leading-none text-ink">{r.title}</h3>
                  <p className="mt-3 max-w-[34ch] text-[13.5px] leading-relaxed text-ink/55">
                    {r.copy}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
