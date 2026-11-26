import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead, Prose } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What data DEJAVU collects, why, how long it is kept, and the controls members have over their own information.',
};

export default function PrivacyPage() {
  return (
    <>
      <PageHead
        eyebrow="Legal"
        title="Privacy policy."
        lead="A plain-language account of what we collect, why we need it, and what you can do about it."
      />
      <Prose>
        <p className="text-[11px] uppercase tracking-label text-ink/35">Last updated: November 2026</p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> name, email address and authentication records (passwords
            are hashed by our authentication provider; we never see them).
          </li>
          <li>
            <strong>Profile data:</strong> date of birth, city, occupation, short introduction,
            optional Instagram handle, photo, interests, food preferences, dietary restrictions,
            social preferences, preferred tables and availability.
          </li>
          <li>
            <strong>Matching data:</strong> your questionnaire responses and derived trait scores.
            These are used to compose tables and are never shown to other members.
          </li>
          <li>
            <strong>Membership and payment records:</strong> plan, dates and payment reference. Card
            details are handled by our payment provider and never touch our servers.
          </li>
          <li>
            <strong>Experience records:</strong> tables you have been assigned to, attendance
            status, feedback and any reports you submit.
          </li>
        </ul>

        <h2>Why we need it</h2>
        <p>
          To compose tables that work, to confirm you are an adult, to take payment for membership,
          to tell you where to be, and to keep the platform safe. We do not use your data for
          advertising and we do not sell it.
        </p>

        <h2>Who sees what</h2>
        <ul>
          <li>
            <strong>You:</strong> everything we hold about you.
          </li>
          <li>
            <strong>Your table:</strong> first name, photo, occupation, city and introduction —
            subject to your visibility setting. Never your email, questionnaire answers or reports.
          </li>
          <li>
            <strong>Restaurants:</strong> dietary requirements and group size for a confirmed
            experience. Nothing else.
          </li>
          <li>
            <strong>Our team:</strong> the minimum needed to run the platform and handle safety
            issues, under server-verified administrative access.
          </li>
        </ul>

        <h2>Where it lives</h2>
        <p>
          Member data is stored in a PostgreSQL database hosted by Supabase in the Mumbai (ap-south-1)
          region, with row-level security enforced at the database level. Authentication sessions use
          secure, http-only cookies. Sensitive server credentials are stored as encrypted environment
          variables and are never included in client-side code.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Account and profile data are kept while your account is active. If you close your account,
          profile data is deleted; limited records of payments, safety reports and moderation
          decisions may be retained where required for legal, accounting or safety reasons.
        </p>

        <h2>Your controls</h2>
        <ul>
          <li>Edit or delete any profile field from your profile page.</li>
          <li>Change profile visibility at any time.</li>
          <li>Block members you do not want to be seated with.</li>
          <li>Cancel membership renewal from the membership page.</li>
          <li>Request account deletion by contacting us.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use only cookies required for authentication and session security. There are no
          advertising or third-party tracking cookies on DEJAVU.
        </p>

        <h2>Contact</h2>
        <p>
          For any privacy request, use the{' '}
          <Link href="/contact" className="underline decoration-ink/30 underline-offset-2 hover:text-ink">
            contact page
          </Link>
          . We respond to data requests within 30 days.
        </p>
      </Prose>
    </>
  );
}
