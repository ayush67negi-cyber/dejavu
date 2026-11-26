'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, RevealWords } from '@/components/ui/motion';
import { CATEGORY_FALLBACK, categoryImage, type Category } from '@/lib/types';

export function TablesStrip({ categories }: { categories: Category[] }) {
  const list = categories.length ? categories : CATEGORY_FALLBACK;
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section id="tables" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="label text-ink/40">03 — The tables</span>
            </Reveal>
            <h2 className="mt-7 max-w-[16ch] font-serif text-display-sm text-ink md:text-[clamp(2.6rem,4.8vw,4.2rem)] md:leading-[0.95]">
              <RevealWords text="Eight rooms. One table each." />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-ink/55">
              Each table has its own temperament. Choose the ones that sound like an evening you’d
              actually look forward to — we’ll do the introductions.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c, i) => (
            <Link
              key={c.slug}
              href={`/tables/${c.slug}`}
              onMouseEnter={() => setHover(c.slug)}
              onMouseLeave={() => setHover(null)}
              className="group relative bg-ivory p-6 transition-colors duration-500 hover:bg-cream md:p-7"
            >
              <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden bg-sand">
                <Image
                  src={categoryImage(c.slug, c.image_url)}
                  alt={`${c.name} table`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-all duration-[1100ms] ease-edit group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:bg-ink/0" />
                <span
                  className="absolute left-0 top-0 h-1 w-10 transition-all duration-500 ease-edit group-hover:w-full"
                  style={{ backgroundColor: c.accent ?? '#C4172F' }}
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-label text-ink/35">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 font-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-none text-ink">
                    {c.name}
                  </h3>
                </div>
                <ArrowUpRight
                  className="mt-3 h-4 w-4 shrink-0 text-ink/30 transition-all duration-500 ease-edit group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cherry"
                  strokeWidth={1.5}
                />
              </div>
              <p className="mt-3 min-h-[42px] text-[13px] leading-relaxed text-ink/55">
                {c.tagline}
              </p>
              <span
                className={`mt-4 block h-px w-full origin-left transition-transform duration-700 ease-edit ${
                  hover === c.slug ? 'scale-x-100' : 'scale-x-0'
                }`}
                style={{ backgroundColor: c.accent ?? '#C4172F' }}
              />
            </Link>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex justify-end">
            <Link
              href="/tables"
              className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-cherry hover:text-cherry"
            >
              All tables
              <ArrowUpRight
                className="h-3 w-3 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
