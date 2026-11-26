import Link from 'next/link';

export function Wordmark({
  className = '',
  href = '/',
  tone = 'ink',
}: {
  className?: string;
  href?: string | null;
  tone?: 'ink' | 'ivory';
}) {
  const color = tone === 'ivory' ? 'text-ivory' : 'text-ink';
  const content = (
    <span className={`group inline-flex items-baseline gap-[3px] ${color} ${className}`}>
      <span className="font-serif text-[26px] leading-none tracking-[-0.02em]">DEJAVU</span>
      <span className="mb-[3px] h-[5px] w-[5px] translate-y-0 rounded-full bg-cherry transition-transform duration-500 ease-edit group-hover:-translate-y-[3px]" />
    </span>
  );
  if (!href) return content;
  return (
    <Link href={href} aria-label="DEJAVU home" className="inline-block">
      {content}
    </Link>
  );
}
