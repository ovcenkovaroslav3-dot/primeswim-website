import { Section, SectionHeading } from '../ui';
import { programs, advantages } from '@/content/programs';

export function Programs() {
  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface">
      <SectionHeading
        id="programs-title"
        eyebrow="Направления"
        title="Чему учим в бассейне"
        lead="Ребёнок попадает в группу по возрасту и уровню подготовки, поэтому программа подходит и новичку, и тому, кто уже плавает."
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {programs.map((program) => (
          <li
            key={program.id}
            className="flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-7"
          >
            <h3 className="text-xl font-light text-ink">
              {program.title}
            </h3>
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
              {program.description}
            </p>
            <p className="mt-5 border-t border-hairline pt-4 text-sm font-medium text-brand-600">
              {program.audience}
            </p>
          </li>
        ))}
      </ul>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {advantages.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-hairline bg-surface-alt p-6"
          >
            <h3 className="text-base font-medium text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
