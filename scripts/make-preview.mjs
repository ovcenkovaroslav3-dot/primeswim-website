/**
 * Собирает автономную HTML-страницу превью из реальной разметки и стилей сайта.
 * Изображения встраиваются как data-URI, скрипты вырезаются — файл открывается
 * где угодно без запуска сервера.
 *
 * Запуск (dev-сервер должен работать): node scripts/make-preview.mjs <выходной-файл>
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ORIGIN = 'http://localhost:3000';
const PUBLIC_DIR = path.resolve('public');
const out = process.argv[2] ?? 'preview.html';

/** Уменьшает картинку и возвращает data-URI в формате WebP. */
async function toDataUri(publicPath, width) {
  const file = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ''));
  const buf = await sharp(file)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

/** Достаёт исходный путь из ссылки вида /_next/image?url=%2Fmedia%2F...&w=640 */
function originalPath(nextImageUrl) {
  const q = nextImageUrl.split('?')[1] ?? '';
  const url = new URLSearchParams(q).get('url');
  return url && url.startsWith('/media/') ? url : null;
}

const html = await fetch(ORIGIN).then((r) => r.text());

// 1. Собираем стили в один <style>
const cssHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
  (m) => m[1],
);
let css = '';
for (const href of cssHrefs) {
  css += await fetch(new URL(href, ORIGIN)).then((r) => r.text());
  css += '\n';
}

// Шрифты Next хранит локально — заменяем на Google Fonts, доступные в превью.
css = css.replace(/url\(\/_next\/static\/media\/[^)]+\)/g, 'local("Inter")');

let body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>') + 7);

// 2. Вырезаем скрипты: превью статическое
body = body.replace(/<script[\s\S]*?<\/script>/g, '');
body = body.replace(/<template[\s\S]*?<\/template>/g, '');

// 3. Встраиваем изображения
const seen = new Map();
const srcMatches = [...body.matchAll(/src="(\/_next\/image\?[^"]+)"/g)];

for (const [, rawSrc] of srcMatches) {
  const decoded = rawSrc.replace(/&amp;/g, '&');
  const orig = originalPath(decoded);
  if (!orig) continue;

  if (!seen.has(orig)) {
    // Первый экран крупнее, остальное мельче — держим общий вес разумным
    const width = orig.includes('/hero/') ? 900 : 700;
    seen.set(orig, await toDataUri(orig, width));
    process.stdout.write(`встроено: ${orig}\n`);
  }
  body = body.split(`src="${rawSrc}"`).join(`src="${seen.get(orig)}"`);
}

// srcSet и sizes убираем: источник один и он уже встроен.
// Флаг i обязателен — Next выводит атрибут как srcSet с заглавной S.
body = body.replace(/\ssrcset="[^"]*"/gi, '');
body = body.replace(/\ssizes="[^"]*"/gi, '');

/** Полоса-пояснение: в превью формы и меню не работают. */
const notice = `<div style="background:#24003a;color:#fff;font:500 14px/1.5 Inter,system-ui,sans-serif;padding:12px 20px;text-align:center">
  <strong style="color:#c7fe03">Статичное превью</strong>
  — так выглядит новый сайт. Формы и меню здесь не работают: это снимок вёрстки, а не рабочая версия.
</div>`;

const page = `<title>Превью сайта PRIME SWIM</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${css}
:root { --font-unbounded: 'Unbounded'; --font-inter: 'Inter'; }
/* Сайт светлый по замыслу: фон и цвет текста задаём явно,
   чтобы страница не подхватила тёмную тему просмотрщика. */
body { font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #191524; }
.font-display, h1, h2, h3, h4 { font-family: 'Unbounded', system-ui, sans-serif; }
/* Липкая шапка в превью мешает — отключаем */
header.sticky { position: static; }
</style>
${body.replace(/(<body[^>]*>)/, `$1${notice}`)}`;

await writeFile(out, page, 'utf8');
const kb = Math.round(Buffer.byteLength(page) / 1024);
console.log(`\nГотово: ${out} (${kb} КБ)`);
