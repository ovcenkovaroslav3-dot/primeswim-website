import Link from 'next/link';

import { Section, SectionHeading } from '../ui';
import { programs } from '@/content/programs';

/*
  Чему учим в бассейне.

  Три одинаковые карточки читались плоско — три пункта меню, а не рассказ.
  Программы на самом деле идут по порядку, от новичка до спортсмена, и
  первая — «с нуля» — самая частая точка входа. Она и выделена крупной
  тёмной плашкой.

  ГЛАВНАЯ КАРТОЧКА ШИРЕ ОСТАЛЬНЫХ, А НЕ ВЫШЕ. Раньше она занимала две
  колонки и обе строки сетки, и высоту ей задавали две соседние плитки:
  на 1440 карточка выходила 606 px при 177 px содержимого — 349 px, почти
  три пятых, приходились на пустоту между текстом и подписью внизу.
  Выделять размером было верно, брать этот размер высотой — нет. Теперь
  все три стоят в одну строку, а первой отдана лишняя доля ширины.

  ВЫСОТА У КАЖДОЙ СВОЯ (items-start). Выровненные по низу карточки —
  верный приём, когда содержимого в них поровну; здесь не поровну, и
  выравнивание просто переносило пустоту из одной карточки в другие.
  По той же причине с абзацев снят flex-1: он растягивал текст до низа и
  выдавливал хайрлайн с подписью вниз, оставляя дыру посередине. Нижний
  край строки получился ступенчатым, и это честно — карточки правда
  разной длины, а разница читается как вес главной, а не как ошибка.

  Пустоту в главной карточке закрывает не только ширина: четыре шага
  первых занятий лежали в description одной строкой через запятую и
  теперь разложены списком (см. content/programs.ts). Родитель, который
  выбирает «с нуля», спрашивает ровно об этом.
*/
export function Programs() {
  const [first, ...rest] = programs;

  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface-alt">
      <SectionHeading
        id="programs-title"
        eyebrow="Цели"
        title="Три цели, с которыми к нам приходят"
        lead="Ребёнок попадает в группу по возрасту и уровню подготовки, поэтому программа подходит и новичку, и тому, кто уже плавает."
      />

      <ul className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
        <li
          className="reveal relative overflow-clip rounded-[20px] bg-abyss-900 p-8 text-white sm:col-span-2 lg:col-span-1 lg:p-10"
          style={{ ['--reveal-delay' as string]: '60ms' }}
        >
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand-300/18 blur-3xl"
            style={{
              ['--parallax-from' as string]: '10%',
              ['--parallax-to' as string]: '-10%',
            }}
          />
          <div className="relative flex h-full flex-col">
            <h3 className="max-w-[18ch] text-2xl leading-tight font-light sm:text-3xl">
              {first.title}
            </h3>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-white/70">
              {first.description}
            </p>

            {first.steps ? (
              <ol className="mt-6 space-y-3.5">
                {first.steps.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-3.5">
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 text-sm tabular-nums text-white/35"
                    >
                      {i + 1}
                    </span>
                    <span className="text-white/85">{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}

            <p className="mt-8 border-t border-white/15 pt-5 text-sm font-medium text-white">
              {first.audience}
            </p>
          </div>
        </li>

        {rest.map((program, i) => (
          <li
            key={program.id}
            className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface p-7"
            style={{ ['--reveal-delay' as string]: `${140 + i * 80}ms` }}
          >
            <h3 className="text-xl font-light text-ink">{program.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {program.description}
            </p>
            <p className="mt-5 border-t border-hairline pt-4 text-sm font-medium text-brand-600">
              {program.audience}
            </p>

            {program.href ? (
              <Link
                href={program.href}
                prefetch={false}
                className="lift group mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-600"
              >
                Старты, сборы и разряды
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M3 9h12M10 4l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
