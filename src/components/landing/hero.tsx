'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden bg-ink grain">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imgY, scale: imgScale }}
      >
        <Image
          src="/images/hero-table.jpg"
          alt="Six strangers sharing a candlelit restaurant table"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </motion.div>

      {/* editorial scrims */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/55 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/45" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-5 pb-8 pt-[92px] md:px-10 md:pb-10">
        <div className="flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="label max-w-[18ch] text-ivory/55"
          >
            Est. for people who would rather meet than swipe
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 1 }}
            className="label hidden text-right text-ivory/55 md:block"
          >
            Social dining
            <br />
            Delhi · Mumbai · Bengaluru
          </motion.p>
        </div>

        <div className="mt-auto">
          <div className="max-w-[15ch]">
            <h1 className="font-serif text-display-lg text-ivory">
              <Line delay={0.15}>Strangers</Line>
              <Line delay={0.26}>
                at <Em>lunch.</Em>
              </Line>
              <Line delay={0.42}>Friends by</Line>
              <Line delay={0.53}>
                <Em>dessert.</Em>
              </Line>
            </h1>
          </div>

          <div className="mt-9 flex flex-col gap-8 border-t border-ivory/15 pt-7 md:flex-row md:items-end md:justify-between">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[42ch] text-[15px] leading-relaxed text-ivory/75"
            >
              Six strangers. One table. Conversations you didn’t know you needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 bg-ivory px-7 py-[17px] text-[10px] uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-edit hover:bg-cherry hover:text-ivory"
              >
                Find your table
              </Link>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2.5 border border-ivory/30 px-7 py-[17px] text-[10px] uppercase tracking-[0.2em] text-ivory transition-colors duration-500 ease-edit hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                Discover DEJAVU
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 1 }}
          className="mt-10 flex items-center gap-3 text-ivory/40"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" strokeWidth={1.5} />
          <span className="label">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '108%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.15, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return <em className="font-serif not-italic text-blush italic">{children}</em>;
}
