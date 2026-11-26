import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Community guidelines',
  description: 'How we behave at a DEJAVU table.',
};

export default function GuidelinesPage() {
  return (
    <>
      <PageHead
        eyebrow="Community"
        title="How we behave at a table."
        lead="Six short rules. They exist because a table only works when everyone can relax."
        tone="sand"
      />
      <Prose>
        <h2>1. Everyone is a guest</h2>
        <p>
          You are not the host and neither is anyone else. Treat the table as a shared room: make space,
          pass things, notice who has not spoken yet.
        </p>

        <h2>2. Ask before you assume</h2>
        <p>
          DEJAVU is not a dating app. Do not treat a table as an opportunity to pursue someone. If
          someone is not interested in continuing a conversation, that is the end of it.
        </p>

        <h2>3. No photographs without consent</h2>
        <p>
          Some people are private about being photographed, and some are at the table with people who
          do not know they are there. Ask first, every time, including for stories.
        </p>

        <h2>4. Keep it offline</h2>
        <p>
          What people tell you at a table is not yours to publish. Do not screenshot conversations,
          share contact details, or post about other members without their permission.
        </p>

        <h2>5. Arrive, and arrive on time</h2>
        <p>
          A seat at a DEJAVU table is a small commitment. If you cannot make it, tell us as early as
          you can so we can offer the seat to someone else.
        </p>

        <h2>6. Say something</h2>
        <p>
          If something at a table makes you or someone else uncomfortable, use the report option in
          your dashboard. You do not need to be certain — we would rather hear it and look into it.
        </p>

        <p>
          Read more on{' '}
          <Link href="/safety" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            safety
          </Link>{' '}
          and the{' '}
          <Link href="/terms" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            terms of service
          </Link>
          .
        </p>
      </Prose>
    </>
  );
}
