'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, RevealWords } from '@/components/ui/motion';

const STEPS = [
  {
    n: '01',
    title: 'Melde dich an',
    copy: 'Erzähl uns ein bisschen von dir.',
    detail:
      'Ein kurzer Fragebogen – Interessen, Stadt, die Art von Abenden, die du magst. Zehn Minuten, einmal. Alles, was du schreibst, bleibt bei DEJAVU.',
  },
  {
    n: '02',
    title: 'Wir finden dein Match',
    copy: 'Wir bringen dich mit Menschen zusammen, die du gerne kennenlernen wirst.',
    detail:
      'Unser Team stellt jeden Tisch von Hand zusammen – geleitet von gemeinsamen Interessen, passenden Persönlichkeiten und den Kategorien, die du gewählt hast. Kein Zufallsprinzip.',
  },
  {
    n: '03',
    title: 'Triff deine Tischrunde',
    copy: 'Sechs Menschen. Ein Restaurant. Keine komplizierte Planung.',
    detail:
      'Du bekommst einen bestätigten Tisch, ein Restaurant und eine Uhrzeit. Du wählst deine Gerichte, bezahlst dein Essen und kommst einfach an.',
  },
  {
    n: '04',
    title: 'Lass den Abend entstehen',
    copy: 'Beim Dessert fühlen sich die ersten Vorstellungen vielleicht schon überflüssig an.',
    detail:
      'Keine Kennenlernspiele, keine Namensschilder. Ein begleiteter Start, dann übernimmt das Gespräch – und läuft oft noch weiter, wenn die Rechnung längst da ist.',
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-burgundy py-24 text-ivory md:py-36">
      <div className="pointer-events-none absolute -right-24 top-0 select-none font-serif text-[26rem] leading-none text-ivory/[0.035]">
        {STEPS[active].n}
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="label text-ivory/50">02 — So funktioniert’s</span>
            </Reveal>
            <h2 className="mt-7 max-w-[22ch] font-serif text-display-sm text-ivory md:text-[clamp(2.6rem,4.6vw,4rem)] md:leading-[0.96]">
              <RevealWords text="Vier Schritte. Und dann übernimmt der Tisch." />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-ivory/55">
              DEJAVU übernimmt die Zusammenstellung – die Menschen, der Ort, der Zeitpunkt. Du
              musst nur auftauchen und du selbst sein. Genau darum geht es.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div className="border-t border-ivory/15">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.n}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group block w-full border-b border-ivory/15 py-7 text-left transition-colors md:py-8"
                >
                  <div className="flex items-start gap-5 md:gap-8">
                    <span
                      className={`mt-2 font-sans text-[11px] tabular-nums tracking-[0.16em] transition-colors duration-500 ${
                        isActive ? 'text-blush' : 'text-ivory/30'
                      }`}
                    >
                      {s.n}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3
                          className={`font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none transition-all duration-500 ease-edit ${
                            isActive ? 'text-ivory' : 'text-ivory/45'
                          }`}
                        >
                          {s.title}
                        </h3>
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${
                            isActive ? 'scale-100 bg-cherry' : 'scale-0 bg-transparent'
                          }`}
                        />
                      </div>
                      <p
                        className={`mt-3 max-w-[38ch] text-[14px] leading-relaxed transition-colors duration-500 ${
                          isActive ? 'text-ivory/75' : 'text-ivory/35'
                        }`}
                      >
                        {s.copy}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[280px] lg:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="border border-ivory/15 p-7 md:p-10"
              >
                <p className="label text-blush">Schritt {STEPS[active].n}</p>
                <p className="mt-6 font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.25] text-ivory">
                  {STEPS[active].detail}
                </p>
                <div className="mt-10 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {STEPS.map((_, j) => (
                      <span
                        key={j}
                        className={`h-[3px] w-7 transition-colors duration-500 ${
                          j <= active ? 'bg-cherry' : 'bg-ivory/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-label text-ivory/35">
                    {active + 1} / 4
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
