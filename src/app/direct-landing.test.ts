import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

/*
  Посадочная для Директа должна оставаться вне индекса: noindex в самой
  странице, нет в sitemap, но НЕ закрыта в robots.txt (иначе Яндекс не увидит
  noindex). Файлы читаются как текст: алиасы '@/' в node --test не работают.
*/
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('страница для Директа: noindex, follow', () => {
  const page = read('./probnoe-zanyatie/page.tsx');
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
});

test('страницы для Директа нет в sitemap', () => {
  assert.ok(!read('./sitemap.ts').includes('probnoe-zanyatie'));
});

test('страница для Директа не закрыта в robots.txt', () => {
  assert.ok(!read('./robots.ts').includes('probnoe-zanyatie'));
});
