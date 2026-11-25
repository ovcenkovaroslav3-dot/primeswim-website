import Link from 'next/link';

import { ProgramBookButton } from '../ProgramBookButton';
import { ArrowLink, Section, SectionHeading } from '../ui';
import { programs } from '@/content/programs';
import { firstLessonBlock, groupsBlock } from '@/content/program-pages';

/*
  Блоки посадочных страниц направлений («с нуля» и «техника»).

  Текст лежит в content/program-pages.ts, здесь только разметка. Кнопка записи
  та же, что в карточках направлений на главной: она шлёт то же событие и
  цель cta_booking, а форма записи стоит внизу страницы (FinalCta, якорь
  #booking) и подставляет выбранное направление.
*/

function programTitle(id: string): string {
  return programs.find((program) => program.id === id)?.title ?? '';
}

export function ProgramIntro({
  programId,
  h1,
  eyebrow,
  lead,
}: {
  programId: string;
  h1: string;
  eyebrow: string;
  lead: readonly string[];
}) {
  return (
    <Section id="program-intro" labelledBy="program-intro-title" className="bg-surface !pt-2 md:!pt-6">
      <SectionHeading as="h1" id="program-intro-title" eyebrow={eyebrow} title={h1} />
      <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-ink-soft">
        {lead.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-8">
        <ProgramBookButton id={programId} title={programTitle(programId)} />
        <ArrowLink href="/raspisanie/" className="mt-6">Расписание</ArrowLink>
      </div>
    </Section>
  );
}

export function ProgramFirstLesson({ programId, tone = 'surface' }: { programId: string; tone?: 'surface' | 'alt' }) {
  const card = tone === 'alt' ? 'bg-surface' : 'bg-surface-alt';
  return (
    <Section id="first-lesson" labelledBy="first-lesson-title" className={tone === 'alt' ? 'bg-surface-alt' : 'bg-surface'}>
      <SectionHeading id="first-lesson-title" eyebrow="Первое занятие" title={firstLessonBlock.title} lead={firstLessonBlock.lead} />
      <div className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className={`reveal min-w-0 rounded-card border border-hairline ${card} p-6 sm:p-7`}>
          <h3 className="text-lg font-medium text-ink">{firstLessonBlock.bringTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{firstLessonBlock.bring}</p>
        </div>
        <div className={`reveal min-w-0 rounded-card border border-hairline ${card} p-6 sm:p-7`} style={{ ['--reveal-delay' as string]: '70ms' }}>
          <h3 className="text-lg font-medium text-ink">{firstLessonBlock.gateTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{firstLessonBlock.gate}</p>
          <Link href="/bassein/" prefetch={false} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand-600 link-draw underline-offset-4 dark:text-brand-200">
            Маршрут к бассейну
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-8">
        <ProgramBookButton id={programId} title={programTitle(programId)} />
        <ArrowLink href="/blog/pervoe-zanyatie-po-plavaniyu-cheklist/" className="mt-6">
          Первое занятие: чек-лист для родителя
        </ArrowLink>
      </div>
    </Section>
  );
}

export function ProgramGroups({ note, tone = 'alt' }: { note?: string; tone?: 'surface' | 'alt' }) {
  return (
    <Section id="groups" labelledBy="groups-title" className={tone === 'alt' ? 'bg-surface-alt' : 'bg-surface'}>
      <SectionHeading id="groups-title" eyebrow="Группа и время" title={groupsBlock.title} />
      <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-ink-soft">
        <p>{groupsBlock.text}</p>
        {note ? <p>{note}</p> : null}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-8">
        <ArrowLink href="/raspisanie/">Расписание занятий</ArrowLink>
        <ArrowLink href="/price/">Стоимость занятий</ArrowLink>
      </div>
    </Section>
  );
}

/*
  Ссылки на страницы направлений для /raspisanie/ и /roditelyam/: родитель,
  который смотрит время или читает про уровень, часто ещё не знает, какое
  направление ему нужно. Список берётся из programs.ts, поэтому новое
  направление с href появится здесь само.
*/
export function ProgramLinks() {
  const linked = programs.filter((program) => program.href);
  return (
    <Section id="program-links" labelledBy="program-links-title" className="bg-surface">
      <SectionHeading id="program-links-title" eyebrow="Направления" title="Какое направление подойдёт ребёнку" />
      <ul className="mt-10 grid gap-3 sm:gap-4 md:grid-cols-3">
        {linked.map((program, i) => (
          <li key={program.id}>
            <Link
              href={program.href as string}
              prefetch={false}
              className="reveal group flex h-full flex-col rounded-card border border-hairline bg-surface-alt p-6 transition-colors hover:border-brand-300"
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <span className="text-sm font-medium text-brand-600 dark:text-brand-200">{program.audience}</span>
              <span className="mt-2 text-lg font-medium text-ink group-hover:text-brand-600 dark:group-hover:text-brand-200">{program.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
