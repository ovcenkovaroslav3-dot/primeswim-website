import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArrowLink, Section, SectionHeading } from '@/components/ui';
import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { CoachPreview } from '@/components/sections/CoachPreview';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { ProgramFirstLesson, ProgramGroups, ProgramIntro } from '@/components/sections/ProgramPage';
import { strokes } from '@/content/method';
import { techniquePage as page } from '@/content/program-pages';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.technique);

/*
  Направление «Техника четырёх стилей»: вход из поиска по запросам вроде
  «техника плавания для детей» и страница, куда ведёт карточка на главной.
  Разметку FAQPage отдаёт блок вопросов — подборкой под это направление.
*/
export default function TechniquePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Техника плавания' },
          ]}
        />
      </div>

      <ProgramIntro programId={page.programId} h1={page.h1} eyebrow={page.eyebrow} lead={page.lead} />

      <Section id="strokes" labelledBy="strokes-title" className="bg-surface-alt">
        <SectionHeading id="strokes-title" eyebrow="Стили" title={page.strokesTitle} lead={page.strokesLead} />
        <ul className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2">
          {strokes.map((stroke, i) => (
            <li
              key={stroke.id}
              className="reveal min-w-0 rounded-card border border-hairline bg-surface p-6 sm:p-7"
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              <p className="text-sm font-medium text-brand-600 dark:text-brand-200">{stroke.short}</p>
              <h3 className="mt-2 text-xl text-ink">{stroke.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{stroke.description}</p>
              <ul className="mt-4 space-y-1 text-sm leading-relaxed text-ink-soft">
                {stroke.learns.map((item) => (
                  <li key={item} className="flex min-w-0 gap-3">
                    <span aria-hidden="true" className="w-4 shrink-0 text-ink-muted">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-x-8">
          <ArrowLink href="/blog/stili-plavaniya-dlya-detej/">С чего начинают и в каком порядке учат стили</ArrowLink>
        </div>
      </Section>

      <Section id="method" labelledBy="method-title" className="bg-surface">
        <SectionHeading id="method-title" eyebrow="Как работаем" title={page.methodTitle} />
        <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-ink-soft">
          {page.method.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/plavanie-s-nulya/">Обучение с нуля</ArrowLink>
          <ArrowLink href="/sorevnovaniya/">Старты, сборы и разряды</ArrowLink>
        </div>
      </Section>

      <ProgramFirstLesson programId={page.programId} tone="alt" />

      <ProgramGroups note={page.levelNote} tone="surface" />

      <CoachPreview />

      <Faq ids={page.faqIds} withSchema={false} moreHref="/roditelyam/" />

      <BlogTeaser title="Читайте также" slugs={[...page.articles]} />

      <FinalCta />
    </>
  );
}
