import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd, schemaId } from '@/components/StructuredData';
import { RichText } from '@/components/RichText';
import { FinalCta } from '@/components/sections/FinalCta';
import { articles, getArticle } from '@/content/blog';
import { coaches } from '@/content/coaches';
import { ogImage } from '@/content/seo';
import { site } from '@/content/site';

/*
  Статья блога.

  Каждая страница отдаёт три разметки: BreadcrumbList (внутри компонента
  Breadcrumbs), Article и FAQPage. Последняя допустима, потому что вопросы
  и ответы видны на странице целиком — то же правило, что у /roditelyam/.

  Статейный раздел открыт 4 ноября 2026 по SEO-аудиту: у сайта были только
  коммерческие страницы, а родительские вопросы («с какого возраста»,
  «боится воды») доставались школам-конкурентам.
*/

// сборка в статику: адреса статей известны на билде, других нет
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = `${site.url}/blog/${article.slug}/`;

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      siteName: site.name,
      title: `${article.title} — ${site.name}`,
      description: article.description,
      url,
      images: [ogImage],
      publishedTime: article.datePublished,
      authors: [coaches[0].name],
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const coach = coaches[0];
  const url = `${site.url}/blog/${article.slug}/`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1,
    description: article.description,
    inLanguage: 'ru-RU',
    author: {
      '@type': 'Person',
      name: coach.name,
      jobTitle: coach.role,
      url: `${site.url}/trener/`,
    },
    publisher: { '@id': schemaId.organization },
    mainEntityOfPage: url,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    image: ogImage.url,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Статьи', href: '/blog/' },
            { label: article.title },
          ]}
        />
      </div>

      <article className="mx-auto w-full max-w-3xl px-4 pb-14 sm:px-6 sm:pb-16">
        <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
          Статьи
        </p>
        <h1 className="text-3xl leading-[1.12] font-normal tracking-[-0.02em] text-ink sm:text-4xl">
          {article.h1}
        </h1>
        <time
          dateTime={article.datePublished}
          className="mt-4 block text-sm text-ink-muted"
        >
          {dateFormatter.format(new Date(article.datePublished))}
        </time>

        <p className="mt-8 text-lg leading-relaxed text-ink">
          <RichText text={article.lead} />
        </p>

        <div className="mt-8 space-y-5">
          {article.blocks.map((block, index) => {
            if (block.type === 'h2') {
              return (
                <h2
                  key={index}
                  className="pt-6 text-2xl leading-snug font-normal tracking-[-0.01em] text-ink"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'list') {
              const ListTag = block.ordered ? 'ol' : 'ul';
              return (
                <ListTag
                  key={index}
                  className={`space-y-2 pl-5 leading-relaxed text-ink-soft ${
                    block.ordered ? 'list-decimal' : 'list-disc marker:text-brand-500'
                  }`}
                >
                  {block.items.map((item) => (
                    <li key={item}>
                      <RichText text={item} />
                    </li>
                  ))}
                </ListTag>
              );
            }
            return (
              <p key={index} className="leading-relaxed text-ink-soft">
                <RichText text={block.text} />
              </p>
            );
          })}
        </div>

        <section aria-labelledby="blog-faq-title" className="mt-14">
          <h2
            id="blog-faq-title"
            className="text-2xl leading-snug font-normal tracking-[-0.01em] text-ink"
          >
            Частые вопросы
          </h2>
          {/* Нативные details/summary: работают без JavaScript и с клавиатуры */}
          <div className="mt-6 space-y-3">
            {article.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-card border border-hairline bg-surface-alt px-6 py-4"
              >
                <summary className="cursor-pointer font-medium text-ink">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  <RichText text={item.answer} />
                </p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-14 rounded-card bg-surface-alt p-6 sm:p-7">
          <p className="text-sm leading-relaxed text-ink-soft">
            Автор статьи —{' '}
            <Link
              href="/trener/"
              className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-500 dark:text-brand-200"
            >
              {coach.name}
            </Link>
            , основатель школы плавания PRIME SWIM, {coach.role}. Стаж
            тренерской работы — {coach.yearsExperience} лет. Все группы школы
            ведёт лично.
          </p>
        </footer>
      </article>

      <FinalCta />
    </>
  );
}
