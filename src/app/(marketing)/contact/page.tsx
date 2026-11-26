import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/marketing/page-head';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the DEJAVU team about membership, safety, press or partnerships.',
};

const CHANNELS = [
  {
    label: 'Membership',
    copy: 'Questions about plans, billing, pausing or cancelling.',
    href: 'mailto:members@dejavu.dining?subject=Membership%20enquiry',
    action: 'members@dejavu.dining',
  },
  {
    label: 'Safety',
    copy: 'Anything that happened at a table. Reviewed first, every day.',
    href: 'mailto:safety@dejavu.dining?subject=Safety%20report',
    action: 'safety@dejavu.dining',
  },
  {
    label: 'Restaurants',
    copy: 'If you run a room you would like us to consider.',
    href: 'mailto:venues@dejavu.dining?subject=Venue%20partnership',
    action: 'venues@dejavu.dining',
  },
  {
    label: 'Press',
    copy: 'Interviews, imagery and brand enquiries.',
    href: 'mailto:press@dejavu.dining?subject=Press%20enquiry',
    action: 'press@dejavu.dining',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Write to a person, not a form."
        lead="DEJAVU is a small team. Every message below reaches a human, and safety messages are read first."
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
              <p className="label text-ink/35">Before the table</p>
              <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.05] text-ink">
                Most answers are already written down.
              </h2>
            </div>
            <div className="space-y-4 text-[13.5px] leading-relaxed text-ink/60">
              <p>
                Membership, pricing and cancellation are covered on the{' '}
                <Link href="/membership" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  membership page
                </Link>
                . How tables are composed is on{' '}
                <Link href="/how-it-works" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  how it works
                </Link>
                . Safety, reporting and privacy are on{' '}
                <Link href="/safety" className="underline decoration-ink/25 underline-offset-2 hover:text-ink">
                  safety
                </Link>
                .
              </p>
              <p>
                If your message is about a specific experience, include the date and city — it helps
                us find the table immediately.
              </p>
              <p className="text-[11px] uppercase tracking-label text-ink/30">
                We reply within two working days. Safety messages are actioned the same day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
