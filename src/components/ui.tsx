import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

const base =
  'lift inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  // главное действие: аква на тёмном и на светлом одинаково заметна
  primary:
    'bg-aqua-400 text-abyss-950 hover:bg-aqua-300 shadow-[0_14px_40px_-16px_var(--color-aqua-500)]',
  // для действия поверх насыщенной заливки — белая плашка
  secondary: 'bg-white text-abyss-900 hover:bg-aqua-100',
  ghost:
    'border border-hairline bg-transparent text-ink-soft hover:bg-surface-alt',
};

const sizes: Record<ButtonSize, string> = {
  // min-h держит зону нажатия комфортной на телефоне
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-13 px-7 py-3.5 text-base',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra = '',
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  href,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  href: string;
  children: ReactNode;
} & Omit<ComponentProps<'a'>, 'href'>) {
  const classes = buttonClass(variant, size, className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Section({
  id,
  className = '',
  children,
  labelledBy,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`px-4 py-20 sm:px-6 md:py-28 ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/*
  Заголовок секции.

  Два размера, и это не декор. Обычный носят разделы, отвечающие на вопрос
  «как устроено» — расписание, стоимость, вопросы. Крупный оставлен для
  тех, где школа заявляет позицию: их на странице немного, и они задают
  ритм, а не соревнуются друг с другом за внимание.
*/
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  size = 'base',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  size?: 'base' | 'statement';
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : '';

  return (
    // появление задано здесь, чтобы не повторять класс в каждой секции
    <div className={`reveal max-w-3xl ${alignment}`.trim()}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={
          size === 'statement'
            ? 'text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] font-extralight text-ink'
            : 'text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl md:text-[44px]'
        }
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-ink-soft">{lead}</p>
      ) : null}
    </div>
  );
}
