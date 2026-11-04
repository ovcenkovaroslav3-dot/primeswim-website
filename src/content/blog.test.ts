import assert from 'node:assert/strict';
import { test } from 'node:test';

import { articles } from './blog.ts';

/*
  Инварианты статейного раздела.

  Те же границы сниппета, что стережёт seo.test.ts для посадочных страниц:
  описание 70–158, заголовок с учётом суффикса « — PRIME SWIM», который
  дописывает шаблон в layout.tsx. Без теста двенадцать описаний обрезались
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
