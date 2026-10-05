/**
 * Иконки приложения и фавикон из фирменного знака PRIME SWIM.
 *
 * ЗАЧЕМ СКРИПТ, А НЕ ГОТОВЫЕ ФАЙЛЫ. Иконок пять размеров плюс маскируемая,
 * и раньше они расходились между собой: буква стояла в разном масштабе и на
 * разном отступе, потому что каждую правили отдельно в редакторе. Здесь
 * геометрия одна на всех и лежит в коде — поменяется знак, пересоберутся все
 * шесть одной командой.
 *
 * ЧТО БЫЛО. Лаймовая буква «P» на фиолетовом. На 32 пикселях — а именно
 * столько занимает вкладка браузера — буква не отличает школу ни от чего:
 * в ряду вкладок это просто «П-образное пятно». Силуэт косатки на том же
 * размере читается как силуэт, то есть работает ровно там, где у буквы
 * работать нечем.
 *
 * ПОЧЕМУ ЗНАК ДВУХЦВЕТНЫЙ, А НЕ СПЛОШНОЙ БЕЛЫЙ. Сплошную заливку пробовали
 * первой — она проще и надёжнее на мелком размере, но на 32 пикселях читается
 * «рыба», и косатки в ней не остаётся. Опознаёт её белая полоса брюха: она
 * выживает и на 32, проверено сведением трёх размеров в один ряд. Поэтому
 * тело тёмное, поля белые, а цвет бренда берёт на себя подложка.
 *
 * ЗАПУСК: node scripts/make-brand-icons.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

import { BODY, PECT, BELLY } from './lib/orca-path.mjs';

const BRAND = '#4f017b';

/**
 * Квадрат с косаткой по центру.
 *
 * @param scale доля стороны, которую занимает знак по ширине. Для обычной
 *   иконки 0.78: знак почти во всё поле. Для маскируемой 0.54 — Android
 *   обрезает её по форме темы (круг, капля, скруглённый квадрат), и всё, что
 *   выходит за круг диаметром в 80% стороны, система вправе срезать.
 */
function svgIcon(size, scale) {
  // знак нарисован в 264×176; вписываем его ширину в долю стороны
  const k = (size * scale) / 264;
  const w = 264 * k;
  const h = 176 * k;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BRAND}"/>
  <g transform="translate(${x} ${y}) scale(${k})">
    <g transform="rotate(-12 132 88)">
      <g fill="#0b0114"><path d="${BODY}"/><path d="${PECT}"/></g>
      <g fill="#ffffff">
        <path d="${BELLY}"/>
        <ellipse cx="212" cy="74" rx="15.5" ry="7" transform="rotate(-15 212 74)"/>
      </g>
    </g>
  </g>
</svg>`;
}

const targets = [
  { file: 'src/app/icon.png', size: 48, scale: 0.82 },
  { file: 'src/app/apple-icon.png', size: 180, scale: 0.76 },
  { file: 'public/media/brand/icon-192.png', size: 192, scale: 0.78 },
  { file: 'public/media/brand/icon-512.png', size: 512, scale: 0.78 },
  { file: 'public/media/brand/icon-maskable-512.png', size: 512, scale: 0.54 },
];

for (const { file, size, scale } of targets) {
  await mkdir(dirname(file), { recursive: true });
  const png = await sharp(Buffer.from(svgIcon(size, scale)))
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(file, png);
  console.log(`${file} — ${size}×${size}, знак на ${Math.round(scale * 100)}%`);
}
