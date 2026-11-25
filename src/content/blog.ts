/**
 * Статьи раздела /blog/.
 *
 * Информационные материалы под запросы родителей, которые коммерческие
 * страницы закрыть не могут («с какого возраста», «боится воды», «какая
 * справка»). Каждая статья заканчивается призывом записаться на пробное
 * занятие и ссылается на него и на соседние статьи — раздел работает
 * верхом воронки, а не читалкой ради читалки.
 *
 * Тексты лежат по одному файлу на статью в ./blog/. Реестр ниже знает
 * только порядок: он задаёт выдачу на странице списка и порядок в карте
 * сайта, поэтому новую статью достаточно добавить сюда одной строкой.
 *
 * Расширения .ts в импортах намеренны — см. комментарий в seo.ts: тест
 * (blog.test.ts) гоняется голым node --test без сборщика.
 */

import { article as vozrast } from './blog/vozrast.ts';
import { article as strahVody } from './blog/strah-vody.ts';
import { article as pervoeZanyatie } from './blog/pervoe-zanyatie.ts';
import { article as spravka } from './blog/spravka.ts';
import { article as stili } from './blog/stili.ts';
import { article as sroki } from './blog/sroki.ts';
import { article as razryady } from './blog/razryady.ts';
import { article as basseinyHimki } from './blog/basseiny-himki.ts';
import { article as pervySport } from './blog/pervy-sport.ts';

/** Абзац/подзаголовок/список — минимальный набор, который покрывает все тексты. */
export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] };

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogArticle = {
  /** Путь без /blog/ и без слешей: 'stili-plavaniya-dlya-detej'. */
  slug: string;
  /** Заголовок сниппета; шаблон layout.tsx сам допишет « — PRIME SWIM». */
  title: string;
  /** Видимый заголовок страницы. Длиннее title — в сниппет не идёт. */
  h1: string;
  description: string;
  /** Дата первой публикации, YYYY-MM-DD. Идёт в Article.datePublished. */
  datePublished: string;
  /**
   * Дата последней существенной правки, YYYY-MM-DD. Идёт в Article.dateModified,
   * в подпись под заголовком, в article:modified_time и в lastmod карты сайта.
   * Нет значения: везде берётся datePublished.
   */
  dateModified?: string;
  /** Первый абзац — он же ответ на запрос, важен для быстрого ответа поиска. */
  lead: string;
  blocks: BlogBlock[];
  faq: BlogFaqItem[];
};

/*
  Порядок в списке — порядок воронки из контент-плана: сначала сомнения
  на входе (возраст, страх, первое занятие, справка), потом обучение,
  потом спорт и выбор секции.
*/
export const articles: BlogArticle[] = [
  vozrast,
  strahVody,
  pervoeZanyatie,
  spravka,
  stili,
  sroki,
  razryady,
  basseinyHimki,
  pervySport,
];

export function getArticle(slug: string): BlogArticle | undefined {
  return articles.find((article) => article.slug === slug);
}

/*
  Статьи, слитые в другие. Адрес остаётся живым: на него могли ссылаться
  поисковики и другие сайты, а GitHub Pages не умеет серверных редиректов.
  Для каждого ключа сборка отдаёт заглушку /blog/<ключ>/ с мгновенным
  переходом на статью-преемника (см. app/blog/[slug]/page.tsx). В карту
  сайта, список /blog/ и «Читайте также» такие адреса не попадают, а ссылки
  на них из текстов запрещает blog.test.ts.
*/
export const blogRedirects: Record<string, string> = {
  'kak-vybrat-ochki-i-shapochku-dlya-plavaniya': 'pervoe-zanyatie-po-plavaniyu-cheklist',
  'pervye-sorevnovaniya-po-plavaniyu-deti': 'razryady-po-plavaniyu-normativy-detej',
  'plavanie-dlya-osanki-i-spiny-detej': 'kakoj-sport-vybrat-rebenku-himki',
};

/** Статья-преемник, если slug уже слит в другую; иначе undefined. */
export function getRedirectTarget(slug: string): BlogArticle | undefined {
  const target = blogRedirects[slug];
  return target ? getArticle(target) : undefined;
}

/** Дата, которую показываем как «обновлено»: правка, а при её отсутствии публикация. */
export function lastModified(article: BlogArticle): string {
  return article.dateModified ?? article.datePublished;
}

/*
  Перелинковка внутри раздела: у каждой статьи 2–3 соседние по теме. Блок
  «Читайте также» на странице статьи строится отсюда, а не из текста, —
  так статья не остаётся тупиком, и порядок ссылок виден в одном месте.
  Инварианты стережёт blog.test.ts.
*/
export const relatedSlugs: Record<string, string[]> = {
  's-kakogo-vozrasta-otdavat-rebenka-v-bassein': [
    'rebenok-boitsya-vody-chto-delat',
    'pervoe-zanyatie-po-plavaniyu-cheklist',
    'kakoj-sport-vybrat-rebenku-himki',
  ],
  'rebenok-boitsya-vody-chto-delat': [
    's-kakogo-vozrasta-otdavat-rebenka-v-bassein',
    'pervoe-zanyatie-po-plavaniyu-cheklist',
    'skolko-vremeni-nauchit-rebenka-plavat',
  ],
  'pervoe-zanyatie-po-plavaniyu-cheklist': [
    'spravka-v-bassein-dlya-rebenka',
    'rebenok-boitsya-vody-chto-delat',
    'basseiny-v-himkah-dlya-detej-kak-vybrat',
  ],
  'spravka-v-bassein-dlya-rebenka': [
    'pervoe-zanyatie-po-plavaniyu-cheklist',
    'basseiny-v-himkah-dlya-detej-kak-vybrat',
    's-kakogo-vozrasta-otdavat-rebenka-v-bassein',
  ],
  'stili-plavaniya-dlya-detej': [
    'skolko-vremeni-nauchit-rebenka-plavat',
    'razryady-po-plavaniyu-normativy-detej',
  ],
  'skolko-vremeni-nauchit-rebenka-plavat': [
    'stili-plavaniya-dlya-detej',
    'pervoe-zanyatie-po-plavaniyu-cheklist',
    'rebenok-boitsya-vody-chto-delat',
  ],
  'razryady-po-plavaniyu-normativy-detej': [
    'stili-plavaniya-dlya-detej',
    'skolko-vremeni-nauchit-rebenka-plavat',
    'kakoj-sport-vybrat-rebenku-himki',
  ],
  'basseiny-v-himkah-dlya-detej-kak-vybrat': [
    'spravka-v-bassein-dlya-rebenka',
    'pervoe-zanyatie-po-plavaniyu-cheklist',
    'kakoj-sport-vybrat-rebenku-himki',
  ],
  'kakoj-sport-vybrat-rebenku-himki': [
    's-kakogo-vozrasta-otdavat-rebenka-v-bassein',
    'basseiny-v-himkah-dlya-detej-kak-vybrat',
    'stili-plavaniya-dlya-detej',
  ],
};

export function getRelatedArticles(slug: string): BlogArticle[] {
  return (relatedSlugs[slug] ?? []).flatMap((s) => {
    const found = getArticle(s);
    return found ? [found] : [];
  });
}
