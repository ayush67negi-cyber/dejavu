'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { Reveal, RevealWords } from '@/components/ui/motion';
import { PLAN_COPY, MEMBERSHIP_BENEFITS } from '@/lib/constants';

const ORDER = ['monthly', 'quarterly', 'biannual'] as const;

export function Membership() {
  return (
    <section id="membership" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="label text-ink/45">06 — Mitgliedschaft</span>
            </Reveal>
            <h2 className="mt-7 max-w-[20ch] font-serif text-display-sm text-ink md:text-[clamp(2.6rem,4.8vw,4.2rem)] md:leading-[0.95]">
              <RevealWords text="Ein Platz am Tisch, vier Sonntage im Monat." />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[36ch] text-[15px] leading-relaxed text-ink/55">
              Eine Mitgliedschaft, ein monatlicher Rhythmus. Wähle, wie lange du bleiben möchtest.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ORDER.map((id, i) => {
            const plan = PLAN_COPY[id];
            return (
              <Reveal key={id} delay={i * 0.08}>
                <div
                  className={`group relative flex h-full flex-col p-7 transition-all duration-500 ease-edit md:p-9 ${
                    plan.recommended
                      ? 'bg-burgundy text-ivory'
                      : 'border border-ink/15 bg-transparent text-ink hover:border-ink/40'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute right-0 top-0 bg-cherry px-4 py-1.5 text-[9px] uppercase tracking-label text-ivory">
                      Am häufigsten gewählt
                    </span>
                  )}
                  <p
                    className={`label ${plan.recommended ? 'text-ivory/50' : 'text-ink/40'}`}
                  >
                    {plan.months === 1 ? '1 Monat' : `${plan.months} Monate`}
                  </p>
                  <p className="mt-6 font-serif text-[clamp(2.6rem,4vw,3.4rem)] leading-none">
                    <span className="text-[0.45em] align-top">₹</span>
                    {plan.price.toLocaleString('de-DE')}
                  </p>
                  <p
                    className={`mt-2 text-[11px] uppercase tracking-[0.14em] ${
                      plan.recommended ? 'text-ivory/45' : 'text-ink/40'
                    }`}
                  >
                    ≈ ₹{Math.round(plan.price / plan.months).toLocaleString('de-DE')} / Monat
                  </p>

                  <p
                    className={`mt-6 text-[13.5px] leading-relaxed ${
                      plan.recommended ? 'text-ivory/70' : 'text-ink/55'
                    }`}
                  >
                    {plan.note}
                  </p>

                  <ul className="mt-7 space-y-2.5">
                    {MEMBERSHIP_BENEFITS.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[12.5px] leading-snug">
                        <Check
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            plan.recommended ? 'text-blush' : 'text-cherry'
                          }`}
                          strokeWidth={2}
                        />
                        <span className={plan.recommended ? 'text-ivory/75' : 'text-ink/65'}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/signup?plan=${id}`}
                    className={`mt-9 flex items-center justify-center py-4 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ease-edit ${
                      plan.recommended
                        ? 'bg-ivory text-ink hover:bg-cherry hover:text-ivory'
                        : 'bg-ink text-ivory hover:bg-cherry'
                    }`}
                  >
                    {plan.name} wählen
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-12 grid gap-6 border-t border-ink/15 pt-8 text-[12px] leading-relaxed text-ink/50 md:grid-cols-3">
            <p>
              <span className="mb-1 block text-[10px] uppercase tracking-label text-ink/70">
                Was die Mitgliedschaft umfasst
              </span>
              Vier kuratierte Sonntags-Dinner pro Monat, abhängig von Terminplan, Verfügbarkeit und
              den Mitgliedschaftsbedingungen.
            </p>
            <p>
              <span className="mb-1 block text-[10px] uppercase tracking-label text-ink/70">
                Essen und Getränke
              </span>
              Speisen und Getränke im Restaurant zahlen Mitglieder separat und direkt vor Ort.
            </p>
            <p>
              <span className="mb-1 block text-[10px] uppercase tracking-label text-ink/70">
                Kündigung
              </span>
              Kündige auf deiner Mitgliedschaftsseite. Der Zugang läuft bis zum Ende des bezahlten
              Zeitraums weiter; es wird nichts mehr verlängert. Bereits bestätigte Tische bleiben
              bestehen.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
