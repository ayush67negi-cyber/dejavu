import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'light' | 'ghost';
  arrow?: boolean;
  className?: string;
};

const styles = {
  solid: 'bg-ink text-ivory hover:bg-cherry',
  outline: 'border border-current/30 text-current hover:bg-current hover:text-ivory',
  light: 'bg-ivory text-ink hover:bg-cherry hover:text-ivory',
  ghost: 'text-current hover:text-cherry',
};

export function CTA({ href, children, variant = 'solid', arrow = true, className = '' }: Props) {
  const isOutline = variant === 'outline';
  return (
    <Link
      href={href}
      className={`btn group overflow-hidden px-7 py-4 ${styles[variant]} ${
        isOutline ? 'border-current/30' : ''
      } ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight
          className="relative z-10 h-3.5 w-3.5 transition-transform duration-500 ease-edit group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      )}
    </Link>
  );
}
