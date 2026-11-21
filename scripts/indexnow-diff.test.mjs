import assert from 'node:assert/strict';
import { test } from 'node:test';

import { changedUrls } from './indexnow-diff.mjs';
import { normalizeHtml } from './indexnow-manifest.mjs';

const manifest = (pages) => ({ version: 1, pages });
const A = 'https://www.primeswim.ru/';
const B = 'https://www.primeswim.ru/price/';

test('одинаковые манифесты дают пустой список', () => {
  assert.deepEqual(changedUrls(manifest({ [A]: 'a', [B]: 'b' }), manifest({ [A]: 'a', [B]: 'b' })), []);
});

test('изменённый хэш даёт только этот адрес', () => {
  assert.deepEqual(changedUrls(manifest({ [A]: 'a', [B]: 'b' }), manifest({ [A]: 'a', [B]: 'x' })), [B]);
});

test('новый адрес попадает в список', () => {
  assert.deepEqual(changedUrls(manifest({ [A]: 'a' }), manifest({ [A]: 'a', [B]: 'b' })), [B]);
});

test('удалённый адрес попадает в список', () => {
  assert.deepEqual(changedUrls(manifest({ [A]: 'a', [B]: 'b' }), manifest({ [A]: 'a' })), [B]);
});

test('нет старого манифеста или он битый — null, то есть отправить всё', () => {
  const fresh = manifest({ [A]: 'a' });
  assert.equal(changedUrls(null, fresh), null);
  assert.equal(changedUrls(undefined, fresh), null);
  assert.equal(changedUrls('<html>404</html>', fresh), null);
  assert.equal(changedUrls({ version: 2, pages: {} }, fresh), null);
  assert.equal(changedUrls({ version: 1, pages: [] }, fresh), null);
  assert.equal(changedUrls({ version: 1, pages: { [A]: 5 } }, fresh), null);
});

test('нормализация игнорирует скрипты, стили, атрибуты и пробелы, но видит текст и метаданные', () => {
  const page = (chunk, text, desc = 'Описание') => `<!DOCTYPE html><html><head><title>Заголовок</title>
    <meta name="description" content="${desc}"/><meta name="robots" content="index, follow"/>
    <link rel="canonical" href="https://www.primeswim.ru/x/"/><link rel="stylesheet" href="/_next/static/${chunk}.css"/>
    <script src="/_next/static/chunks/${chunk}.js" async=""></script></head>
    <body class="${chunk}"><main><h1>Привет</h1>
    <p>${text}</p></main><script>self.__next_f.push([1,"${chunk}"])</script>
    <script type="application/ld+json">{"@type":"Thing"}</script></body></html>`;
  const base = normalizeHtml(page('aaa', 'Текст   страницы'));
  assert.equal(normalizeHtml(page('bbb', 'Текст страницы')), base);
  assert.notEqual(normalizeHtml(page('aaa', 'Другой текст')), base);
  assert.notEqual(normalizeHtml(page('aaa', 'Текст страницы', 'Новое описание')), base);
});
