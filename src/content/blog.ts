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
import { article as osanka } from './blog/osanka.ts';
import { article as ochkiShapochka } from './blog/ochki-shapochka.ts';
import { article as razryady } from './blog/razryady.ts';
import { article as sorevnovaniya } from './blog/sorevnovaniya.ts';
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
  osanka,
  ochkiShapochka,
  razryady,
  sorevnovaniya,
  basseinyHimki,
  pervySport,
];

export function getArticle(slug: string): BlogArticle | undefined {
  return articles.find((article) => article.slug === slug);
}
