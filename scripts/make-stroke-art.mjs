/**
 * Силуэты четырёх стилей для секции техники на /trener/.
 *
 * Источники — media-source/brand/strokes/*.png: плоские силуэты пловцов с
 * альфой, нарисованы через Higgsfield (промты — в docs/brand-prime-orca.md).
 *
 * ПОЧЕМУ СИЛУЭТ, А НЕ ОБЪЁМНАЯ ФИГУРА. Первый заход был скульптурный, как у
 * талисмана: гладкие фиолетовые тела, «gender-neutral, no facial features».
 * Вышли обнажённые манекены — на сайте детской школы плавания это нельзя,
 * и никакой правкой света это не лечится. Плоский силуэт снимает вопрос
 * целиком: шапочка и купальник читаются контуром, тела как такового нет.
 * Отклонённая серия не сохранена намеренно.
 *
 * ЧТО ДЕЛАЕТ СКРИПТ:
 *
 *   1. НАХОДИТ ЛИНИЮ ВОДЫ. В каждом рисунке она своя по высоте, а лечь она
 *      должна ровно туда же, где проходит линия в SVG-схеме поверх (y=50 из
 *      100). Ищется по левому краю: там, где нет тела, непрозрачен только
 *      этот тонкий штрих.
 *
 *   2. ДОБИВАЕТ ПОЛЯМИ ДО ЦЕНТРА. Не масштабирует и не режет — просто
 *      добавляет прозрачного сверху или снизу, чтобы линия оказалась на
 *      половине высоты. Так четыре рисунка встают в один ряд по воде, а не
 *      каждый по-своему.
 *
 *   3. ПЕРЕКРАШИВАЕТ. Модель выдаёт силуэт фирменным фиолетовым #4f017b, но
 *      лежит он на тёмной панели abyss-900, где почти сливается. Берётся
 *      только альфа, цвет заливается заново — заодно уходит вся случайная
 *      грязь по цвету, которой у плоской заливки быть не должно.
 *
 * ЗАПУСК: node scripts/make-stroke-art.mjs
 */

import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'media-source/brand/strokes';
const OUT = 'public/media/strokes';
const NAMES = ['freestyle', 'backstroke', 'breaststroke', 'butterfly'];

/* Панель показывается примерно в 420 px, берём двойную плотность с запасом. */
const WIDTH = 900;

/* Тон силуэта на тёмной панели: brand-400 — светлее фирменного и потому
   читается на abyss-900, но не спорит с лаймовой траекторией поверх. */
const TINT = { r: 0x9a, g: 0x3f, b: 0xd2 };

await mkdir(OUT, { recursive: true });

/**
 * Строка, на которой нарисована линия воды.
 *
 * ИЩЕТСЯ ПО ДОЛЕ НЕПРОЗРАЧНЫХ ПИКСЕЛЕЙ ВО ВСЕЙ СТРОКЕ, а не по левому краю.
 * Первая версия смотрела на узкую полосу слева, рассуждая, что тело туда не
 * дотягивается и непрозрачна там только линия. На деле у рисунков по краям
 * прозрачные поля: линия занимает 95% ширины и до самого края не доходит,
 * и проверка не находила вообще ничего.
 *
 * Тело тоже бывает длинным, поэтому одной доли мало. Строки с долей выше
 * порога собираются в сплошные отрезки, и берётся САМЫЙ ТОНКИЙ: линия — это
 * штрих в несколько пикселей, а любая полоса тела кратно толще.
 */
async function waterLineRow(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const wide = [];
  for (let y = 0; y < info.height; y++) {
    let opaque = 0;
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 40) opaque++;
    }
    if (opaque > info.width * 0.8) wide.push(y);
  }
  if (!wide.length) return null;

  const runs = [];
  let run = [wide[0]];
  for (const y of wide.slice(1)) {
    if (y === run[run.length - 1] + 1) run.push(y);
    else {
      runs.push(run);
      run = [y];
    }
  }
  runs.push(run);

  const line = runs.reduce((a, b) => (b.length < a.length ? b : a));
  return Math.round((line[0] + line[line.length - 1]) / 2);
}

/*
  ДВА ПРОХОДА, А НЕ ОДИН.

  Первый выравнивает линию воды по центру каждого рисунка, второй добивает
  все четыре до общей высоты. Без второго прохода холсты выходят разными
  (от 535 до 763 при ширине 900) — а значит, при `object-contain` в панели
  одного размера четыре пловца встанут в разном масштабе, и переключение
  вкладок будет прыгать.

  Общая высота берётся максимальная: так ни одна фигура не обрезается, а
  лишнее поле прозрачно и ничего не стоит.
*/
const centred = [];

for (const name of NAMES) {
  const file = `${SRC}/${name}.png`;
  const meta = await sharp(file).metadata();
  const line = await waterLineRow(file);

  if (line === null) {
    throw new Error(
      `${name}: линия воды не найдена — рисунок сделан не по промту из docs/brand-prime-orca.md`,
    );
  }

  const above = line;
  const below = meta.height - line;

  const buffer = await sharp(file)
    .ensureAlpha()
    .extend({
      top: Math.max(0, below - above),
      bottom: Math.max(0, above - below),
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize({ width: WIDTH })
    .toBuffer();

  const size = await sharp(buffer).metadata();
  centred.push({ name, buffer, height: size.height, line, srcHeight: meta.height });
}

/*
  ТРЕТИЙ ШАГ: ОБРЕЗАТЬ ОБЩЕЕ ПУСТОЕ ПОЛЕ.

  После выравнивания по воде у каждого рисунка сверху и снизу остаётся запас,
  и у всех четырёх он разный. Взять просто максимум — значит оставить в панели
  широкую полосу пустоты над и под фигурой: в первой сборке фигура занимала
  примерно половину высоты блока и висела в середине.

  Поэтому считается объединённая рамка: самая верхняя и самая нижняя
  непрозрачные строки среди всех четырёх. Обрезается по ней — одинаково для
  всех, так что и выравнивание по воде, и общий масштаб сохраняются, а
  пустота уходит.
*/
async function opaqueBounds(buffer, height) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  let top = null;
  let bottom = null;
  for (let y = 0; y < height; y++) {
    let any = false;
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 20) {
        any = true;
        break;
      }
    }
    if (any) {
      if (top === null) top = y;
      bottom = y;
    }
  }
  return { top: top ?? 0, bottom: bottom ?? height - 1 };
}

const tallest = Math.max(...centred.map((c) => c.height));

/* приводим к общей высоте, чтобы рамки считались в одной системе координат */
for (const c of centred) {
  const pad = Math.round((tallest - c.height) / 2);
  c.buffer = await sharp(c.buffer)
    .extend({
      top: pad,
      bottom: tallest - c.height - pad,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  c.height = tallest;
}

const bounds = await Promise.all(
  centred.map((c) => opaqueBounds(c.buffer, tallest)),
);
/* поле в 3% высоты, чтобы фигура не упиралась в край панели */
const margin = Math.round(tallest * 0.03);
const cropTop = Math.max(0, Math.min(...bounds.map((b) => b.top)) - margin);
const cropBottom = Math.min(
  tallest,
  Math.max(...bounds.map((b) => b.bottom)) + margin,
);
const canvasHeight = cropBottom - cropTop;

for (const c of centred) {
  c.buffer = await sharp(c.buffer)
    .extract({ left: 0, top: cropTop, width: WIDTH, height: canvasHeight })
    .toBuffer();
  c.height = canvasHeight;
}

console.log(
  `общая рамка: ${tallest} → ${canvasHeight} px, срезано ${tallest - canvasHeight}`,
);

for (const { name, buffer, line, srcHeight } of centred) {
  /*
    Перекраска: альфа остаётся своей, цвет заливается сплошным. Композиция
    `dest-in` оставляет от заливки только то, что попало в непрозрачные
    пиксели исходника.
  */
  const buf = await sharp({
    create: {
      width: WIDTH,
      height: canvasHeight,
      channels: 4,
      background: { ...TINT, alpha: 1 },
    },
  })
    .composite([{ input: buffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(buf)
    .webp({ quality: 88, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);
  await sharp(buf).avif({ quality: 60, effort: 6 }).toFile(`${OUT}/${name}.avif`);

  const w = (await stat(`${OUT}/${name}.webp`)).size / 1024;
  const a = (await stat(`${OUT}/${name}.avif`)).size / 1024;
  console.log(
    `${name.padEnd(13)} вода ${line}/${srcHeight} → центр, ${WIDTH}×${canvasHeight}, webp ${w.toFixed(0)} KB, avif ${a.toFixed(0)} KB`,
  );
}

console.log(`
для разметки: width={${WIDTH}} height={${canvasHeight}}`);
