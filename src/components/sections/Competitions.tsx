import { OrcaMark } from "../OrcaMark";
import { VideoCard } from "../VideoCard";
import { competitionPillars } from "@/content/journey";
import { startsDrillVideo } from "@/content/media";
import Link from "next/link";

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
export function Competitions({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' } = {}) {
  const Heading = headingAs;
  // заголовок ступени на своей странице идёт сразу за h1 — без промежуточного h2 это был бы пропуск уровня
  const PillarHeading = headingAs === 'h1' ? 'h2' : 'h3';

  return (
    <section
      id="competitions"
      aria-labelledby="competitions-title"
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-500/28 blur-3xl"
        style={{
          ["--parallax-from" as string]: "-12%",
          ["--parallax-to" as string]: "12%",
        }}
      />
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -right-28 bottom-0 size-[26rem] rounded-full bg-brand-300/16 blur-3xl"
        style={{
          ["--parallax-from" as string]: "16%",
          ["--parallax-to" as string]: "-16%",
        }}
      />

      {/*
        Фирменный знак. Единственная страница, кроме главной, где он появляется
        крупно, и выбрана она не случайно: тут речь про старты, сборы и
        разряды — то есть ровно про то, что косатка и обозначает. Ставить её
        на каждой странице нельзя, знак теряет вес от повтора (правило — в
        DESIGN.md).

        Идёт вверх-вправо, в ту же сторону, что и ступени карточек ниже.

        ДВЕ ВЕЛИЧИНЫ ЗДЕСЬ ПОДОБРАНЫ ПО СНИМКУ, А НЕ НА ГЛАЗ. Первая проба
        стояла на 6 % и вылезала за правый край: фон секции — abyss-950,
        самый тёмный на сайте, и белое пятно на нём читается заметно сильнее,
        чем на первом экране при той же цифре. Получилась крупная серая
        фигура с обрезанной головой, то есть ровно то, чего знак не должен
        делать, — иллюстрация вместо присутствия. Теперь 3,5 % и фигура
        целиком в кадре.
      */}
      <OrcaMark
        tone="white"
        tilt={-16}
        className="pointer-events-none absolute top-2 right-2 w-[68%] opacity-[0.035] sm:w-[52%] lg:top-6 lg:right-6 lg:w-[40%]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <div className="reveal">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Спорт
            </p>
            <Heading
              id="competitions-title"
              className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] font-normal tracking-[-0.02em]"
            >
              Спортивное плавание,
              <br />
              <span className="font-normal">соревнования и разряды</span>
            </Heading>
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

        <div className="mt-10 grid gap-4 rounded-card border border-white/15 bg-white/5 p-5 min-[370px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-x-7 sm:p-7">
          <PillarHeading className="text-2xl leading-tight font-medium text-white min-[370px]:col-span-2">
            Готов ли ребёнок к первому старту?
          </PillarHeading>
          <figure className="w-full max-w-[180px] max-[369px]:mx-auto">
            <VideoCard
              goal="play_video"
              src={startsDrillVideo.src}
              poster={startsDrillVideo.poster}
              label={startsDrillVideo.alt}
              width={startsDrillVideo.width}
              height={startsDrillVideo.height}
            />
            <figcaption className="mt-2 text-xs leading-normal text-white/75">Старт с тумбы на тренировке</figcaption>
          </figure>
          <div className="max-w-[54ch] self-center text-sm leading-relaxed text-white/85 sm:text-base">
            <p>Обсудите с тренером, посильна ли ребёнку дистанция и освоил ли он старт, повороты и финиш.</p>
            <p className="mt-3">Важно, чтобы ребёнок понимал правила и сам хотел участвовать. Условия допуска зависят от соревнования.</p>
            <Link href="/blog/razryady-po-plavaniyu-normativy-detej/" className="mt-2 inline-flex min-h-11 items-center font-medium text-lime-300 link-draw underline-offset-4">
              Подробнее о первом старте
            </Link>
          </div>
        </div>

        <ol className="mt-16 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {competitionPillars.map((p, i) => (
            <li
              key={p.id}
              className="reveal glass flex flex-col rounded-card p-7 sm:p-8"
              style={{
                ["--reveal-delay" as string]: `${i * 100}ms`,
                // ступени: каждая следующая опора выше предыдущей
                marginTop: `calc(var(--step, 0px) * ${2 - i})`,
              }}
            >
              <span className="text-sm font-medium tabular-nums text-lime-300">
                {String(i + 1).padStart(2, "0")}
              </span>

              <PillarHeading className="mt-4 text-xl font-light text-white">{p.title}</PillarHeading>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">
                {p.description}
              </p>

              {/* полоса заполнения: показывает, какая это ступень из трёх */}
              <span aria-hidden="true" className="mt-7 flex gap-1.5">
                {[0, 1, 2].map((seg) => (
                  <span
                    key={seg}
                    className={`h-0.5 flex-1 rounded-full ${
                      seg <= i ? "bg-lime-400" : "bg-white/15"
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
