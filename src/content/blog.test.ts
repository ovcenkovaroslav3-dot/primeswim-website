import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readdirSync, readFileSync } from 'node:fs';

import {
  articles,
  blogRedirects,
  getRedirectTarget,
  getRelatedArticles,
  lastModified,
  relatedSlugs,
} from './blog.ts';

/*
  Инварианты статейного раздела.

  Те же границы сниппета, что стережёт seo.test.ts для посадочных страниц:
  описание 70–158, заголовок с учётом суффикса « — PRIME SWIM», который
  дописывает шаблон в layout.tsx. Без теста девять описаний обрезались
  бы поиском на полуслове — проверено на шести страницах сайта до этого.
*/
const DESC_LIMIT = 158;
const DESC_MIN = 70;
const TITLE_LIMIT = 60;
const SUFFIX = ' — PRIME SWIM';

test('slug статьи уникален и URL-совместим', () => {
  const seen = new Set<string>();
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9-]+$/, `${article.slug}: только латиница и дефис`);
    assert.ok(!seen.has(article.slug), `${article.slug}: дубль`);
    seen.add(article.slug);
  }
});

test('описание статьи влезает в сниппет целиком', () => {
  for (const article of articles) {
    assert.ok(
      article.description.length <= DESC_LIMIT,
      `${article.slug}: описание ${article.description.length} символов, предел ${DESC_LIMIT}`,
    );
    assert.ok(
      article.description.length >= DESC_MIN,
      `${article.slug}: описание ${article.description.length} символов, поиск подставит свой текст`,
    );
  }
});

test('заголовок статьи влезает в сниппет вместе с названием школы', () => {
  for (const article of articles) {
    const full = `${article.title}${SUFFIX}`;
    assert.ok(
      full.length <= TITLE_LIMIT,
      `${article.slug}: заголовок с суффиксом ${full.length} символов, предел ${TITLE_LIMIT}`,
    );
  }
});

test('у статьи есть дата, лид, тело и вопросы', () => {
  for (const article of articles) {
    assert.match(
      article.datePublished,
      /^\d{4}-\d{2}-\d{2}$/,
      `${article.slug}: дата в формате YYYY-MM-DD`,
    );
    assert.ok(article.lead.length > 0, `${article.slug}: пустой лид`);
    assert.ok(article.blocks.length >= 5, `${article.slug}: подозрительно мало блоков`);
    assert.ok(article.faq.length >= 3, `${article.slug}: меньше трёх вопросов`);
  }
});

/*
  Внутренние ссылки статей — на существующие страницы. Текст ссылки
  набран разметкой [текст](/путь/); битая ссылка из статьи в статью —
  это 404, которое читатель встретит на втором абзаце.
*/
test('ссылки между статьями ведут на существующие статьи', () => {
  const slugs = new Set(articles.map((article) => article.slug));
  const linkRe = /\]\(\/blog\/([a-z0-9-]+)\/?\)/g;
  for (const article of articles) {
    const text = [
      article.lead,
      ...article.blocks.flatMap((block) =>
        block.type === 'list' ? block.items : [block.text],
      ),
    ].join('\n');
    for (const match of text.matchAll(linkRe)) {
      assert.ok(
        slugs.has(match[1]),
        `${article.slug}: ссылка на несуществующую статью /blog/${match[1]}/`,
      );
    }
  }
});

test('у каждой статьи 2–3 связанные: существующие, не она сама, без дублей', () => {
  const slugs = new Set(articles.map((a) => a.slug));
  for (const article of articles) {
    const related = relatedSlugs[article.slug] ?? [];
    assert.ok(related.length >= 2 && related.length <= 3, `${article.slug}: нужно 2–3 связанные`);
    assert.equal(new Set(related).size, related.length, `${article.slug}: дубль в связанных`);
    for (const r of related) {
      assert.ok(slugs.has(r), `${article.slug}: нет статьи ${r}`);
      assert.notEqual(r, article.slug, `${article.slug}: ссылка на себя`);
    }
    assert.equal(getRelatedArticles(article.slug).length, related.length);
  }
});

/*
  Слияние 12 статей в 9 (ноябрь 2026): три адреса отданы заглушкам с
  переходом на преемника. Страница-заглушка строится из blogRedirects, и
  если преемника нет, сборка отдала бы пустую страницу.
*/
const articleText = (article: (typeof articles)[number]): string =>
  [
    article.lead,
    ...article.blocks.flatMap((block) =>
      block.type === 'list' ? block.items : [block.text],
    ),
    ...article.faq.flatMap((item) => [item.question, item.answer]),
  ].join('\n');

test('в разделе девять статей и три слитых адреса', () => {
  assert.equal(articles.length, 9);
  assert.equal(Object.keys(blogRedirects).length, 3);
});

test('каждый редирект ведёт на существующую статью, а не на другой редирект', () => {
  const slugs = new Set(articles.map((article) => article.slug));
  for (const [from, to] of Object.entries(blogRedirects)) {
    assert.match(from, /^[a-z0-9-]+$/, `${from}: только латиница и дефис`);
    assert.ok(slugs.has(to), `${from}: преемника ${to} нет среди статей`);
    assert.ok(!slugs.has(from), `${from}: адрес и статья, и редирект одновременно`);
    assert.ok(!(to in blogRedirects), `${from}: цепочка редиректов через ${to}`);
    assert.equal(getRedirectTarget(from)?.slug, to);
  }
  assert.equal(getRedirectTarget('net-takoj-stati'), undefined);
});

test('ни статьи, ни связанные не ссылаются на слитые адреса', () => {
  const dead = Object.keys(blogRedirects);
  for (const article of articles) {
    const text = articleText(article);
    for (const slug of dead) {
      assert.ok(!text.includes(slug), `${article.slug}: ссылка на слитый адрес ${slug}`);
    }
    for (const related of relatedSlugs[article.slug] ?? []) {
      assert.ok(!dead.includes(related), `${article.slug}: в «Читайте также» слитый адрес ${related}`);
    }
  }
  for (const key of Object.keys(relatedSlugs)) {
    assert.ok(!dead.includes(key), `relatedSlugs: ключ ${key} это слитый адрес`);
  }
});

test('остальной код сайта не ссылается на слитые адреса', () => {
  const dead = Object.keys(blogRedirects);
  const root = new URL('../', import.meta.url);
  const walk = (dir: URL): URL[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
      return entry.isDirectory() ? walk(child) : [child];
    });
  for (const file of walk(root)) {
    if (!/\.(ts|tsx)$/.test(file.pathname)) continue;
    // реестр и тест сами называют слитые адреса: там им и место
    if (/\/content\/blog(\.test)?\.ts$/.test(file.pathname)) continue;
    const text = readFileSync(file, 'utf8');
    for (const slug of dead) {
      assert.ok(!text.includes(slug), `${file.pathname}: ссылка на слитый адрес ${slug}`);
    }
  }
});

test('dateModified задан в формате даты и не раньше публикации', () => {
  for (const article of articles) {
    assert.match(article.dateModified ?? '', /^\d{4}-\d{2}-\d{2}$/, `${article.slug}: нет dateModified`);
    assert.ok(
      (article.dateModified ?? '') >= article.datePublished,
      `${article.slug}: правка раньше публикации`,
    );
    assert.equal(lastModified(article), article.dateModified);
  }
});

test('в текстах статей нет цен: они живут на /price/', () => {
  for (const article of articles) {
    assert.ok(!articleText(article).includes('₽'), `${article.slug}: цена в тексте статьи`);
  }
});
