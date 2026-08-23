import { Section, SectionHeading } from '../ui';
import { startingPoints, firstLesson } from '@/content/journey';

/*
  Для родителей.

  Здесь снимаются сомнения на входе, а не даются операционные ответы —
  для них есть раздел вопросов ниже. Родитель должен узнать свой случай
  среди четырёх и увидеть, что путь есть при любом уровне ребёнка.

  Ниже — что происходит на первом визите. Порядок здесь настоящий,
  поэтому шаги пронумерованы.
*/
export function Parents() {
  return (
    <Section id="parents" labelledBy="parents-title" className="bg-surface">
      <div className="reveal">
        <SectionHeading
          id="parents-title"
          eyebrow="Родителям"
          title="С каким уровнем можно приходить"
          lead="Практически с любым. Разница только в том, с чего начнётся работа."
        />
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2">
        {startingPoints.map((p, i) => (
          <li
            key={p.id}
            className="reveal rounded-[20px] border border-hairline bg-surface-alt p-7"
            style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
          >
            <h3 className="flex items-start gap-3 text-lg font-medium text-ink">
              <span
                aria-hidden="true"
                className="mt-2 size-2 shrink-0 rounded-full bg-aqua-500"
              />
              {p.situation}
            </h3>
            <p className="mt-3 pl-5 text-sm leading-relaxed text-ink-soft">
              {p.answer}
            </p>
          </li>
        ))}
      </ul>

      <div className="reveal mt-16 rounded-[20px] bg-abyss-900 p-8 text-white sm:p-10">
        <h3 className="text-xl font-light sm:text-2xl">
          Как проходит первое занятие
        </h3>

        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {firstLesson.map((s, i) => (
            <li key={s.id} className="border-t border-white/15 pt-5">
              <p className="font-display text-xs tracking-[0.2em] text-aqua-300/80 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h4 className="mt-3 font-medium text-white">{s.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
