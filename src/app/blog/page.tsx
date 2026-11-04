import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui';
import { pageMetadata, type PageSeo } from '@/content/seo';
import { articles } from '@/content/blog';

const blogSeo: PageSeo = {
  title: 'Статьи о детском плавании',
  description:
    'Материалы тренера PRIME SWIM о детском плавании: возраст, страх воды, техника, разряды, выбор секции в Химках.',
  path: '/blog/',
};

export const metadata = pageMetadata(blogSeo);

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/*
  Статьи.

  Список всех материалов раздела. Порядок не хронологический, а по
  воронке из контент-плана: сначала то, что спрашивает родитель до
  записи (возраст, страх, первое занятие, справка), потом обучение
  и спорт. Дата подписана честная — публикации, а не «свежести ради».
*/
export default function BlogPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[{ label: 'Главная', href: '/' }, { label: 'Статьи' }]}
        />
      </div>

      <Section id="blog" labelledBy="blog-title" className="bg-surface pt-0 sm:pt-0 md:pt-0">
        <SectionHeading
          as="h1"
          id="blog-title"
          eyebrow="Статьи"
          title="Статьи о детском плавании"
          lead="Пишет тренер школы — про возраст, страх воды, технику, разряды и выбор секции. Всё из практики занятий в бассейне МГИК."
        />

        <ul className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 sm:grid-cols-2">
          {articles.map((article, i) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}/`}
                prefetch={false}
                className="reveal group flex h-full flex-col rounded-card border border-hairline bg-surface-alt p-6 transition-colors hover:border-brand-300 sm:p-7"
                style={{ ['--reveal-delay' as string]: `${(i % 4) * 70}ms` }}
              >
                <span className="text-lg leading-snug font-medium text-ink group-hover:text-brand-600 dark:group-hover:text-brand-200">
                  {article.h1}
                </span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {article.description}
                </span>
                <time
                  dateTime={article.datePublished}
                  className="mt-4 block text-xs text-ink-muted"
                >
                  {dateFormatter.format(new Date(article.datePublished))}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
