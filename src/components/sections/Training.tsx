'use client';

import { useEffect, useRef, useState } from 'react';

import { trainingSteps } from '@/content/training';

/*
  Как проходит занятие — рассказ, разворачивающийся при прокрутке.

  На широком экране левая колонка залипает: в ней крупный номер текущего
  шага, его название и полоса распределения времени внутри занятия. Правая
  колонка прокручивается, и наблюдатель пересечений переключает активный шаг.

  На телефоне залипание отключено — там это обычный вертикальный список,
  потому что две колонки на 375 px превращаются в мельтешение.

  Полоса времени не декоративная: ширина каждого сегмента равна доле шага
  в занятии, поэтому видно, что основная серия занимает четверть, а не
  «примерно столько же, сколько разминка».
*/
export function Training() {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        // берём самый верхний из видимых — иначе активный шаг «прыгает»
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const i = itemsRef.current.indexOf(visible.target as HTMLLIElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    itemsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = trainingSteps[active];

  return (
    <section
      id="training"
      aria-labelledby="training-title"
      className="bg-surface px-4 py-20 sm:px-6 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Тренировочный процесс
          </p>
          <h2
            id="training-title"
            className="text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl md:text-[44px]"
          >
            Что происходит в эти 45 минут
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-ink-soft">
            Занятие устроено как последовательность, а не как свободное
            плавание. Каждая часть решает свою задачу и готовит следующую.
          </p>
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* залипающая панель: только на широком экране */}
          <div className="hidden lg:sticky lg:top-28 lg:block lg:h-fit">
            <div className="relative overflow-hidden rounded-[20px] bg-abyss-900 p-8 text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-aqua-500/25 blur-3xl"
              />
              <div className="relative">
                <p className="font-display text-6xl leading-none font-extralight tabular-nums text-aqua-300">
                  {current.step}
                </p>
                <h3 className="mt-5 text-2xl font-light">{current.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  {current.description}
                </p>

                <p className="mt-8 text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
                  Доля занятия
                </p>
                <div
                  className="mt-3 flex h-2 gap-1 overflow-hidden rounded-full"
                  role="img"
                  aria-label={`Шаг ${active + 1} из ${trainingSteps.length}: ${current.title}, около ${current.share}% занятия`}
                >
                  {trainingSteps.map((s, i) => (
                    <span
                      key={s.id}
                      style={{ flexGrow: s.share }}
                      className={`h-full rounded-full transition-colors duration-300 ${
                        i === active ? 'bg-aqua-400' : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ol className="space-y-4">
            {trainingSteps.map((s, i) => (
              <li
                key={s.id}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className={`reveal rounded-[20px] border p-6 transition-colors duration-300 sm:p-7 ${
                  i === active
                    ? 'border-aqua-300 bg-surface-alt'
                    : 'border-hairline bg-surface'
                }`}
                style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`font-display text-sm tabular-nums transition-colors duration-300 ${
                      i === active ? 'text-aqua-600' : 'text-ink-muted'
                    }`}
                  >
                    {s.step}
                  </span>
                  <h3 className="text-lg font-medium text-ink sm:text-xl">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-ink-soft">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
