import Link from 'next/link';

import { JsonLd } from './StructuredData';
import { site } from '@/content/site';

export type Crumb = {
  label: string;
  href?: string;
};

/*
  Хлебные крошки.

  Кроме видимой цепочки отдают BreadcrumbList. Раньше крошки были только
  на экране: поиск видел набор ссылок и строил в сниппете адрес страницы
  вида primeswim.ru › raspisanie. С разметкой Яндекс показывает названия
  разделов по-русски — сниппет становится читаемым, а вложенность сайта
  понятной без перехода.

  У последней крошки ссылки нет намеренно: это текущая страница. В разметке
  она тоже идёт без `item` — так предписано спецификацией для конечного
  элемента цепочки.
*/
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && index < items.length - 1
        ? { item: `${site.url}${item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbList} />
      <nav aria-label="Хлебные крошки" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brand-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-ink"
                  >
                    {item.label}
                  </span>
                )}
                {!isLast ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
