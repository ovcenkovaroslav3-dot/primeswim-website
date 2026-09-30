import { stages } from "@/content/method";
import { OrcaMark } from "../OrcaMark";

/*
  Чему научится ребёнок.

  Четыре ступени на одной линии: уверенность → техника → скорость → результат.
  Линия горизонтальная на широком экране и вертикальная на телефоне — так
  порядок читается одинаково в обоих направлениях чтения.

  Нумерация здесь не украшение: ступени действительно идут строго по порядку,
  и пропустить любую из них нельзя.

  Секция называется «прогресс», но сама линия раньше ничего не прогрессировала —
  просто гасла градиентом. Теперь под ней тусклый трек на всю длину, а поверх
  растёт заливка: `.progress-fill` в globals.css привязана к прокрутке самой
  линии через `animation-timeline: view()`, тем же нативным приёмом, что и
  `.parallax`. Ни JavaScript, ни requestAnimationFrame не нужны; там, где
  animation-timeline не поддержан, заливка остаётся видна на всю длину —
  деградация молчаливая, как и у параллакса.
*/
export function Progress() {
  return (
    <section
      id="progress"
      aria-labelledby="progress-title"
      className="on-dark relative overflow-clip bg-abyss-900 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28"
    >
      {/*
        Знак идёт вверх вместе со ступенями.

        Раздел про то, как ребёнок растёт от первого вдоха до стартовой
        тумбы, и знак повторяет это направление: снизу-слева вверх-направо,
        тем же наклоном, что и на первом экране. Плоский силуэт, а не
        объёмный талисман, — объёмный на сайте появляется ровно один раз,
        на первом экране, и повтор отнял бы у него вес. Правило записано
        в DESIGN.md: рендер для присутствия, вектор для знаков.

        ПРОЗРАЧНОСТЬ ЗДЕСЬ МЕНЬШЕ, ЧЕМ НА СОРЕВНОВАНИЯХ, И ЭТО НЕ ОПЕЧАТКА.
        Там 3,5% на abyss-950, здесь 2% на abyss-900 — фон светлее, да ещё
        подсвечен двумя пятнами, и та же величина давала отчётливую серую
        фигуру, спорившую с заголовком. Число подбирается по снимку каждый
        раз заново, переносить его между секциями нельзя.
      */}
      <OrcaMark
        tone="white"
        tilt={-16}
        className="pointer-events-none absolute top-6 right-4 w-[56%] opacity-[0.02] sm:w-[44%] lg:w-[34%]"
      />

      {/* свет в глубине: два мягких пятна вместо плоской заливки */}
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-40 left-1/4 size-[32rem] rounded-full bg-brand-500/20 blur-3xl"
        style={{
          ["--parallax-from" as string]: "14%",
          ["--parallax-to" as string]: "-14%",
        }}
      />
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -right-20 -bottom-40 size-[28rem] rounded-full bg-brand-300/14 blur-3xl"
        style={{
          ["--parallax-from" as string]: "-10%",
          ["--parallax-to" as string]: "10%",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            Путь ребёнка
          </p>
          <h2
            id="progress-title"
            className="text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl md:text-[44px]"
          >
            От первого вдоха в воду до стартовой тумбы
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-white/70">
            Ступени идут строго по порядку. Ни одну нельзя пропустить: скорость
            без техники превращается в барахтанье, а техника без уверенности не
            появляется вовсе.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* трек: тусклая линия на всю длину, вертикальная на телефоне,
              горизонтальная на широком экране */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 bottom-2 left-[7px] w-px bg-lime-400/15 md:top-[7px] md:right-2 md:bottom-auto md:left-2 md:h-px md:w-auto"
          />
          {/*
            Прайми едет остриём залитой линии.

            Раздел про то, как ребёнок проходит путь от первого вдоха до
            стартовой тумбы, и знак идёт этот путь вместе с ним: не украшение
            сбоку, а само остриё того, что растёт при прокрутке. Шкала у неё
            та же, что у заливки, поэтому разъехаться они не могут.

            ПОЧЕМУ ОБЁРТКА ВО ВСЮ ДЛИНУ ТРЕКА. Проценты в translate считаются
            от размера самого элемента, а не родителя, и сдвинуть точку «на
            всю длину линии» напрямую нечем — длина резиновая. Обёртка
            повторяет геометрию трека, знак приколот к её началу, и сдвиг на
            100% своей высоты переносит его ровно в конец пути.

            Плоский силуэт, а не объёмный талисман: объёмный появляется на
            сайте один раз, на первом экране, и повтор отнял бы у него вес
            (правило в DESIGN.md — рендер для присутствия, вектор для знаков).
            Лаймовый, потому что он и есть продолжение лаймовой линии.

            Где animation-timeline не поддержан, заливка остаётся видна на всю
            длину — знак по умолчанию стоит в конце, то есть на её конце.
            Деградация такая же молчаливая.
          */}
          <div
            aria-hidden="true"
            className="progress-swimmer pointer-events-none absolute top-2 bottom-2 left-[7px] w-px md:top-[7px] md:right-2 md:bottom-auto md:left-2 md:h-px md:w-auto"
          >
            <OrcaMark
              tone="currentColor"
              className="absolute top-0 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 rotate-90 text-lime-300 md:top-1/2 md:left-0 md:w-7 md:rotate-0"
            />
          </div>

          {/* заливка поверх трека: растёт от начала к концу по мере прокрутки */}
          <div
            aria-hidden="true"
            className="progress-fill pointer-events-none absolute top-2 bottom-2 left-[7px] w-px origin-top bg-linear-to-b from-lime-400 to-lime-300/60 md:top-[7px] md:right-2 md:bottom-auto md:left-2 md:h-px md:w-auto md:origin-left md:bg-linear-to-r"
          />

          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className="reveal relative pl-9 md:pt-10 md:pl-0"
              style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full bg-abyss-900 ring-2 ring-lime-400 md:top-0 md:left-0"
              >
                <span className="size-[5px] rounded-full bg-lime-300" />
              </span>

              <p className="text-xs font-medium tracking-[0.2em] text-lime-300/80 tabular-nums">
                {stage.step}
              </p>
              <h3 className="mt-3 text-xl font-light text-white">
                {stage.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
