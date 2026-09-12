/**
 * Квадратные плитки главной: public/media/preview/tiles/.
 *
 * ЗАЧЕМ СКРИПТ. Плитки собирались вручную в Pillow, и набор кадров жил
 * отдельно от набора файлов: список `highlightSources` в src/content/media.ts
 * говорит, какие восемь снимков стоят на главной, а каталог tiles/ хранит то,
 * что когда-то нарезали. Стоит поменять список — и страница просит файл,
 * которого нет: JPEG отдаёт 404, а <picture> на ненайденный файл к запасному
 * варианту не откатывается (разбор — в public/media/preview/README.md).
 *
 * Теперь источник истины один: скрипт читает тот же список из media.ts,
 * пересобирает ровно его и сам сообщает, какие файлы в каталоге лишние.
 *
 * ПАРАМЕТРЫ ТЕ ЖЕ, что были у Pillow, — иначе восемь плиток разошлись бы по
 * плотности и резкости между собой:
 *   • квадрат 560×560 (плитка 276 px на десктопе при двойной плотности);
 *   • кадрирование по центру горизонтали и на 35% по вертикали: больше
 *     половины снимков вертикальные, лица в верхней трети, и центральный
 *     квадрат срезал бы головы;
 *   • JPEG качество 80, прогрессивный; AVIF качество 62 рядом с каждым.
 *
 * ЗАПУСК: node scripts/make-gallery-tiles.mjs
 */

import { readFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SIZE = 560;
const CENTER_Y = 0.35;
const TILES_DIR = path.resolve('public/media/preview/tiles');
const GALLERY_DIR = path.resolve('public/media/gallery');

/*
  Список берётся из media.ts разбором, а не импортом: файл на TypeScript, а
  скрипт запускается голым Node. Регулярное выражение узкое и падает громко,
  если объявление переименуют, — молча собрать не тот набор оно не может.
*/
const source = await readFile('src/content/media.ts', 'utf8');
const block = source.match(/const highlightSources = \[([\s\S]*?)\];/);
if (!block) {
  throw new Error(
    'В src/content/media.ts не найден highlightSources — скрипт не знает, что собирать.',
  );
}
const names = [...block[1].matchAll(/'\/media\/gallery\/([^']+)\.jpg'/g)].map(
  (m) => m[1],
);
if (!names.length) throw new Error('highlightSources пуст.');

/**
 * Обрезка в квадрат со смещённым центром.
 *
 * sharp умеет `fit: 'cover'` только с девятью опорными точками, а нужна
 * доля — поэтому окно считается руками и вырезается extract до масштаба.
 */
async function squareTop(file) {
  const image = sharp(file).rotate();
  const { width, height } = await image.metadata();
  const side = Math.min(width, height);
  const left = Math.round((width - side) * 0.5);
  const top = Math.round((height - side) * CENTER_Y);

  return sharp(file)
    .rotate()
    .extract({ left, top, width: side, height: side })
    .resize(SIZE, SIZE, { kernel: 'lanczos3' });
}

for (const name of names) {
  const src = path.join(GALLERY_DIR, `${name}.jpg`);
  const base = await squareTop(src);

  await base
    .clone()
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(path.join(TILES_DIR, `${name}.jpg`));

  await base
    .clone()
    .avif({ quality: 62 })
    .toFile(path.join(TILES_DIR, `${name}.avif`));

  console.log(`${name} — jpg + avif`);
}

/*
  Снимки, выпавшие из подборки, оставляют за собой пару файлов. Сами не
  мешают, но каталог перестаёт отвечать на вопрос «что сейчас на главной»,
  а через полгода уже не разобрать, какие из шестнадцати файлов живые.
*/
const keep = new Set(names.flatMap((n) => [`${n}.jpg`, `${n}.avif`]));
for (const file of await readdir(TILES_DIR)) {
  if (!keep.has(file)) {
    await unlink(path.join(TILES_DIR, file));
    console.log(`удалён лишний: ${file}`);
  }
}
