import { ProgramBookButton } from '../ProgramBookButton';
import { ArrowIcon, ArrowLink, Section } from '../ui';
import { programs } from '@/content/programs';
import { Picture } from '../Picture';
import { coachIntroVideo } from '@/content/media';
import Link from 'next/link';

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

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
        <a href="#podbor" className="press inline-flex min-h-11 items-center gap-2 rounded-control border border-brand-500 px-4 font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-brand-900/40">
          Подобрать по возрасту и уровню
          <ArrowIcon />
        </a>

        <div className="flex min-w-0 items-center gap-4 rounded-inset border border-hairline bg-surface p-3">
          <Picture
            src={coachIntroVideo.poster}
            alt={coachIntroVideo.alt}
            width={coachIntroVideo.width}
            height={coachIntroVideo.height}
            sizes="80px"
            className="h-24 w-20 rounded-inset object-cover object-[50%_76%]"
          />
          <div className="min-w-0">
            <p className="text-sm text-ink-muted">Ваш тренер</p>
            <p className="font-medium text-ink">Ярослав Сергеевич Овченков</p>
            <Link href="/blog/pervoe-zanyatie-po-plavaniyu-cheklist/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-200">
              <span className="link-draw underline-offset-4">Как проходит пробное</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
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
                /* 26 ноября 2026: на телефоне списки шагов и пунктов скрыты. Они
                   делали секцию самой длинной на главной (вся главная — около
                   16 500 px на мобильном); полные списки живут на страницах
                   направлений, куда ведёт «Подробнее о направлении».
                   Описание и кнопки остались. */
                <ol className="mt-5 hidden gap-x-5 gap-y-2 md:grid md:grid-cols-2">
                  {program.steps.map((step, index) => (
                    <li key={step} className="flex min-w-0 gap-3 text-sm leading-relaxed">
                      <span aria-hidden="true" className="w-4 shrink-0 text-white/60">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              ) : null}
              {program.points ? (
                <ul className="mt-5 hidden gap-x-5 gap-y-2 md:grid md:grid-cols-2">
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
                <ArrowLink href={program.href} tone={i === 0 ? 'white' : 'brand'} className="mt-4" aria-label={`Подробнее о направлении: ${program.title}`}>Подробнее о направлении</ArrowLink>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
