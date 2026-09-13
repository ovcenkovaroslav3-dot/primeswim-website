import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { strokes } from './method.ts';

/*
  Силуэт стиля подставляется по `stroke.id`: компонент собирает путь как
  /media/strokes/<id>.avif и .webp. Договорённость держится только именами
  файлов, а таких договорённостей проект уже один раз ломал — плитки
  галереи разъехались со списком кадров, и страница просила файл, которого
  нет. <picture> на 404 к запасному варианту не откатывается: посетитель
  получает битую картинку, и никто об этом не узнаёт.

  Поэтому существование файлов проверяется тестом. Переименуете стиль в
  method.ts — упадёт здесь, а не в браузере у родителя.

  Пересобрать файлы: node scripts/make-stroke-art.mjs
*/
const DIR = join(process.cwd(), 'public', 'media', 'strokes');

test('у каждого стиля есть силуэт в обоих форматах', () => {
  for (const stroke of strokes) {
    for (const ext of ['avif', 'webp']) {
      const file = join(DIR, `${stroke.id}.${ext}`);
      assert.ok(
        existsSync(file),
        `${stroke.name}: нет ${stroke.id}.${ext} — пересоберите node scripts/make-stroke-art.mjs`,
      );
    }
  }
});

test('у каждого стиля есть траектория гребка', () => {
  for (const stroke of strokes) {
    assert.ok(
      stroke.path.startsWith('M'),
      `${stroke.name}: путь траектории не похож на SVG-команду`,
    );
  }
});
