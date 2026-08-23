import { competitionPillars } from "@/content/journey";

/*
  Соревнования и развитие.

  Три опоры — это не равнозначный набор, а лестница: сначала первый старт,
  потом сборы, потом разряды. Раньше они стояли одинаковыми коробками в ряд
  и эту последовательность скрывали.

  Теперь карточки поднимаются ступенями, у каждой свой номер и полоса
  заполнения. Ступени видно и на телефоне: там раскладка вертикальная,
  и подъём передаёт полоса, а не отступ.

  Эмоциональный блок без фотографий: работают крупная типографика, глубина
  и структура. Тёмная секция задаёт паузу между светлыми.
*/
export function Competitions() {
  return (
    <section
      id="competitions"
      aria-labelledby="competitions-title"
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-20 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-600/25 blur-3xl"
        style={{
          ["--parallax-from" as string]: "-12%",
          ["--parallax-to" as string]: "12%",
        }}
      />
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -right-28 bottom-0 size-[26rem] rounded-full bg-aqua-600/20 blur-3xl"
        style={{
          ["--parallax-from" as string]: "16%",
          ["--parallax-to" as string]: "-16%",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <div className="reveal">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-aqua-300 uppercase">
              Спорт
            </p>
            <h2
              id="competitions-title"
              className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] font-extralight"
            >
              Дальше — не просто
              <br />
              <span className="text-aqua-300">умение плавать</span>
            </h2>
          </div>

          <p
            className="reveal max-w-[52ch] leading-relaxed text-white/70"
            style={{ ["--reveal-delay" as string]: "100ms" }}
          >
            Не каждому ребёнку нужен спортивный путь, и мы никого туда не
            толкаем. Но если появляется интерес и получается — школа умеет вести
            дальше: к стартам, сборам и разрядам.
          </p>
        </div>

        <ol className="mt-16 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {competitionPillars.map((p, i) => (
            <li
              key={p.id}
              className="reveal glass flex flex-col rounded-[20px] p-7 sm:p-8"
              style={{
                ["--reveal-delay" as string]: `${i * 100}ms`,
                // ступени: каждая следующая опора выше предыдущей
                marginTop: `calc(var(--step, 0px) * ${2 - i})`,
              }}
            >
              <span className="text-sm font-medium tabular-nums text-aqua-300">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-4 text-xl font-light text-white">{p.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">
                {p.description}
              </p>

              {/* полоса заполнения: показывает, какая это ступень из трёх */}
              <span aria-hidden="true" className="mt-7 flex gap-1.5">
                {[0, 1, 2].map((seg) => (
                  <span
                    key={seg}
                    className={`h-0.5 flex-1 rounded-full ${
                      seg <= i ? "bg-aqua-400" : "bg-white/15"
                    }`}
                  />
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/*
        Величина ступени задаётся переменной и включается только там, где
        карточки стоят в ряд: на телефоне вертикальный отступ сверху выглядел
        бы просто дырой между блоками.
      */}
      <style>{`
        @media (min-width: 640px) { #competitions ol { --step: 28px; } }
      `}</style>
    </section>
  );
}
