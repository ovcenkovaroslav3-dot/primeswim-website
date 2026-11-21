import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArrowLink, Section, SectionHeading } from '@/components/ui';
import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { CoachPreview } from '@/components/sections/CoachPreview';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { ProgramFirstLesson, ProgramGroups, ProgramIntro } from '@/components/sections/ProgramPage';
import { beginnersPage as page } from '@/content/program-pages';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.beginners);

/*
  Направление «Обучение с нуля»: вход из поиска по запросам вроде
  «обучение плаванию детей с нуля» и страница, куда ведёт карточка на главной.

  Спортивное направление описано на /sorevnovaniya/, поэтому здесь его нет.
  Разметку FAQPage отдаёт блок вопросов — подборкой под это направление.
*/
export default function BeginnersPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Обучение с нуля' },
          ]}
        />
      </div>

      <ProgramIntro programId={page.programId} h1={page.h1} eyebrow={page.eyebrow} lead={page.lead} />

      <Section id="steps" labelledBy="steps-title" className="bg-surface-alt">
        <SectionHeading id="steps-title" eyebrow="Как идут занятия" title={page.stepsTitle} lead={page.stepsLead} />
        <ol className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2">
          {page.steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal min-w-0 rounded-card border border-hairline bg-surface p-6 sm:p-7"
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <span aria-hidden="true" className="text-3xl leading-none font-light tabular-nums text-ink-muted">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-x-8">
          <ArrowLink href="/blog/rebenok-boitsya-vody-chto-delat/">Ребёнок боится воды: что делать</ArrowLink>
          <ArrowLink href="/tehnika-plavaniya/">Дальше — техника четырёх стилей</ArrowLink>
        </div>
      </Section>

      <ProgramFirstLesson programId={page.programId} />

      <Section id="timing" labelledBy="timing-title" className="bg-surface-alt">
        <SectionHeading id="timing-title" eyebrow="Сроки" title={page.timingTitle} />
        <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-ink-soft">
          {page.timing.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ArrowLink href="/blog/skolko-vremeni-nauchit-rebenka-plavat/" className="mt-6">
          Сколько времени нужно, чтобы научить ребёнка плавать
        </ArrowLink>
      </Section>

      <ProgramGroups tone="surface" />

      <CoachPreview />

      <Faq ids={page.faqIds} moreHref="/roditelyam/" />

      <BlogTeaser title="Читайте также" slugs={[...page.articles]} />

      <FinalCta />
    </>
  );
}
