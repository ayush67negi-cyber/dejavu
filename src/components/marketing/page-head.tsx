import { Reveal, RevealWords } from '@/components/ui/motion';

export function PageHead({
  eyebrow,
  title,
  lead,
  tone = 'ivory',
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: 'ivory' | 'ink' | 'burgundy' | 'sand';
}) {
  const bg =
    tone === 'ink'
      ? 'bg-ink text-ivory'
      : tone === 'burgundy'
        ? 'bg-burgundy text-ivory'
        : tone === 'sand'
          ? 'bg-sand text-ink'
          : 'bg-ivory text-ink';

  return (
    <section className={`${bg} border-b border-current/10`}>
      <div className="mx-auto max-w-[1300px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <span className="label opacity-45">{eyebrow}</span>
        </Reveal>
        <h1 className="mt-6 max-w-[20ch] font-serif text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[0.9] tracking-[-0.03em]">
          <RevealWords text={title} />
        </h1>
        {lead && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.75] opacity-60">{lead}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1300px] px-5 py-16 md:px-10 md:py-20">
      <div className="max-w-[68ch] space-y-6 text-[14.5px] leading-[1.8] text-ink/70 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-[clamp(1.5rem,2.6vw,2rem)] [&_h2]:leading-tight [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-[11px] [&_h3]:uppercase [&_h3]:tracking-label [&_h3]:text-ink/45 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
