import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Safety',
  description:
    'How DEJAVU keeps tables safe: verified members, adult-only access, private profile controls, reporting and blocking, and clear moderation.',
};

export default function SafetyPage() {
  return (
    <>
      <PageHead
        eyebrow="Safety & privacy"
        title="Strangers are the point. Unsafe is not."
        lead="DEJAVU asks people to meet in person, so safety is a product requirement rather than a policy page. Here is exactly how it works."
        tone="ink"
      />
      <Prose>
        <h2>Who gets a seat</h2>
        <p>
          DEJAVU is restricted to adults. Every member confirms their date of birth during
          onboarding, and the platform enforces an 18+ constraint at the database level. Members who
          have not completed onboarding cannot be placed at a table or browse experiences.
        </p>

        <h3>What other people can see</h3>
        <ul>
          <li>
            <strong>Before a table is confirmed:</strong> nobody sees your profile details through
            your table. Venue details stay hidden until an experience is confirmed.
          </li>
          <li>
            <strong>Once you are seated:</strong> people at your table see your first name, photo,
            occupation, city and — if you have allowed it — your short introduction.
          </li>
          <li>
            <strong>Never:</strong> your email address, your password, your questionnaire answers,
            your reports, or any other member’s private information.
          </li>
          <li>
            <strong>Your control:</strong> you can set your visibility to table-only, members, or
            private in your profile at any time.
          </li>
        </ul>

        <h2>Reporting and blocking</h2>
        <p>
          Every confirmed experience has a report option in your dashboard. Reports are private: the
          person you report does not see your name. A member of the DEJAVU team reviews every report
          and records a written decision.
        </p>
        <p>
          Blocking a member ensures the two of you are never placed at the same table. Blocked
          members are excluded from your experience recommendations. You can remove a block at any
          time from your profile.
        </p>

        <h2>If something goes wrong</h2>
        <p>
          If you ever feel unsafe at a table, leave. You do not owe anyone an explanation, and you do
          not need to finish the meal. Contact us the same day and we will act — including suspending
          an account while we investigate.
        </p>
        <p>
          For anything involving immediate danger, contact local emergency services first, then tell
          us.
        </p>

        <h2>Moderation decisions</h2>
        <ul>
          <li>Accounts can be suspended pending review, immediately and without prior notice.</li>
          <li>Repeated no-shows are reviewed as a pattern, not a single incident.</li>
          <li>Suspended members cannot browse experiences or be matched to tables.</li>
          <li>Every moderation decision is recorded internally with a written rationale.</li>
        </ul>

        <h2>Our data practices</h2>
        <p>
          Member data is stored in a PostgreSQL database with row-level security. Members can read
          and update only their own records; administrative access is a separate, server-verified
          role that cannot be granted from the client. Dietary information is shared with the venue
          in advance of an experience and is otherwise treated as private.
        </p>
        <p>
          We do not sell member data. Read the full{' '}
          <Link href="/privacy" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            privacy policy
          </Link>{' '}
          and the{' '}
          <Link href="/guidelines" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            community guidelines
          </Link>
          .
        </p>

        <h2>Contact</h2>
        <p>
          Safety concerns are prioritised. Use the{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            contact page
          </Link>{' '}
          and mark your message as a safety matter.
        </p>
      </Prose>
    </>
  );
}
