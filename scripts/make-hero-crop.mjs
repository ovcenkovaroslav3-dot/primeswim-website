/**
 * Копия кадра первого экрана под телефон: public/media/pool/*-4x3.{jpg,avif}.
 *
 * Вертикальный снимок показывается на узком экране обрезкой 4:3. Копия
 * содержит ровно видимый центральный пояс и не заставляет телефон скачивать
 * части исходника, которые всё равно не попадут на экран.
 *
 * Десктоп получает исходный вертикальный файл без изменений. Узкий экран —
 * копию 1000×750 через <source media> в Picture.
 *
 * ЗАПУСК: node scripts/make-hero-crop.mjs
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1000;
const HEIGHT = 750;
const JPEG_QUALITY = 78;
const AVIF_QUALITY = 62;

const content = await readFile('src/content/media.ts', 'utf8');
const found = content.match(
  /export const heroImage: MediaItem = \{\s*src: '([^']+)'/,
);
if (!found) {
  throw new Error(
    'В src/content/media.ts не найден heroImage — скрипт не знает, какой кадр резать.',
  );
}

const src = path.resolve('public', found[1].replace(/^\//, ''));
const base = src.replace(/\.jpe?g$/i, '');
const crop = sharp(src).rotate().resize(WIDTH, HEIGHT, {
  fit: 'cover',
  position: 'centre',
});

const jpegOut = `${base}-4x3.jpg`;
const avifOut = `${base}-4x3.avif`;

await crop
  .clone()
  .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
  .toFile(jpegOut);
await crop.clone().avif({ quality: AVIF_QUALITY }).toFile(avifOut);

const kb = async (file) => Math.round((await stat(file)).size / 1024);
console.log(`${path.relative('.', jpegOut)} — ${await kb(jpegOut)} KB`);
console.log(`${path.relative('.', avifOut)} — ${await kb(avifOut)} KB`);
console.log(
  `исходный вертикальный кадр остаётся десктопу: ${await kb(src)} KB`,
);
