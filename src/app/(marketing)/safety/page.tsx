import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Sicherheit',
  description:
    'Wie DEJAVU Tische sicher hält: geprüfte Mitglieder, Zugang nur für Erwachsene, private Profilsteuerung, Melden und Blockieren und klare Moderation.',
};

export default function SafetyPage() {
  return (
    <>
      <PageHead
        eyebrow="Sicherheit & Privatsphäre"
        title="Fremde sind der Sinn. Unsicher ist es nicht."
        lead="DEJAVU bringt Menschen dazu, sich persönlich zu treffen. Sicherheit ist deshalb eine Produktanforderung und keine reine Richtlinienseite. So funktioniert sie konkret."
        tone="ink"
      />
      <Prose>
        <h2>Wer einen Platz bekommt</h2>
        <p>
          DEJAVU ist Erwachsenen vorbehalten. Jedes Mitglied bestätigt beim Onboarding sein
          Geburtsdatum, und die Plattform setzt die Altersgrenze von 18 Jahren auf Datenbankebene
          durch. Mitglieder ohne abgeschlossenes Onboarding können weder an einem Tisch sitzen noch
          Erlebnisse durchsuchen.
        </p>

        <h3>Was andere sehen können</h3>
        <ul>
          <li>
            <strong>Bevor ein Tisch bestätigt ist:</strong> Über deine Tischrunde sieht niemand deine
            Profildetails. Ortsangaben bleiben verborgen, bis ein Erlebnis bestätigt ist.
          </li>
          <li>
            <strong>Sobald du sitzt:</strong> Menschen an deinem Tisch sehen deinen Vornamen, dein
            Foto, deinen Beruf, deine Stadt und – wenn du es erlaubst – deine kurze Vorstellung.
          </li>
          <li>
            <strong>Niemals:</strong> deine E-Mail-Adresse, dein Passwort, deine Fragebogenantworten,
            deine Meldungen oder private Informationen anderer Mitglieder.
          </li>
          <li>
            <strong>Dein Einfluss:</strong> Du kannst deine Sichtbarkeit jederzeit im Profil auf „Nur
            am Tisch“, „Alle Mitglieder“ oder „Privat“ stellen.
          </li>
        </ul>

        <h2>Melden und Blockieren</h2>
        <p>
          Bei jedem bestätigten Erlebnis gibt es in deinem Dashboard eine Meldefunktion. Meldungen
          sind privat: Wer gemeldet wird, sieht deinen Namen nicht. Ein Mensch aus dem DEJAVU-Team
          prüft jede Meldung und hält eine schriftliche Entscheidung fest.
        </p>
        <p>
          Wenn du jemanden blockierst, sitzt ihr nie am selben Tisch. Blockierte Mitglieder werden
          aus deinen Empfehlungen ausgeschlossen. Eine Blockierung kannst du jederzeit im Profil
          aufheben.
        </p>

        <h2>Wenn etwas schiefgeht</h2>
        <p>
          Wenn du dich an einem Tisch unsicher fühlst, geh. Du schuldest niemandem eine Erklärung und
          musst das Essen nicht beenden. Melde dich am selben Tag bei uns – wir handeln, auch mit
          sofortiger Sperrung eines Kontos während der Prüfung.
        </p>
        <p>
          Bei unmittelbarer Gefahr kontaktiere zuerst den örtlichen Notruf und informiere uns danach.
        </p>

        <h2>Moderationsentscheidungen</h2>
        <ul>
          <li>Konten können während einer Prüfung sofort und ohne Vorankündigung gesperrt werden.</li>
          <li>Wiederholte No-Shows prüfen wir als Muster, nicht als Einzelfall.</li>
          <li>Gesperrte Mitglieder können keine Erlebnisse durchsuchen und keinem Tisch zugeteilt werden.</li>
          <li>Jede Moderationsentscheidung wird intern mit schriftlicher Begründung dokumentiert.</li>
        </ul>

        <h2>Unsere Datenpraxis</h2>
        <p>
          Mitgliederdaten liegen in einer PostgreSQL-Datenbank mit Row-Level-Security. Mitglieder
          können ausschließlich eigene Daten lesen und ändern; administrativer Zugriff ist eine
          separate, serverseitig geprüfte Rolle, die nicht vom Client vergeben werden kann.
          Ernährungsangaben gehen vor einem Erlebnis an das Restaurant und werden sonst als privat
          behandelt.
        </p>
        <p>
          Wir verkaufen keine Mitgliederdaten. Lies die vollständige{' '}
          <Link href="/privacy" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Datenschutzerklärung
          </Link>{' '}
          und die{' '}
          <Link href="/guidelines" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Community-Richtlinien
          </Link>
          .
        </p>

        <h2>Kontakt</h2>
        <p>
          Sicherheitsanliegen haben bei uns Vorrang. Nutze die{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Kontaktseite
          </Link>{' '}
          und markiere deine Nachricht als Sicherheitsangelegenheit.
        </p>
      </Prose>
    </>
  );
}
