import { ProgramBookButton } from '../ProgramBookButton';
import { ArrowLink, Section, SectionHeading } from '../ui';
import { programs } from '@/content/programs';

export function Programs() {
  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface-alt">
      <SectionHeading
        id="programs-title"
        eyebrow="Цели"
        title="Три цели, с которыми к нам приходят"
        lead="Обучение плаванию детей с нуля и спортивная секция в одной школе: ребёнок попадает в группу по возрасту и уровню подготовки."
      />

      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {programs.map((program, i) => (
          <li
            key={program.id}
            className={`reveal flex flex-col rounded-card p-6 sm:p-8 ${
              i === 0 ? 'bg-abyss-900 text-white' : 'border border-hairline bg-surface text-ink'
            }`}
            style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
          >
            <p className={`text-sm font-medium ${i === 0 ? 'text-lime-300' : 'text-brand-600 dark:text-brand-200'}`}>
              {program.audience}
            </p>
            <h3 className="mt-4 text-2xl leading-tight font-normal">{program.title}</h3>
            <p className={`mt-4 leading-relaxed ${i === 0 ? 'text-white/75' : 'text-ink-soft'}`}>
              {program.description}
            </p>
            {program.steps ? (
              <ol className="mt-5 space-y-2">
                {program.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span aria-hidden="true" className="w-4 shrink-0 text-white/60">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}
            {program.points ? (
              <ul className="mt-5 space-y-2">
                {program.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed">
                    <span aria-hidden="true" className="w-4 shrink-0 text-ink-muted">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-auto flex flex-col items-start pt-1">
              <ProgramBookButton id={program.id} title={program.title} />
              {program.href ? (
                <ArrowLink href={program.href} className="mt-4">Старты, сборы и разряды</ArrowLink>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
