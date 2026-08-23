'use client';

import { useId, useRef, useState } from 'react';

import { strokes } from '@/content/method';

/*
  Четыре стиля плавания.

  Каждому стилю соответствует своя траектория гребка — она прочерчивается
  линией и по ней бежит светящаяся точка. Графика векторная и весит доли
  килобайта: тянуть сюда WebGL было бы неоправданно.

  Переключатель собран по образцу вкладок: стрелки влево-вправо переводят
  фокус между стилями, активная вкладка помечена aria-selected, панель
  связана с ней через aria-labelledby.

  Обе анимации сделаны на CSS, поэтому системная настройка «уменьшить
  движение» гасит их вместе со всем остальным движением на сайте.
*/
export function Strokes() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = strokes.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const stroke = strokes[active];

  return (
    <section
      id="strokes"
      aria-labelledby="strokes-title"
      className="bg-surface-alt px-4 py-20 sm:px-6 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Техника
          </p>
          <h2
            id="strokes-title"
            className="text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl md:text-[44px]"
          >
            Четыре стиля, а не один
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-ink-soft">
            Ребёнок осваивает весь спортивный набор. Каждый стиль ставится
            отдельно и в своём порядке — от самого естественного к самому
            силовому.
          </p>
        </div>

        <div className="reveal mt-12" style={{ ['--reveal-delay' as string]: '80ms' }}>
          <div
            role="tablist"
            aria-label="Стили плавания"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2"
          >
            {strokes.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`${uid}-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls={`${uid}-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`min-h-11 rounded-[10px] px-4 text-sm font-medium transition-colors duration-200 ${
                  i === active
                    ? 'bg-abyss-900 text-white'
                    : 'border border-hairline bg-surface text-ink-soft hover:border-aqua-300 hover:text-ink'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${uid}-panel-${stroke.id}`}
            aria-labelledby={`${uid}-tab-${stroke.id}`}
            className="mt-6 grid gap-8 rounded-[20px] border border-hairline bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-aqua-600 uppercase">
                {stroke.short}
              </p>
              <h3 className="mt-4 text-2xl font-light text-ink sm:text-3xl">
                {stroke.name}
              </h3>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {stroke.description}
              </p>

              <p className="mt-7 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
                Что осваивает ребёнок
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {stroke.learns.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1.5 shrink-0 rounded-full bg-aqua-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* траектория гребка: линия прочерчивается, по ней бежит точка */}
            <div className="relative overflow-hidden rounded-[16px] bg-abyss-900 p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand-600/25 via-transparent to-aqua-500/20"
              />
              <svg
                key={stroke.id}
                viewBox="0 0 200 100"
                className="relative w-full"
                role="img"
                aria-label={`Схема траектории гребка: ${stroke.name}`}
              >
                {/* линия воды для масштаба */}
                <line
                  x1="0"
                  y1="50"
                  x2="200"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                  className="text-white/20"
                />
                <path
                  d={stroke.path}
                  fill="none"
                  stroke="var(--color-aqua-400)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 1,
                    animation: 'stroke-draw 1.8s var(--ease-out-soft) forwards',
                  }}
                />
                <circle
                  r="3.6"
                  fill="var(--color-aqua-100)"
                  style={{
                    offsetPath: `path("${stroke.path}")`,
                    offsetRotate: '0deg',
                    animation:
                      'stroke-travel 3.2s var(--ease-out-soft) 1.4s infinite',
                  }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stroke-draw { to { stroke-dashoffset: 0; } }
        @keyframes stroke-travel {
          0%   { offset-distance: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
