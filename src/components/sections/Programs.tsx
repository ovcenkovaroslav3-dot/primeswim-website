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
            className="flex flex-col rounded-2xl border border-hairline bg-surface-alt p-7"
          >
            <h3 className="font-display text-xl font-bold text-ink">
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
            className="rounded-2xl bg-brand-600 p-6 text-white"
          >
            <h3 className="font-display text-base font-bold text-lime-brand">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
