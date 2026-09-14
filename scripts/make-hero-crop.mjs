/**
 * Копия кадра первого экрана под телефон: public/media/pool/*-4x3.{jpg,avif}.
 *
 * ЗАЧЕМ. Снимок зала лежит вертикальным, 1050×1400, и таким его получает
 * каждый посетитель. Но на телефоне он показывается обрезкой 4:3 шириной
 * примерно 335 px: `object-cover` берёт средний пояс кадра, а верх и низ
 * никогда не выходят на экран. То есть телефон скачивает 1,47 мегапикселя,
 * чтобы показать 0,76 — и делает это первым, потому что кадр помечен
 * приоритетным как кандидат в LCP.
 *
 * На узком экране он к тому же уходит за сгиб: на 375×844 верх снимка
 * начинается на 931-м пикселе. Выходит, самый тяжёлый файл страницы грузится
 * вперёд шрифтов ради того, чего на первом экране не видно.
 *
 * Копия отдаётся только телефонам, через <source media> в Picture. Десктоп
 * получает прежний вертикальный файл без изменений — там кадр стоит рядом с
 * текстом в исходных 3:4 и обрезки нет.
 *
 * ЭТО НЕ ПЕРЕСЖАТИЕ. В public/media/preview/README.md записано, что кадр
 * первого экрана оставлен как есть: пересжатие того же файла выиграло бы
 * 47 KB и стоило бы резкости. Здесь другое — не то же изображение хуже, а
 * ровно тот кусок, который виден, в родном для телефона размере. 1000×750 —
 * это 335 px при тройной плотности, то есть предел, после которого разницу
 * уже не видит и экран.
 *
 *   было:  avif 187 KB   jpeg 285 KB   (1050×1400)
 *   стало: avif  91 KB   jpeg 135 KB   (1000×750)
 *
 * ЗАПУСК: node scripts/make-hero-crop.mjs
 */

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/* 335 px показа при тройной плотности — дальше растить нечего */
const WIDTH = 1000;
const HEIGHT = 750;

/* те же числа, что у остальных копий: разойдутся — снимки разойдутся по зерну */
const JPEG_QUALITY = 78;
const AVIF_QUALITY = 62;

/*
  Адрес берётся из media.ts разбором, а не импортом: файл на TypeScript, а
  скрипт запускается голым Node. Выражение узкое и падает громко — собрать
  копию не того кадра оно не может.
*/
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

/*
  Обрезка ровно та, что делает браузер: object-fit: cover с точкой по
  умолчанию — центр по обеим осям. Возьми скрипт другой пояс кадра, и
  телефон показал бы не то, что видно сейчас.
*/
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

/*
  AVIF обязателен, а не желателен: Picture подставляет его в <source>, и на
  ненайденный файл <picture> к запасному варианту НЕ откатывается — выйдет
  дыра вместо снимка. Инвариант стережёт src/content/media.test.ts.
*/
await crop.clone().avif({ quality: AVIF_QUALITY }).toFile(avifOut);

const kb = async (file) => Math.round((await stat(file)).size / 1024);
console.log(`${path.relative('.', jpegOut)} — ${await kb(jpegOut)} KB`);
console.log(`${path.relative('.', avifOut)} — ${await kb(avifOut)} KB`);
console.log(
  `исходный вертикальный кадр остаётся десктопу: ${await kb(src)} KB`,
);
