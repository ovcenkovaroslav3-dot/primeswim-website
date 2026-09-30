import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'md' | 'lg';

const base =
  'lift inline-flex items-center justify-center gap-2 rounded-lg text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  /*
    Главное действие — фирменный лайм. Он одинаково заметен и на белом, и на
    фиолетовой толще, поэтому кнопка везде одна и та же. Тень под ней взята
    фиолетовой, а не лаймовой: лаймовая по белому расплывалась зеленоватым
    пятном.
  */
  primary:
    'bg-lime-400 text-abyss-950 hover:bg-lime-300 shadow-[0_14px_40px_-16px_var(--color-brand-400)]',
  // для действия поверх насыщенной заливки — белая плашка
  secondary: 'bg-white text-abyss-900 hover:bg-lime-100',
  // второстепенное действие на светлой секции
  ghost:
    'border border-hairline bg-transparent text-ink-soft hover:bg-surface-alt',
  // то же самое на тёмной: кромка из белого, а не из hairline, иначе не видна
  outline:
    'border border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10',
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
      className={`px-4 py-14 sm:px-6 sm:py-16 md:py-28 ${className}`.trim()}
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
  as: Heading = 'h2',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  size?: 'base' | 'statement';
  /*
    Уровень заголовка. На главной секция — одна из многих, и это h2. Но та
    же секция бывает единственной на собственной странице: тогда её
    заголовок и есть заголовок страницы, то есть h1. Выносить сверху
    отдельный h1 нельзя — на экране получилось бы два одинаковых
    заголовка подряд.
  */
  as?: 'h1' | 'h2';
}) {
  /*
    ВЕС 400, А НЕ 200, И ЭТО ИСПРАВЛЕНИЕ НЕДОДЕЛКИ, А НЕ НОВЫЙ ВКУС.

    Волосяные заголовки пришли от прежнего ориентира, Aqua Voice: его
    центральный тезис — «авторитет берётся сдержанностью, а не весом»,
    weight 200 в заголовках. 10 сентября 2026 владелец отклонил половину
    тезиса: заголовок первого экрана остался Unbounded extrabold, школе
    нужен голос громче. Ориентир 13 сентября сменили на WHOOP. А заголовки
    секций так и остались от Aqua Voice — их никто не пересматривал.

    Получался раскол: h1 в 800 кричит, следом девять h2 в 200 шепчут, между
    ними ничего. У нового ориентира display набран весом 400 при body 400,
    то есть иерархия строится размером, а не тонкостью. К нему и приведено.

    Числа волосяными остались намеренно — «13 лет», «850 ₽», «45 мин». Это
    другой приём: крупная тонкая цифра рядом с плотной подписью читается как
    величина, а не как заголовок, и с h2 не конкурирует.

    Цена замерена: страница подросла на 47 px из 9210 — на десктопе на две
    строки разъезжается один заголовок из восьми, «Три цели, с которыми к
    нам приходят». 300 и 400 по вёрстке не отличаются вовсе, разница между
    ними только на глаз, и на тёмных секциях 400 выигрывает заметно.
  */
  const alignment = align === 'center' ? 'text-center mx-auto' : '';

  return (
    // появление задано здесь, чтобы не повторять класс в каждой секции
    <div className={`reveal max-w-3xl ${alignment}`.trim()}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={
          size === 'statement'
            ? 'text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] font-normal tracking-[-0.02em] text-ink'
            : 'text-3xl leading-[1.08] font-normal tracking-[-0.02em] text-ink sm:text-4xl md:text-[44px]'
        }
      >
        {title}
      </Heading>
      {lead ? (
        <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-ink-soft">{lead}</p>
      ) : null}
    </div>
  );
}

/*
  Стрелка «читать дальше».

  Один компонент вместо семи копий. Раньше каждая секция несла свой
  инлайновый SVG и свой набор классов — разметка совпадала дословно, а
  отступы расходились, и по странице гуляла высота ссылки.

  ГЛАВНОЕ ЗДЕСЬ — ВЫСОТА. Все эти ссылки были ростом 28 px: на телефоне это
  вдвое меньше подушечки пальца, и промах по «Всё расписание» или
  «О тренере» уводил человека не туда. Теперь min-h-11 — те же 44 px, что
  у кнопок, ниже этого на сайте не опускается ни одна зона нажатия.

  Отрицательный внешний отступ возвращает набранный рост обратно в вёрстку:
  нажимать стало удобнее, а ритм абзацев остался прежним.
*/
export function ArrowLink({
  href,
  children,
  tone = 'brand',
  external = false,
  className = '',
  ...rest
}: {
  href: string;
  children: ReactNode;
  /** brand — на светлой секции, white — на тёмной. */
  tone?: 'brand' | 'white';
  external?: boolean;
  className?: string;
} & Omit<ComponentProps<'a'>, 'href' | 'children'>) {
  const classes = [
    'lift group -my-2 inline-flex min-h-11 items-center gap-2 py-2 text-sm font-medium',
    tone === 'white' ? 'text-white' : 'text-brand-600',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {children}
      <svg
        width="15"
        height="15"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      >
        <path
          d="M3 9h12M10 4l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
