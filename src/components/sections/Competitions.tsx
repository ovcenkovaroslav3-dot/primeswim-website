import { competitionPillars } from '@/content/journey';

/*
  Соревнования и развитие.

  Эмоциональный блок без фотографий: работают крупная типографика, глубина
  и три опоры пути в спорт. Тёмная секция стоит между двумя светлыми и
  задаёт ритм странице.
*/
export function Competitions() {
  return (
    <section
      id="competitions"
      aria-labelledby="competitions-title"
      className="on-dark relative overflow-hidden bg-abyss-950 px-4 py-20 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 size-[26rem] rounded-full bg-aqua-600/20 blur-3xl"
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
            style={{ ['--reveal-delay' as string]: '100ms' }}
          >
            Не каждому ребёнку нужен спортивный путь, и мы никого туда не
            толкаем. Но если появляется интерес и получается — школа умеет вести
            дальше: к стартам, сборам и разрядам.
          </p>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[20px] bg-white/10 sm:grid-cols-3">
          {competitionPillars.map((p, i) => (
            <li
              key={p.id}
              className="reveal bg-abyss-950 p-7 sm:p-8"
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <h3 className="text-xl font-light text-white">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {p.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
