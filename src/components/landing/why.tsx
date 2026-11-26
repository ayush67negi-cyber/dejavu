'use client';

import { Reveal, RevealWords } from '@/components/ui/motion';
import { Smartphone, UtensilsCrossed, Users, Compass, Heart, Ban } from 'lucide-react';

const REASONS = [
  {
    icon: UtensilsCrossed,
    title: 'Echte Gespräche',
    copy: 'Ein Tisch, eine Uhrzeit und sonst nirgends sein müssen. Mehr Technik braucht es nicht.',
  },
  {
    icon: Users,
    title: 'Echte Menschen',
    copy: 'Geprüfte Mitglieder, nur Erwachsene, aus derselben Stadt. Jedes Profil wird vor dem ersten Tisch angesehen.',
  },
  {
    icon: Compass,
    title: 'Kleine Runden',
    copy: 'Vier bis sechs Plätze pro Tisch. Groß genug für Bandbreite, klein genug, dass alle zu Wort kommen.',
  },
  {
    icon: Heart,
    title: 'Gemeinsame Interessen',
    copy: 'Du sitzt mit Menschen am Tisch, die denselben Tisch gewählt haben wie du – das ist schon eine Gemeinsamkeit.',
  },
  {
    icon: Ban,
    title: 'Kein Dating-Druck',
    copy: 'DEJAVU ist keine Dating-App. Niemand wird bewertet, und es gibt nichts zu wischen.',
  },
  {
    icon: Smartphone,
    title: 'Kein endloses Swipen',
    copy: 'Du trittst einmal bei. Die Vorstellungen kommen. Der Rest deiner Woche gehört dir.',
  },
];

export function Why() {
  return (
    <section className="relative overflow-hidden bg-sand py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="label text-ink/45">05 — Warum DEJAVU</span>
            </Reveal>
            <h2 className="mt-7 font-serif text-display-sm text-ink md:text-[clamp(3rem,6vw,5.2rem)] md:leading-[0.9]">
              <RevealWords text="Weniger scrollen." />
              <br />
              <span className="text-cherry">
                <RevealWords text="Mehr erleben." delay={0.15} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink/60">
              Wir haben DEJAVU gebaut, weil die Alternative – noch eine App, noch ein Feed, noch ein
              halbes Gespräch, das am Dienstag versandet – für uns auch nicht funktioniert hat.
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
