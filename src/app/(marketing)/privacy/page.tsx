import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description:
    'Welche Daten DEJAVU erhebt, warum, wie lange sie gespeichert werden und welche Kontrolle Mitglieder über ihre Informationen haben.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHead
        eyebrow="Rechtliches"
        title="Datenschutzerklärung."
        lead="Eine verständliche Darstellung: was wir erheben, warum wir es brauchen und was du dagegen tun kannst."
      />
      <Prose>
        <p className="text-[11px] uppercase tracking-label text-ink/40">Zuletzt aktualisiert: November 2026</p>

        <h2>Was wir erheben</h2>
        <ul>
          <li>
            <strong>Kontodaten:</strong> Name, E-Mail-Adresse und Anmeldedatensätze (Passwörter werden
            von unserem Authentifizierungsanbieter gehasht; wir sehen sie nie).
          </li>
          <li>
            <strong>Profildaten:</strong> Geburtsdatum, Stadt, Beruf, kurze Vorstellung, optionaler
            Instagram-Name, Foto, Interessen, Essensvorlieben, Unverträglichkeiten, soziale
            Vorlieben, bevorzugte Tische und Verfügbarkeit.
          </li>
          <li>
            <strong>Matching-Daten:</strong> deine Fragebogenantworten und daraus abgeleitete
            Merkmale. Sie dienen der Tischzusammensetzung und werden anderen Mitgliedern niemals
            gezeigt.
          </li>
          <li>
            <strong>Mitgliedschafts- und Zahlungsdaten:</strong> Tarif, Zeiträume und Zahlungsreferenz.
            Kartendaten verarbeitet unser Zahlungsanbieter; unsere Server berühren sie nicht.
          </li>
          <li>
            <strong>Erlebnisdaten:</strong> Tische, denen du zugeteilt wurdest, Teilnahmestatus,
            Feedback und von dir eingereichte Meldungen.
          </li>
        </ul>

        <h2>Warum wir sie brauchen</h2>
        <p>
          Um Tische zusammenzustellen, die funktionieren, um dein Alter zu bestätigen, um die
          Mitgliedschaft abzurechnen, um dir zu sagen, wo du sein sollst, und um die Plattform sicher
          zu halten. Wir nutzen deine Daten nicht für Werbung und verkaufen sie nicht.
        </p>

        <h2>Wer was sieht</h2>
        <ul>
          <li>
            <strong>Du:</strong> alles, was wir über dich gespeichert haben.
          </li>
          <li>
            <strong>Dein Tisch:</strong> Vorname, Foto, Beruf, Stadt und Vorstellung – abhängig von
            deiner Sichtbarkeitseinstellung. Niemals deine E-Mail-Adresse, Fragebogenantworten oder
            Meldungen.
          </li>
          <li>
            <strong>Restaurants:</strong> Ernährungswünsche und Gruppengröße für ein bestätigtes
            Erlebnis. Sonst nichts.
          </li>
          <li>
            <strong>Unser Team:</strong> das Minimum, das zum Betrieb der Plattform und zur Klärung von
            Sicherheitsfragen nötig ist, über serverseitig geprüften administrativen Zugriff.
          </li>
        </ul>

        <h2>Wo die Daten liegen</h2>
        <p>
          Mitgliederdaten liegen in einer PostgreSQL-Datenbank bei Supabase in der Region Mumbai
          (ap-south-1), mit Row-Level-Security auf Datenbankebene. Anmeldesitzungen nutzen sichere,
          http-only Cookies. Sensible Server-Zugangsdaten liegen als verschlüsselte
          Umgebungsvariablen vor und sind nie Teil des clientseitigen Codes.
        </p>

        <h2>Wie lange wir sie behalten</h2>
        <p>
          Konto- und Profildaten bleiben, solange dein Konto aktiv ist. Wenn du dein Konto schließt,
          werden Profildaten gelöscht; begrenzte Aufzeichnungen zu Zahlungen, Sicherheitsmeldungen und
          Moderationsentscheidungen können wir aufbewahren, wo dies aus rechtlichen, buchhalterischen
          oder Sicherheitsgründen erforderlich ist.
        </p>

        <h2>Deine Möglichkeiten</h2>
        <ul>
          <li>Jedes Profilfeld auf der Profilseite bearbeiten oder löschen.</li>
          <li>Die Sichtbarkeit deines Profils jederzeit ändern.</li>
          <li>Mitglieder blockieren, mit denen du nicht an einem Tisch sitzen möchtest.</li>
          <li>Die Verlängerung der Mitgliedschaft auf der Mitgliedschaftsseite kündigen.</li>
          <li>Die Löschung deines Kontos bei uns beantragen.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Wir nutzen nur Cookies, die für Anmeldung und Sitzungssicherheit erforderlich sind. Auf
          DEJAVU gibt es keine Werbe- oder Tracking-Cookies von Drittanbietern.
        </p>

        <h2>Kontakt</h2>
        <p>
          Für Datenschutzanliegen nutze bitte die{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            Kontaktseite
          </Link>
          . Wir beantworten Datenanfragen innerhalb von 30 Tagen.
        </p>
      </Prose>
    </>
  );
}
