'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Reveal, RevealWords } from '@/components/ui/motion';

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} className="relative min-h-[86svh] overflow-hidden bg-ink grain">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        <Image
          src="/images/final-cta.jpg"
          alt="A group leaving a restaurant at dusk"
          fill
          sizes="100vw"
          className="scale-110 object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/55 to-ink/35" />

      <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-[1600px] flex-col justify-end px-5 py-16 md:px-10 md:py-20">
        <div className="max-w-[24ch]">
          <Reveal>
            <span className="label text-ivory/50">The invitation</span>
          </Reveal>
          <h2 className="mt-7 font-serif text-display-md text-ivory md:leading-[0.88]">
            <RevealWords text="Maybe you haven’t met" />
            <br />
            <span className="text-blush">
              <RevealWords text="your people" delay={0.12} />{' '}
            </span>
            <RevealWords text="yet." delay={0.24} />
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-ivory/15 pt-8 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 bg-ivory px-8 py-[19px] text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-edit hover:bg-cherry hover:text-ivory"
          >
            Find your table
            <span className="h-px w-6 bg-current transition-all duration-500 ease-edit group-hover:w-9" />
          </Link>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {['18+ only', 'Members only', 'Delhi · Mumbai · Bengaluru'].map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-[0.16em] text-ivory/40">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
