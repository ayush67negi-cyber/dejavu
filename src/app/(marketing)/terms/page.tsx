import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'AGB',
  description:
    'Die Bedingungen für DEJAVU-Mitgliedschaft, Erlebnisse, Zahlung, Kündigung und Verhalten.',
};

export default function TermsPage() {
  return (
    <>
      <PageHead
        eyebrow="Rechtliches"
        title="Allgemeine Geschäftsbedingungen."
        lead="Die Vereinbarung zwischen dir und DEJAVU. Geschrieben, um gelesen zu werden – nicht, um sich dahinter zu verstecken."
      />
      <Prose>
        <p className="text-[11px] uppercase tracking-label text-ink/40">Zuletzt aktualisiert: November 2026</p>

        <h2>1. Wer wir sind</h2>
        <p>
          DEJAVU ist eine Mitgliedschaft für gemeinsames Essen: Wir stellen kleine Gruppen
          erwachsener Menschen zusammen und organisieren für sie ein Treffen in einem Restaurant.
          DEJAVU ist Vermittler und Organisator. Wir sind kein Restaurant, kein Datingdienst und keine
          Beratungsstelle.
        </p>

        <h2>2. Teilnahmeberechtigung</h2>
        <p>
          Du musst mindestens 18 Jahre alt sein, um ein Konto zu führen. Du musst korrekte Angaben zu
          deiner Person machen, einschließlich deines Geburtsdatums, und sie aktuell halten. Ein Konto
          pro Person.
        </p>

        <h2>3. Mitgliedschaft und Zahlung</h2>
        <ul>
          <li>
            Mitgliedschaftszeiträume und Preise stehen auf der Mitgliedschaftsseite: ein Monat ₹1.999,
            drei Monate ₹4.999, sechs Monate ₹8.999, inklusive anfallender Steuern.
          </li>
          <li>
            Eine Mitgliedschaft umfasst vier kuratierte Sonntags-Dinner pro Monat, abhängig von
            Terminplan, Verfügbarkeit und diesen Bedingungen. Ein bestimmtes Restaurant, Datum oder
            eine bestimmte Gruppenzusammensetzung können wir nicht garantieren.
          </li>
          <li>
            Die Mitgliedschaft wird erst nach einer von unserem Zahlungsanbieter bestätigten Zahlung
            aktiv. Wir markieren kein Konto manuell als bezahlt, ohne dass eine autorisierte
            administrative Aktion dazu dokumentiert ist.
          </li>
          <li>
            <strong>Speisen und Getränke sind nicht enthalten.</strong> Mitglieder zahlen ihr Essen
            und ihre Getränke direkt im Restaurant, sofern ein Erlebnis nicht ausdrücklich etwas
            anderes angibt.
          </li>
        </ul>

        <h2>4. Kündigung und Erstattungen</h2>
        <ul>
          <li>
            Du kannst die Verlängerung jederzeit auf deiner Mitgliedschaftsseite kündigen. Der Zugang
            läuft bis zum Ende des bezahlten Zeitraums, danach wird nichts mehr abgebucht.
          </li>
          <li>Bereits bestätigte Erlebnisse bleiben auch nach einer Kündigung der Verlängerung bestehen.</li>
          <li>
            Da Plätze von Hand zusammengestellt werden und die Kapazität begrenzt ist, werden
            Zahlungen für einen bereits begonnenen Zeitraum nicht anteilig erstattet – außer wenn
            gesetzlich vorgeschrieben oder wenn DEJAVU die für diesen Zeitraum vorgesehenen Erlebnisse
            nicht bereitstellen kann.
          </li>
        </ul>

        <h2>5. Teilnahme</h2>
        <p>
          Wenn du an einem Tisch bestätigt bist, haben andere ihren Abend danach geplant. Wenn du
          nicht teilnehmen kannst, sag uns so früh wie möglich über das Dashboard Bescheid.
          Wiederholte kurzfristige Absagen oder No-Shows können zum Ausschluss von künftigen Tischen
          und in ernsten Fällen zur Sperrung des Kontos führen.
        </p>

        <h2>6. Verhalten</h2>
        <p>An einem DEJAVU-Tisch verpflichtest du dich:</p>
        <ul>
          <li>andere Mitglieder respektvoll zu behandeln, ohne Belästigung oder diskriminierendes Verhalten,</li>
          <li>DEJAVU nicht für Dating, Anwerbung oder Akquise jeglicher Art zu nutzen,</li>
          <li>andere Mitglieder nicht ohne deren Zustimmung zu filmen oder zu fotografieren,</li>
          <li>persönliche Informationen anderer Mitglieder nicht außerhalb des Tisches weiterzugeben,</li>
          <li>nüchtern genug anzukommen, um ein Gespräch zu führen.</li>
        </ul>
        <p>
          Ein Verstoß gegen diese Regeln kann eine sofortige Sperrung nach sich ziehen. Details in den{' '}
          <Link href="/guidelines" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Community-Richtlinien
          </Link>
          .
        </p>

        <h2>7. Sicherheit</h2>
        <p>
          DEJAVU stellt Vorstellungen zwischen Erwachsenen zusammen, kann aber das Verhalten einzelner
          Mitglieder nicht garantieren. Du bist für deine eigenen Sicherheitsentscheidungen
          verantwortlich. Melde jedes Anliegen sofort über das Dashboard oder die{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Kontaktseite
          </Link>
          . In einem Notfall kontaktiere zuerst die örtlichen Behörden.
        </p>

        <h2>8. Haftung</h2>
        <p>
          DEJAVU haftet nicht für Handlungen oder Unterlassungen von Mitgliedern, Restaurants oder
          anderen Dritten. Soweit gesetzlich zulässig, ist unsere Haftung auf die Mitgliedsbeiträge
          begrenzt, die du im laufenden Zeitraum gezahlt hast.
        </p>

        <h2>9. Änderungen</h2>
        <p>
          Wir können diese Bedingungen aktualisieren. Über wesentliche Änderungen informieren wir
          Mitglieder per E-Mail oder In-App-Benachrichtigung, bevor sie wirksam werden.
        </p>

        <h2>10. Kontakt</h2>
        <p>
          Fragen zu diesen Bedingungen richtest du bitte über die{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Kontaktseite
          </Link>{' '}
          an uns.
        </p>
      </Prose>
    </>
  );
}
