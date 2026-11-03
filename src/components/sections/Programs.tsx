import { ProgramBookButton } from '../ProgramBookButton';
import { ArrowLink, Section } from '../ui';
import { programs } from '@/content/programs';

export function Programs() {
  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface-alt">
      <div className="grid gap-5 md:grid-cols-2 md:items-end md:gap-12">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">Цели</p>
          <h2 id="programs-title" className="mt-4 max-w-xl text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl md:text-[44px]">Три цели, с которыми к нам приходят</h2>
        </div>
        <p className="max-w-lg leading-relaxed text-ink-soft">Обучение плаванию детей с нуля и спортивная секция в одной школе: ребёнок попадает в группу по возрасту и уровню подготовки.</p>
      </div>

      <ul className="mt-10">
        {programs.map((program, i) => (
          <li
            key={program.id}
            className={`reveal grid min-w-0 gap-6 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_auto] lg:gap-10 ${
              i === 0 ? 'rounded-card bg-abyss-900 text-white' : 'border-b border-hairline text-ink'
            }`}
            style={{ ['--reveal-delay' as string]: `${i * 80}ms` }}
          >
            <div className="min-w-0">
              <span aria-hidden="true" className={`text-3xl leading-none font-light tabular-nums ${i === 0 ? 'text-white/60' : 'text-ink-muted'}`}>0{i + 1}</span>
              <p className={`mt-5 text-sm font-medium ${i === 0 ? 'text-lime-300' : 'text-brand-600 dark:text-brand-200'}`}>
                {program.audience}
              </p>
              <h3 className="mt-3 text-2xl leading-tight font-normal lg:text-[28px]">{program.title}</h3>
            </div>
            <div className="min-w-0">
              <p className={`leading-relaxed ${i === 0 ? 'text-white/75' : 'text-ink-soft'}`}>
                {program.description}
              </p>
              {program.steps ? (
                <ol className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                  {program.steps.map((step, index) => (
                    <li key={step} className="flex min-w-0 gap-3 text-sm leading-relaxed">
                      <span aria-hidden="true" className="w-4 shrink-0 text-white/60">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              ) : null}
              {program.points ? (
                <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                  {program.points.map((point) => (
                    <li key={point} className="flex min-w-0 gap-3 text-sm leading-relaxed">
                      <span aria-hidden="true" className="w-4 shrink-0 text-ink-muted">—</span>
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="-mt-6 flex min-w-0 flex-col items-start lg:mt-0 lg:items-end">
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
