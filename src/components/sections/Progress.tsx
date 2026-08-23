import { stages } from "@/content/method";

/*
  Чему научится ребёнок.

  Четыре ступени на одной линии: уверенность → техника → скорость → результат.
  Линия горизонтальная на широком экране и вертикальная на телефоне — так
  порядок читается одинаково в обоих направлениях чтения.

  Нумерация здесь не украшение: ступени действительно идут строго по порядку,
  и пропустить любую из них нельзя.
*/
export function Progress() {
  return (
    <section
      id="progress"
      aria-labelledby="progress-title"
      className="on-dark relative overflow-clip bg-abyss-900 px-4 py-20 text-white sm:px-6 md:py-28"
    >
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
        className="parallax pointer-events-none absolute -right-20 -bottom-40 size-[28rem] rounded-full bg-aqua-500/15 blur-3xl"
        style={{
          ["--parallax-from" as string]: "-10%",
          ["--parallax-to" as string]: "10%",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-aqua-300 uppercase">
            Путь ребёнка
          </p>
          <h2
            id="progress-title"
            className="text-3xl leading-[1.08] font-extralight sm:text-4xl md:text-[44px]"
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
          {/* линия развития: вертикальная на телефоне, горизонтальная на широком экране */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-2 bottom-2 left-[7px] w-px bg-linear-to-b from-aqua-400/70 via-aqua-400/25 to-transparent md:top-[7px] md:right-2 md:bottom-auto md:left-2 md:h-px md:w-auto md:bg-linear-to-r"
          />

          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className="reveal relative pl-9 md:pt-10 md:pl-0"
              style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full bg-abyss-900 ring-2 ring-aqua-400 md:top-0 md:left-0"
              >
                <span className="size-[5px] rounded-full bg-aqua-300" />
              </span>

              <p className="text-xs font-medium tracking-[0.2em] text-aqua-300/80 tabular-nums">
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
