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

/*
  ФАЗЫ ГРЕБКА. У стиля может быть одна картинка, а может быть цикл из
  нескольких: первая лежит как <id>.png, остальные — в phases/<id>-2.png и
  дальше. Скрипт собирает всё, что найдёт, и складывает кадры в общую систему
  координат — иначе при перелистывании фигура прыгала бы по панели.

  Почему кадры, а не видео и не трёхмерная модель: и то и другое на этой
  странице стоило бы мегабайтов и просмотрщика, а покадровая смена силуэта
  даёт то же движение за десяток килобайт и без единой строки JavaScript.
*/
const MAX_PHASES = 8;

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
/** Все файлы стиля по порядку: основной кадр, затем фазы. */
async function phaseFiles(name) {
  const files = [`${SRC}/${name}.png`];
  for (let i = 2; i <= MAX_PHASES; i++) {
    const file = `${SRC}/phases/${name}-${i}.png`;
    try {
      await stat(file);
      files.push(file);
    } catch {
      break;
    }
  }
  return files;
}

const centred = [];

for (const name of NAMES) {
  for (const [index, file] of (await phaseFiles(name)).entries()) {
  const meta = await sharp(file).metadata();
  const line = await waterLineRow(file);

  if (line === null) {
    throw new Error(
      `${file}: линия воды не найдена — рисунок сделан не по промту из docs/brand-prime-orca.md`,
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
  centred.push({
    name,
    phase: index + 1,
    buffer,
    height: size.height,
    line,
    srcHeight: meta.height,
  });
  }
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

/*
  ОБРЕЗКА СИММЕТРИЧНА ОТНОСИТЕЛЬНО ЦЕНТРА, И ЭТО НЕ ПРИДИРКА.

  Первая версия резала по фактическим границам: сверху до самой верхней
  непрозрачной строки, снизу до самой нижней. Границы эти несимметричны —
  у кроля рука уходит высоко, у брасса ноги низко, — и вместе с полем
  срезалось выравнивание, сделанное шагом раньше: линия воды переставала
  проходить по центру. На панели это было видно сразу, потому что поверх
  лежит лаймовая волна, и она оказывалась заметно выше линии в рисунке.

  Теперь берётся наибольший отступ от центра в обе стороны, и рамка
  строится от него. Поля чуть больше, зато линия воды остаётся ровно
  посередине у всех четырёх.
*/
const centre = Math.round(tallest / 2);
/* поле в 3% высоты, чтобы фигура не упиралась в край панели */
const margin = Math.round(tallest * 0.03);
const reach = Math.max(
  ...bounds.map((b) => Math.max(centre - b.top, b.bottom - centre)),
);
const half = Math.min(centre, reach + margin);
const cropTop = centre - half;
const canvasHeight = half * 2;

/*
  ПРЯМАЯ ЛИНИЯ ВОДЫ СТИРАЕТСЯ, КОГДА ОТРАБОТАЛА.

  В исходных рисунках уровень воды нарисован тонкой прямой на всю ширину —
  по ней скрипт и выравнивает четыре стиля между собой. К этому моменту
  выравнивание сделано, и прямая больше не нужна: на панели поверх лежит
  живая волна (`.stroke-waterline` в globals.css), а две линии рядом дают
  ровно то, от чего волну заводили — прямая читается чертёжной осью.

  Просто обнулить полосу нельзя: силуэт — это одна альфа, и в ней прямая
  ничем не отличается от тела пловца, которое её пересекает. Поэтому полоса
  залечивается по соседним строкам: где сверху и снизу тело — остаётся тело,
  где пусто — становится пусто. Та же логика, что у delogo в сборке роликов.
*/
/*
  Полоса ищется в готовом холсте, а не берётся по центру.

  Сначала её и правда считали центральной строкой — выравнивание же ведётся
  по ней. Замер показал, что это неверно: у кроля она на 390-й строке, у
  спины на 284-й, у брасса на 377-й. Стирание по центру промахивалось мимо
  полосы и при этом выгрызало куски из пловца. Поэтому строка определяется
  по самому холсту: прямая на всю ширину — единственное, что заполняет
  больше двух третей строки.
*/
function findLineRows(data, height) {
  const share = [];
  for (let y = 0; y < height; y++) {
    let opaque = 0;
    for (let x = 0; x < WIDTH; x++) {
      if (data[(y * WIDTH + x) * 4 + 3] > 8) opaque++;
    }
    share.push(opaque / WIDTH);
  }

  let peak = -1;
  for (let y = 0; y < height; y++) {
    if (share[y] > 0.85 && (peak === -1 || share[y] > share[peak])) peak = y;
  }
  if (peak === -1) return null;

  let top = peak;
  let bottom = peak;
  while (top > 0 && share[top - 1] > 0.85) top--;
  while (bottom < height - 1 && share[bottom + 1] > 0.85) bottom++;
  return { top, bottom };
}

async function eraseWaterLine(buffer, height, name) {
  const { data } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const found = findLineRows(data, height);
  if (!found) {
    throw new Error(
      `${name}: прямая линия воды не найдена в собранном холсте — стирать нечего, проверьте исходник`,
    );
  }

  /*
    ПОЛОСА ЗАМЕЩАЕТСЯ СОСЕДНИМ МАТЕРИАЛОМ, А НЕ ВЫРЕЗАЕТСЯ.

    Первая версия стирала полосу там, где выше и ниже неё пусто, и оставляла
    там, где с обеих сторон тело. Правило выглядит разумным ровно до первого
    случая, когда край тела совпадает с линией: сверху пусто, снизу тело —
    значит «стереть», и из пловца выкусывается полоса во всю ширину. На
    баттерфляе так и вышло: три строки в ноль, фигура разрезана поперёк.

    Теперь верхняя половина полосы берёт альфу строкой выше, нижняя — строкой
    ниже. Граница материала восстанавливается с точностью до пикселя, а
    вырезать тело такое правило не может в принципе.
  */
  /*
    Полоса расширяется на две строки в каждую сторону. У линии сглаженные
    края: они не дотягивают до порога, по которому она ищется, но остаются
    полупрозрачной тенью через всю ширину. Без запаса они переживали стирание
    и читались провалом в фигуре — замер ловил его у трёх стилей из четырёх.
  */
  const BLEED = 2;
  const top = Math.max(0, found.top - BLEED);
  const bottom = Math.min(height - 1, found.bottom + BLEED);
  const above = Math.max(0, top - 1);
  const below = Math.min(height - 1, bottom + 1);
  const split = (top + bottom) / 2;

  for (let x = 0; x < WIDTH; x++) {
    const fromAbove = data[(above * WIDTH + x) * 4 + 3];
    const fromBelow = data[(below * WIDTH + x) * 4 + 3];
    for (let y = top; y <= bottom; y++) {
      data[(y * WIDTH + x) * 4 + 3] = y <= split ? fromAbove : fromBelow;
    }
  }

  return sharp(data, { raw: { width: WIDTH, height, channels: 4 } })
    .png()
    .toBuffer();
}

for (const c of centred) {
  c.buffer = await sharp(c.buffer)
    .extract({ left: 0, top: cropTop, width: WIDTH, height: canvasHeight })
    .toBuffer();
  c.buffer = await eraseWaterLine(c.buffer, canvasHeight, c.name);
  c.height = canvasHeight;
}

console.log(
  `общая рамка: ${tallest} → ${canvasHeight} px, срезано ${tallest - canvasHeight}, линия воды по центру`,
);

for (const { name, phase, buffer, line, srcHeight } of centred) {
  /* первая фаза сохраняет прежнее имя: на неё ссылается тест и разметка */
  const slug = phase === 1 ? name : `${name}-${phase}`;
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
    .toFile(`${OUT}/${slug}.webp`);
  await sharp(buf).avif({ quality: 60, effort: 6 }).toFile(`${OUT}/${slug}.avif`);

  const w = (await stat(`${OUT}/${slug}.webp`)).size / 1024;
  const a = (await stat(`${OUT}/${slug}.avif`)).size / 1024;
  console.log(
    `${slug.padEnd(15)} вода ${line}/${srcHeight} → центр, ${WIDTH}×${canvasHeight}, webp ${w.toFixed(0)} KB, avif ${a.toFixed(0)} KB`,
  );
}

/* сводка по фазам — её переносят в PHASES в Strokes.tsx */
const counts = {};
for (const c of centred) counts[c.name] = (counts[c.name] ?? 0) + 1;
console.log('фаз у стилей:', JSON.stringify(counts));

console.log(`
для разметки: width={${WIDTH}} height={${canvasHeight}}`);
