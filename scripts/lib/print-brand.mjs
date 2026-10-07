/**
 * Общее для печатных материалов PRIME SWIM: ролл-ап, листовка A4.
 *
 * ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ. Преимущества, иконки, знак, шрифты и правило
 * печатного лайма нужны и стенду, и листовке. Две копии разъедутся при
 * первой правке формулировки — на стенде одно, на дверях школ другое.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { glyphsFrom, inlineGoogleFont } from './google-font.mjs';

/*
  Факты берутся из тех же файлов, что и сайт. Разбор регулярным выражением,
  а не импортом: скрипты запускаются на голом Node и TypeScript не читают.
  Выражение узкое и падает громко — молча подставить не то оно не может.
*/
export async function pick(file, pattern, what) {
  const source = await readFile(file, 'utf8');
  const hit = source.match(pattern);
  if (!hit) throw new Error(`В ${file} не найдено: ${what}`);
  return hit[1];
}

const CONTACTS = 'src/content/contacts.ts';

export async function loadContacts() {
  const [phone, venue, city, street] = await Promise.all([
    pick(CONTACTS, /display:\s*'([^']+)'/, 'телефон'),
    pick(CONTACTS, /venue:\s*'([^']+)'/, 'площадка'),
    pick(CONTACTS, /city:\s*'([^']+)'/, 'город'),
    pick(CONTACTS, /street:\s*'([^']+)'/, 'улица'),
  ]);
  return { phone, venue, city, street };
}

/** Тексты, одинаковые на всех носителях. */
export const COPY = {
  school: 'школа плавания',
  title1: 'Плавание',
  title2: 'для детей',
  lead: 'От первых уверенных движений в воде до соревнований и спортивных разрядов',
  perks: [
    'Обучаем всем 4 стилям плавания',
    'Подход к каждому ученику',
    'Соревнования и спортивные разряды',
    'Спортивные сборы и развитие результата',
    'Комьюнити единомышленников',
    'Система лояльности',
  ],
  cta: 'Запишитесь на занятие',
  site: 'primeswim.ru',
  qr: 'Наш сайт',
  qrHint: '← наведите камеру',
};

/* иконки: одна толщина линии, один размер, лайм — как пиктограммы на сайте */
const ICON = {
  strokes: `<path d="M6 34c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"/><path d="M6 44c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"/><circle cx="31" cy="11" r="5"/><path d="M12 24l10-6 8 5 10-6"/>`,
  person: `<circle cx="26" cy="14" r="7"/><path d="M12 44c0-9 6-15 14-15s14 6 14 15"/><path d="M37 8l3 3 6-7" />`,
  medal: `<path d="M17 4l9 15 9-15"/><circle cx="26" cy="32" r="13"/><path d="M26 25l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"/>`,
  growth: `<path d="M6 44h40"/><path d="M8 36l11-11 8 8 15-17"/><path d="M33 16h9v9"/>`,
  team: `<circle cx="26" cy="15" r="6"/><circle cx="11" cy="20" r="4.5"/><circle cx="41" cy="20" r="4.5"/><path d="M15 42c0-7 5-12 11-12s11 5 11 12"/><path d="M3 40c0-5 3-9 8-9"/><path d="M49 40c0-5-3-9-8-9"/>`,
  loyalty: `<rect x="5" y="11" width="42" height="30" rx="5"/><path d="M26 17.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z"/>`,
  pin: `<path d="M26 47s15-14 15-26a15 15 0 0 0-30 0c0 12 15 26 15 26z"/><circle cx="26" cy="21" r="5.5"/>`,
};

export const svgIcon = (name) =>
  `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

/** Иконки в порядке COPY.perks. */
export const PERK_ICONS = ['strokes', 'person', 'medal', 'growth', 'team', 'loyalty'];

/** Знак вектором, с классом для вёрстки. */
export async function loadLogo(className = 'logo') {
  return (await readFile('media-source/brand/prime-swim-logo-vector.svg', 'utf8'))
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace('<svg ', `<svg class="${className}" `);
}

/** Фото как data-URI: страница рисуется без сети и без путей. */
export async function loadPhoto(path) {
  if (!existsSync(path)) throw new Error(`Нет фотографии: ${path}`);
  const ext = path.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,${(await readFile(path)).toString('base64')}`;
}

/*
  Текст набран Manrope, а не Inter, как на сайте: на стенде Inter читался
  офисным. Manrope — геометрический гротеск с кириллицей, в паре с Unbounded
  даёт современный спортивный голос, и цифры у него ровные. Шрифты вшиваются
  подмножеством под переданные строки — разбор в google-font.mjs.
*/
export async function brandFonts(lines) {
  const glyphs = glyphsFrom(lines);
  const faces = await Promise.all([
    inlineGoogleFont('Unbounded', 800, glyphs),
    inlineGoogleFont('Manrope', 600, glyphs),
    inlineGoogleFont('Manrope', 700, glyphs),
    inlineGoogleFont('Manrope', 800, glyphs),
  ]);
  return faces.join('');
}

/*
  Лайм #c7fe03 лежит за охватом FOGRA39: любой интент профиля уводит его в
  жёлтый (C25 Y93, тон 62° вместо 73°). #accf11 профиль ISO Coated v2
  переводит в C40 M0 Y98 K0 — салатовый. Подменяется цвет в вёрстке, а не в
  готовом растре: края букв и полупрозрачные элементы пересчитываются вместе
  с ним, без ореолов.
*/
export const SCREEN_LIME = '#c7fe03';
export const PRINT_LIME = '#accf11';

export function withLime(html, lime) {
  const rgb = lime.match(/[0-9a-f]{2}/gi).map((h) => parseInt(h, 16)).join(',');
  return html.replaceAll(SCREEN_LIME, lime).replaceAll('199,254,3', rgb);
}

/* строка подгоняется под ширину data-w (мм): заголовок и телефон — во всю колонку */
export const FIT_SCRIPT = `<script>
  const MM = 96 / 25.4;
  window.fit = () => document.querySelectorAll('.fit').forEach((el) => {
    el.style.display = 'inline-block';
    el.style.fontSize = '100mm';
    const k = (Number(el.dataset.w) * MM) / el.getBoundingClientRect().width;
    el.style.fontSize = 100 * k + 'mm';
    el.style.display = '';
  });
</script>`;
