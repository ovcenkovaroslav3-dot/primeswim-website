/**
 * Обложка ссылки для соцсетей и мессенджеров: public/media/brand/og-cover.jpg.
 *
 * Это первое, что видит человек, когда ссылку на школу присылают в Telegram,
 * MAX или ВКонтакте, — раньше самого сайта. Поэтому карточка собирается из тех
 * же фактов и того же знака, что и первый экран, а не рисуется отдельно.
 *
 * ЧТО ИЗМЕНИЛОСЬ 13 сентября 2026. На прежней обложке стояло «Учим плавать
 * правильно: техника, уверенность, спортивный характер» — три слова, ни одно
 * из которых нельзя проверить и ни одно из которых не отличает эту школу от
 * любой другой. Справа было пустое поле с россыпью точек. Теперь там сказано,
 * для кого занятия, где именно и почём, а место занимает фирменный знак.
 *
 * ПОЧЕМУ БРАУЗЕР, А НЕ SHARP НАПРЯМУЮ. Заголовок набран Unbounded, тем же, что
 * и на первом экране. Отрисовщик SVG внутри sharp берёт только шрифты,
 * установленные в системе, — Unbounded там нет, и надпись молча подменялась бы
 * системным гротеском. Playwright тянет тот же файл с Google Fonts, что и сам
 * сайт, поэтому обложка и страница набраны одним шрифтом.
 *
 * ЗАПУСК: node scripts/make-og-cover.mjs
 */

import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const OUT = 'public/media/brand/og-cover.jpg';
const WIDTH = 1200;
const HEIGHT = 630;

/* Знак — тот же путь, что в src/components/OrcaMark.tsx (почему дублируется,
   сказано в scripts/make-brand-icons.mjs). */
const BODY =
  'M252 90C244 72 236 62 223 58c-11-4-23-5-33-4-14 1-24 0-32-2L134 9c-2-5-10-4-10 2l-2 41c-18 3-26 5-38 8-16 4-34 9-48 15L8 56c-5-3-9 2-6 7l15 25-15 25c-3 5 1 10 6 7l28-19c14 7 30 15 48 20 20 6 34 8 48 9 18 1 30-1 43-5 15-4 25-7 37-14 20-11 36-15 40-21Z';
const PECT = 'M196 118c-10 12-26 34-38 46-4 4-10 2-9-4 3-18 11-34 19-42Z';
const BELLY =
  'M252 90c-8 10-24 18-40 22-16 5-36 11-54 14-18 3-38 4-54 1-8-2-14-4-20-6v-13c10 3 24 5 38 5 18 0 38-3 56-8 24-7 62-21 74-29Z';

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;
       font-family:Inter,system-ui,sans-serif;color:#fff;
       background:#0b0114;position:relative}
  /* та же толща, что на первом экране: два световых пятна в тёмной воде */
  .glow-a{position:absolute;width:760px;height:760px;right:-180px;top:-260px;border-radius:50%;
          background:radial-gradient(circle,rgba(122,25,180,.62),transparent 62%);filter:blur(10px)}
  .glow-b{position:absolute;width:620px;height:620px;left:-200px;bottom:-320px;border-radius:50%;
          background:radial-gradient(circle,rgba(79,1,123,.75),transparent 64%)}
  /* знак целиком в кадре: обрезанный силуэт читается пятном, а не косаткой */
  .orca{position:absolute;right:26px;top:196px;width:540px;
        filter:drop-shadow(0 36px 64px rgba(0,0,0,.55))}
  .wrap{position:relative;padding:62px 64px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .kicker{font-size:19px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:500}
  h1{font-family:Unbounded,sans-serif;font-weight:800;font-size:60px;line-height:1.04;
     letter-spacing:-.02em;margin-top:22px;max-width:13ch}
  h1 .accent{color:#c7fe03}
  .lead{margin-top:20px;font-size:22px;line-height:1.45;color:rgba(255,255,255,.8);max-width:21ch}
  .facts{display:flex;gap:44px;align-items:flex-end}
  .fact b{display:block;font-size:30px;font-weight:400;letter-spacing:-.01em}
  .fact span{display:block;margin-top:4px;font-size:15px;color:rgba(255,255,255,.55)}
</style></head><body>
  <div class="glow-a"></div><div class="glow-b"></div>
  <svg class="orca" viewBox="-26 -26 316 228" fill="none">
    <g transform="rotate(-16 132 88)">
      <g fill="#150022"><path d="${BODY}"/><path d="${PECT}"/></g>
      <g fill="#fff"><path d="${BELLY}"/>
        <ellipse cx="212" cy="74" rx="15.5" ry="7" transform="rotate(-15 212 74)"/></g>
    </g>
  </svg>
  <div class="wrap">
    <div>
      <p class="kicker">PRIME SWIM · Химки</p>
      <h1>Плавание для детей от 7 лет — <span class="accent">бассейн МГИК</span></h1>
      <p class="lead">Обучаем с нуля, ставим технику четырёх стилей и готовим к соревнованиям.</p>
    </div>
    <div class="facts">
      <div class="fact"><b>от 850 ₽</b><span>занятие в абонементе</span></div>
      <div class="fact"><b>45 мин</b><span>тренировка</span></div>
      <div class="fact"><b>до 12</b><span>детей на дорожке</span></div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// шрифт успевает применится не к первому кадру — даём странице перерисоваться
await page.waitForTimeout(400);
const png = await page.screenshot({ type: 'png' });
await browser.close();

/*
  JPEG, а не PNG: карточку показывают Telegram, MAX и ВКонтакте, и у части из
  них есть потолок на вес. Качество 88 на градиентах ещё не даёт полос,
  а файл выходит примерно в шесть раз легче.
*/
const jpg = await sharp(png)
  .resize(WIDTH, HEIGHT)
  .jpeg({ quality: 88, progressive: true, mozjpeg: true })
  .toBuffer();
await writeFile(OUT, jpg);
console.log(`${OUT} — ${WIDTH}×${HEIGHT}, ${(jpg.length / 1024).toFixed(0)} KB`);
