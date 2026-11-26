import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Terms of service',
  description:
    'The terms governing DEJAVU membership, experiences, payment, cancellation and conduct.',
};

export default function TermsPage() {
  return (
    <>
      <PageHead
        eyebrow="Legal"
        title="Terms of service."
        lead="The agreement between you and DEJAVU. Written to be read, not to be hidden behind."
      />
      <Prose>
        <p className="text-[11px] uppercase tracking-label text-ink/35">Last updated: November 2026</p>

        <h2>1. Who we are</h2>
        <p>
          DEJAVU is a social dining membership that composes small groups of adults and arranges for
          them to meet at a restaurant. DEJAVU is a facilitator and organiser. We are not a
          restaurant, a dating service, or a counselling service.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old to hold an account. You must provide accurate information
          about yourself, including your date of birth, and keep it current. One account per person.
        </p>

        <h2>3. Membership and payment</h2>
        <ul>
          <li>
            Membership periods and prices are displayed on the membership page: one month ₹1,999,
            three months ₹4,999, six months ₹8,999, inclusive of applicable taxes.
          </li>
          <li>
            A membership includes four curated Sunday dining experiences per month, subject to
            scheduling, availability and these terms. We do not guarantee a specific restaurant, date
            or group composition.
          </li>
          <li>
            Membership activates only after a payment verified by our payment provider. We never mark
            an account as paid manually without an authorised administrative action recorded against
            it.
          </li>
          <li>
            <strong>Food and beverages are not included.</strong> Members pay for their own food and
            drinks directly at the restaurant unless an experience explicitly states otherwise.
          </li>
        </ul>

        <h2>4. Cancellation and refunds</h2>
        <ul>
          <li>
            You may cancel renewal at any time from your membership page. Access continues until the
            end of the paid period, and no further charge is made.
          </li>
          <li>
            Experiences already confirmed are honoured after a cancellation of renewal.
          </li>
          <li>
            Because seats are composed by hand and capacity is limited, payments for a period already
            begun are not refunded on a pro-rata basis, except where required by law or where DEJAVU
            cannot provide the experiences allocated to that period.
          </li>
        </ul>

        <h2>5. Attendance</h2>
        <p>
          When you are confirmed at a table, other people have planned their evening around it. If
          you cannot attend, tell us as early as possible through the dashboard. Repeated late
          cancellations or no-shows may result in removal from future tables and, in serious cases,
          suspension of the account.
        </p>

        <h2>6. Conduct</h2>
        <p>At a DEJAVU table you agree to:</p>
        <ul>
          <li>Treat other members with respect, without harassment or discriminatory behaviour.</li>
          <li>Not use DEJAVU for dating, solicitation or recruitment of any kind.</li>
          <li>Not record or photograph other members without their consent.</li>
          <li>Not share another member’s personal information outside the table.</li>
          <li>Arrive sober enough to hold a conversation.</li>
        </ul>
        <p>
          Breach of these rules may result in immediate suspension. Read the{' '}
          <Link href="/guidelines" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            community guidelines
          </Link>{' '}
          for detail.
        </p>

        <h2>7. Safety</h2>
        <p>
          DEJAVU composes introductions between adults, but we cannot guarantee the behaviour of any
          member. You are responsible for your own safety decisions. Report any concern immediately
          through the dashboard or{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            contact page
          </Link>
          . In an emergency, contact local authorities first.
        </p>

        <h2>8. Liability</h2>
        <p>
          DEJAVU is not responsible for the acts or omissions of members, restaurants or other third
          parties. To the extent permitted by law, our liability is limited to the membership fees you
          have paid in the current period.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update these terms. Material changes will be communicated to members by email or
          in-app notification before they take effect.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms should go to the{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            contact page
          </Link>
          .
        </p>
      </Prose>
    </>
  );
}
