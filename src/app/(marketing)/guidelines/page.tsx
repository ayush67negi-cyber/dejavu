import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Community-Richtlinien',
  description: 'Wie wir uns an einem DEJAVU-Tisch verhalten.',
};

export default function GuidelinesPage() {
  return (
    <>
      <PageHead
        eyebrow="Community"
        title="Wie wir uns an einem Tisch verhalten."
        lead="Sechs kurze Regeln. Sie existieren, weil ein Tisch nur funktioniert, wenn alle sich entspannen können."
        tone="sand"
      />
      <Prose>
        <h2>1. Alle sind Gäste</h2>
        <p>
          Du bist nicht der Gastgeber – und niemand sonst auch. Behandle den Tisch als gemeinsamen
          Raum: Platz machen, weitergeben, bemerken, wer noch nichts gesagt hat.
        </p>

        <h2>2. Frag, bevor du annimmst</h2>
        <p>
          DEJAVU ist keine Dating-App. Behandle einen Tisch nicht als Gelegenheit, jemanden zu
          verfolgen. Wenn jemand kein Interesse an einem weiteren Gespräch hat, ist es damit beendet.
        </p>

        <h2>3. Keine Fotos ohne Zustimmung</h2>
        <p>
          Manche Menschen sind zurückhaltend, wenn es um Fotos geht, und manche sitzen mit Menschen am
          Tisch, die nicht wissen, dass sie dort sind. Frag jedes Mal vorher – auch für Storys.
        </p>

        <h2>4. Bleib offline damit</h2>
        <p>
          Was dir an einem Tisch erzählt wird, gehört nicht in die Öffentlichkeit. Keine Screenshots,
          keine weitergegebenen Kontaktdaten und keine Posts über andere Mitglieder ohne Erlaubnis.
        </p>

        <h2>5. Komm – und komm pünktlich</h2>
        <p>
          Ein Platz an einem DEJAVU-Tisch ist eine kleine Verpflichtung. Wenn du es nicht schaffst,
          sag uns so früh wie möglich Bescheid, damit wir den Platz weitergeben können.
        </p>

        <h2>6. Sag etwas</h2>
        <p>
          Wenn etwas an einem Tisch dich oder andere unwohl fühlen lässt, nutze die Meldefunktion in
          deinem Dashboard. Du musst dir nicht sicher sein – wir hören lieber zu und schauen nach.
        </p>

        <p>
          Mehr dazu unter{' '}
          <Link href="/safety" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Sicherheit
          </Link>{' '}
          und in den{' '}
          <Link href="/terms" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            AGB
          </Link>
          .
        </p>
      </Prose>
    </>
  );
}
