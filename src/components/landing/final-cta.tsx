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
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section ref={ref} className="relative min-h-[88svh] overflow-hidden bg-ink grain">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        <Image
          src="/images/final-connection.jpg"
          alt="Eine kleine Runde sitzt am Ende eines langen Abends entspannt und lachend am Restauranttisch, zwischen Desserttellern und Kerzenlicht."
          fill
          sizes="100vw"
          className="scale-105 object-cover object-[50%_45%]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/[0.95] via-ink/65 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-[1600px] flex-col justify-end px-5 py-16 md:px-10 md:py-20">
        <div className="max-w-[26ch]">
          <Reveal>
            <span className="label text-ivory/60">Die Einladung</span>
          </Reveal>
          <h2 className="mt-7 font-serif text-display-md text-ivory">
            <RevealWords text="Vielleicht hast du deine" />
            <br />
            <span className="text-blush">
              <RevealWords text="Menschen" delay={0.12} />
            </span>{' '}
            <RevealWords text="noch gar nicht" delay={0.2} />
            <br />
            <RevealWords text="kennengelernt." delay={0.3} />
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-ivory/20 pt-8 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 bg-ivory px-8 py-[19px] text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-500 ease-edit hover:bg-cherry hover:text-ivory"
          >
            Finde deinen Tisch.
            <span className="h-px w-6 bg-current transition-all duration-500 ease-edit group-hover:w-9" />
          </Link>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {['Nur ab 18', 'Nur für Mitglieder', 'Delhi · Mumbai · Bengaluru'].map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-[0.14em] text-ivory/50">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
