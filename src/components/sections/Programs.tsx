import { Section, SectionHeading } from '../ui';
import { programs } from '@/content/programs';

/*
  Чему учим в бассейне.

  Три одинаковые карточки читались плоско — три пункта меню, а не рассказ.
  Программы на самом деле идут по порядку, от новичка до спортсмена, и
  первая — «с нуля» — самая частая точка входа. Она и занимает крупную
  тёмную плашку, как в секции «Почему мы»; остальные две встают в третью
  колонку светлыми плитками одна над другой.
*/
export function Programs() {
  const [first, ...rest] = programs;

  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface-alt">
      <SectionHeading
        id="programs-title"
        eyebrow="Направления"
        title="Чему учим в бассейне"
        lead="Ребёнок попадает в группу по возрасту и уровню подготовки, поэтому программа подходит и новичку, и тому, кто уже плавает."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        <li
          className="reveal relative overflow-clip rounded-[20px] bg-abyss-900 p-8 text-white sm:col-span-2 lg:row-span-2 lg:p-10"
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
            <p className="mt-auto border-t border-white/15 pt-5 text-sm font-medium text-lime-300">
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
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
              {program.description}
            </p>
            <p className="mt-5 border-t border-hairline pt-4 text-sm font-medium text-brand-600">
              {program.audience}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
