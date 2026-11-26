import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Erreiche das DEJAVU-Team zu Mitgliedschaft, Sicherheit, Presse oder Partnerschaften.',
};

const CHANNELS = [
  {
    label: 'Mitgliedschaft',
    copy: 'Fragen zu Tarifen, Abrechnung, Pausieren oder Kündigen.',
    href: 'mailto:members@dejavu.dining?subject=Membership%20enquiry',
    action: 'members@dejavu.dining',
  },
  {
    label: 'Sicherheit',
    copy: 'Alles, was an einem Tisch passiert ist. Wird täglich zuerst geprüft.',
    href: 'mailto:safety@dejavu.dining?subject=Safety%20report',
    action: 'safety@dejavu.dining',
  },
  {
    label: 'Restaurants',
    copy: 'Wenn du einen Ort führst, den wir uns ansehen sollten.',
    href: 'mailto:venues@dejavu.dining?subject=Venue%20partnership',
    action: 'venues@dejavu.dining',
  },
  {
    label: 'Presse',
    copy: 'Interviews, Bildmaterial und Markenanfragen.',
    href: 'mailto:press@dejavu.dining?subject=Press%20enquiry',
    action: 'press@dejavu.dining',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="Kontakt"
        title="Schreib einem Menschen, keinem Formular."
        lead="DEJAVU ist ein kleines Team. Jede Nachricht unten erreicht einen Menschen – Sicherheitsnachrichten lesen wir zuerst."
        tone="burgundy"
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[1300px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-px bg-ink/12 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group bg-ivory p-7 transition-colors hover:bg-cream md:p-9"
              >
                <p className="label text-ink/35">{c.label}</p>
                <p className="mt-4 font-serif text-[clamp(1.3rem,2.4vw,1.7rem)] leading-none text-ink transition-colors group-hover:text-cherry">
                  {c.action}
                </p>
                <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-ink/50">{c.copy}</p>
              </a>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-ink/12 pt-10 md:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="label text-ink/40">Vor dem Tisch</p>
              <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.05] text-ink">
                Die meisten Antworten stehen schon geschrieben.
              </h2>
            </div>
            <div className="space-y-4 text-[13.5px] leading-relaxed text-ink/60">
              <p>
                Mitgliedschaft, Preise und Kündigung findest du auf der{' '}
                <Link href="/membership" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  Mitgliedschaftsseite
                </Link>
                . Wie Tische zusammengestellt werden, steht unter{' '}
                <Link href="/how-it-works" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  So funktioniert’s
                </Link>
                . Sicherheit, Meldungen und Datenschutz findest du unter{' '}
                <Link href="/safety" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  Sicherheit
                </Link>
                .
              </p>
              <p>
                Wenn es um ein bestimmtes Erlebnis geht, nenne Datum und Stadt – damit finden wir den
                Tisch sofort.
              </p>
              <p className="text-[11px] uppercase tracking-label text-ink/30">
                Wir antworten innerhalb von zwei Werktagen. Sicherheitsnachrichten bearbeiten wir am selben Tag.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
