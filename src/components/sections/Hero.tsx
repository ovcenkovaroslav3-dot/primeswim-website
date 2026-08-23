import Link from 'next/link';

import { WaterScene } from '../WaterScene';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';

/*
  Первый экран.

  Фон — абстрактная толща воды на WebGL: глубина, световые шахты, каустика,
  пузырьки. Никаких фотографий, поэтому экран одинаково хорош до и после
  фотосессии, а вес страницы не растёт.

  Текст проявляется из-под масок с нарастающей задержкой. Разметка при этом
  остаётся обычной: без JavaScript классы `.reveal-mask` не активируются,
  и содержимое просто видно — экран не пустеет.
*/

const facts = [
  { value: '25 м', label: 'дорожка' },
  { value: '6', label: 'дорожек' },
  { value: '45 мин', label: 'занятие' },
  { value: 'до 12', label: 'человек в группе' },
];

export function Hero() {
  return (
    <section className="on-dark relative isolate min-h-[100svh] overflow-hidden bg-abyss-950 text-white">
      <div className="absolute inset-0 -z-10">
        <WaterScene />
      </div>

      {/* ширма под текстом: слева плотнее, вправо открывает сцену */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-abyss-950/85 via-abyss-950/45 to-abyss-950/80 md:bg-linear-to-r md:from-abyss-950/92 md:via-abyss-950/35 md:to-transparent"
      />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pt-26 pb-20 sm:px-6 md:pt-28 md:pb-24">
        <p
          className="reveal text-xs font-medium tracking-[0.28em] text-aqua-300 uppercase"
          style={{ ['--reveal-delay' as string]: '80ms' }}
        >
          {site.hero.kicker}
        </p>

        <h1 className="mt-6 font-display leading-[0.86] font-extrabold tracking-[-0.03em]">
          <span className="sr-only">
            {site.hero.wordmark.join(' ')} — {site.hero.kicker}
          </span>
          {site.hero.wordmark.map((word, i) => (
            <span
              key={word}
              aria-hidden="true"
              className="reveal-mask block"
              style={{ ['--reveal-delay' as string]: `${160 + i * 110}ms` }}
            >
              <span
                className={
                  i === 0
                    ? 'block text-[clamp(3.2rem,15vw,10.5rem)] text-white'
                    : 'block text-[clamp(3.2rem,15vw,10.5rem)] text-aqua-300'
                }
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="reveal mt-8 max-w-[34ch] text-lg leading-relaxed text-white/75 sm:text-xl"
          style={{ ['--reveal-delay' as string]: '420ms' }}
        >
          {site.hero.offer}
        </p>

        <div
          className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ ['--reveal-delay' as string]: '540ms' }}
        >
          <Link
            href="#booking"
            data-goal="cta_booking"
            className="glow-aqua inline-flex min-h-13 items-center justify-center rounded-[10px] bg-aqua-400 px-7 text-[15px] font-semibold text-abyss-950 transition-colors duration-200 hover:bg-aqua-300"
          >
            {site.cta.primary}
          </Link>
          <Link
            href="#programs"
            data-goal="cta_schedule"
            className="inline-flex min-h-13 items-center justify-center rounded-[10px] border border-white/25 px-7 text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
          >
            Посмотреть программу
          </Link>
        </div>

        <dl
          className="reveal glass mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 rounded-[20px] p-6 sm:grid-cols-4 sm:gap-x-4"
          style={{ ['--reveal-delay' as string]: '660ms' }}
        >
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs leading-snug text-white/55">
                {f.label}
              </dt>
              <dd className="order-1 text-2xl font-light tabular-nums text-white">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <p
          className="reveal mt-8 text-sm text-white/45"
          style={{ ['--reveal-delay' as string]: '760ms' }}
        >
          {contacts.address.short}
        </p>
      </div>

      {/* переход в следующую секцию: сцена растворяется в светлом фоне */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-surface"
      />
    </section>
  );
}
