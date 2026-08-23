import { CoachPortrait } from "../CoachPortrait";
import { coaches } from "@/content/coaches";

/*
  Тренер.

  Раньше это была светлая карточка внутри светлой секции — присутствия
  никакого, а тринадцать лет опыта были утоплены в предложении. Теперь
  секция тёмная, опыт вынесен крупной цифрой: для родителя это первый
  аргумент доверия, и он должен читаться раньше текста.

  Направления работы идут списком в две колонки, а не облаком плашек:
  шесть пилюль подряд выглядели как набор тегов, а не как компетенции.

  Раскладка рассчитана на одного тренера и на нескольких: при добавлении
  второго карточки просто встанут друг под другом.
*/
export function Coaches() {
  return (
    <section
      id="trainers"
      aria-labelledby="trainers-title"
      className="on-dark relative overflow-clip bg-abyss-900 px-4 py-20 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 right-0 size-[30rem] rounded-full bg-aqua-600/18 blur-3xl"
        style={{
          ["--parallax-from" as string]: "16%",
          ["--parallax-to" as string]: "-16%",
        }}
      />
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -bottom-40 -left-24 size-[26rem] rounded-full bg-brand-600/25 blur-3xl"
        style={{
          ["--parallax-from" as string]: "-12%",
          ["--parallax-to" as string]: "12%",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-aqua-300 uppercase">
            Тренер
          </p>
          <h2
            id="trainers-title"
            className="text-3xl leading-[1.08] font-extralight sm:text-4xl md:text-[44px]"
          >
            Кто ведёт занятия
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-16">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="reveal grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14"
            >
              <div className="max-w-[300px]">
                {/* фотографии пока нет: передадим photo, когда пройдёт съёмка */}
                <CoachPortrait name={coach.name} />
              </div>

              <div>
                {/* выравнивание по низу: у многострочной подписи базовая линия
                    берётся от первой строки, и подпись цеплялась за верх цифры */}
                <p className="flex items-end gap-4">
                  <span className="text-6xl leading-none font-extralight tabular-nums text-aqua-300 sm:text-7xl">
                    {coach.yearsExperience}
                  </span>
                  <span className="mb-2 max-w-[13ch] text-sm leading-snug text-white/60">
                    лет тренерской работы
                  </span>
                </p>

                <h3 className="mt-8 text-2xl font-light sm:text-3xl">
                  {coach.name}
                </h3>
                <p className="mt-2 text-aqua-300">{coach.role}</p>

                {coach.bio.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 max-w-[62ch] leading-relaxed text-white/70"
                  >
                    {paragraph}
                  </p>
                ))}

                <p className="mt-9 text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
                  Направления работы
                </p>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {coach.specialities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-t border-white/12 pt-3 text-sm text-white/75"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-aqua-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
