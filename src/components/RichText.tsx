import Link from 'next/link';
import type { ReactNode } from 'react';

/*
  Инлайн-разметка в текстах статей.

  Тексты блога лежат в content/blog как строки, а не как JSX: так их можно
  править без знания реакта и вычитывать целиком. Двух пометок хватает на
  все двенадцать статей:

    **полужирный**     — акцент внутри абзаца
    [текст](/путь/)    — ссылка; внутренняя идёт через next/link, внешняя —
                         обычный <a> с rel="noopener noreferrer"

  Сознательно НЕ markdown: полноценный парсер тянет зависимость в бандл,
  а из всей спецификации в текстах реально встречаются только эти две
  конструкции. Встретится третья — сначала появится тест, потом ветка.
*/

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const BOLD = /^\*\*([^*]+)\*\*$/;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = text.split(TOKEN).map((chunk, index) => {
    const bold = BOLD.exec(chunk);
    if (bold) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {bold[1]}
        </strong>
      );
    }

    const link = LINK.exec(chunk);
    if (link) {
      const [, label, href] = link;
      const className =
        'font-medium text-brand-600 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-500 dark:text-brand-200 dark:decoration-brand-400';
      if (href.startsWith('/')) {
        return (
          <Link key={index} href={href} className={className}>
            {label}
          </Link>
        );
      }
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
        </a>
      );
    }

    return chunk;
  });

  return <>{parts}</>;
}
