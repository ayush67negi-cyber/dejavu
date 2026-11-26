'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { ease } from '@/components/ui/motion';

/**
 * Hero.
 *
 * The German tagline is longer than the English one and contains umlauts, so the
 * headline is deliberately NOT wrapped in `overflow-hidden` reveal masks: an
 * overflow-clipped line box clips the umlauts of the line above at tight leading.
 * Instead the two lines fade and rise with the mask on a padded box.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-ink grain">
      {/* Photograph layer: stacked on mobile, full-bleed on desktop */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imgY, scale: imgScale }}
      >
        <Image
          src="/images/hero-anticipation.jpg"
          alt="Fünf Menschen lachen an einem festlich gedeckten Restauranttisch mit Wein und Kerzen – der Beginn einer unerwarteten Bekanntschaft."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_42%] md:object-[62%_45%]"
        />
      </motion.div>

      {/* Editorial scrims — tuned so the type stays legible without flattening the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/[0.94] via-ink/70 to-ink/20 md:via-ink/55 md:to-ink/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60 md:from-ink/90 md:via-transparent md:to-ink/35" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-5 pb-10 pt-[100px] md:px-10 md:pb-12 md:pt-[110px]">
        <div className="flex items-start justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="label max-w-[22ch] text-ivory/60"
          >
            Für Menschen, die sich lieber treffen als wischen
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 1 }}
            className="label hidden text-right text-ivory/60 md:block"
          >
            Social Dining
            <br /> Delhi · Mumbai · Bengaluru
          </motion.p>
        </div>

        <div className="mt-16 md:mt-24">
          <h1 className="max-w-[19ch] font-serif text-display-lg text-ivory">
            <TaglineLine delay={0.15}>
              Beim Mittagessen
              <br />
              noch <em className="italic text-blush">Fremde.</em>
            </TaglineLine>
            <TaglineLine delay={0.34}>
              Beim Dessert
              <br />
              schon <em className="italic text-blush">Freunde.</em>
            </TaglineLine>
          </h1>

          <div className="mt-10 flex flex-col gap-8 border-t border-ivory/20 pt-8 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-12">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease }}
              className="max-w-[40ch] text-[16px] leading-relaxed text-ivory/80 md:text-[17px]"
            >
              Sechs Fremde. Ein Tisch. Gespräche, die du nicht erwartet hast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92, duration: 0.9, ease }}
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2.5 bg-ivory px-7 py-[17px] text-center text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-500 ease-edit hover:bg-cherry hover:text-ivory"
              >
                Finde deinen Tisch
              </Link>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center justify-center gap-2.5 border border-ivory/35 px-7 py-[17px] text-center text-[11px] uppercase tracking-[0.16em] text-ivory transition-colors duration-500 ease-edit hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                DEJAVU entdecken
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 1 }}
          className="mt-10 hidden items-center gap-3 text-ivory/45 md:flex"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" strokeWidth={1.5} />
          <span className="label">Scrollen</span>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * A tagline line. The mask is on an outer box with vertical padding so ascenders,
 * umlaut dots and descenders are never clipped by the reveal.
 */
function TaglineLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className="block">{children}</span>;
  return (
    <span className="block overflow-hidden pb-[0.12em] pt-[0.14em]">
      <motion.span
        className="block"
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 1.15, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
