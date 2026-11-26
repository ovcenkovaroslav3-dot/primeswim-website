import Link from 'next/link';

import { ArrowLink, Section, SectionHeading } from '../ui';
import { getArticle } from '@/content/blog';

/*
  Превью статей на посадочных страницах.

  Показывает 1–3 выбранные статьи — не весь раздел: посадочная страница
  должна доводить до заявки, а ссылка на все девять материалов превратилась
  бы в кроличью нору рядом с кнопкой записи. Какие статьи уместны, знает
  страница — она и передаёт slugs. Ссылка «Все статьи» ведёт в раздел.
*/
export function BlogTeaser({
  slugs,
  title = 'Почитать перед записью',
  tone = 'surface',
}: {
  slugs: string[];
  title?: string;
  /* Фон секции: страница выбирает тот, что чередуется с соседней секцией. */
  tone?: 'surface' | 'alt';
}) {
  const picked = slugs.flatMap((slug) => {
    const article = getArticle(slug);
    return article ? [article] : [];
  });
  if (picked.length === 0) return null;

  return (
    <Section
      id="blog-teaser"
      labelledBy="blog-teaser-title"
      className={tone === 'alt' ? 'bg-surface-alt' : 'bg-surface'}
    >
      <SectionHeading
        id="blog-teaser-title"
        eyebrow="Статьи"
        title={title}
      />

      <ul className={`mt-10 grid gap-3 sm:gap-4 ${picked.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {picked.map((article, i) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}/`}
              prefetch={false}
              className={`reveal group flex h-full flex-col rounded-card border border-hairline p-6 transition-colors hover:border-brand-300 ${tone === 'alt' ? 'bg-surface' : 'bg-surface-alt'}`}
              style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
            >
              {/*
                26 ноября 2026: заголовок переносится по слогам, а не рвётся на
                случайной букве. На body стоит overflow-wrap: anywhere (защита
                от горизонтальной прокрутки при крупном шрифте), и слово, не
                влезшее в узкую карточку, ломалось без дефиса — «PRIME SWI» на
                одной строке, «M» на другой. hyphens-auto даёт браузеру
                переносы по правилам русского языка (lang="ru" на <html>), а
                anywhere остаётся запасным выходом для слова, которое не
                разбить и по слогам. text-pretty не оставляет одно слово в
                последней строке. Обрезки у заголовка нет и не будет — его
                читают целиком; line-clamp-3 остался только у отрывка.
              */}
              <span className="text-base leading-snug font-medium text-pretty hyphens-auto text-ink group-hover:text-brand-600 dark:group-hover:text-brand-200">
                {article.h1}
              </span>
              <span className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {article.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ArrowLink href="/blog/">
          Все статьи о детском плавании
        </ArrowLink>
      </div>
    </Section>
  );
}
