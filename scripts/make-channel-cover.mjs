/**
 * Обложка сообщества для каналов школы: media-source/brand/channel-cover-*.jpg
 *
 * ЗАЧЕМ. Сайт зовёт в Telegram, MAX и ВКонтакте с верхней панели каждой
 * страницы — это самая частая ссылка наружу. Родитель, который по ней уходит,
 * попадает на оформление, собранное до нынешнего вида сайта: другой шрифт,
 * другой рисунок, косатки нет вовсе. Переход выглядит как переход в другую
 * школу, причём ровно в тот момент, когда человек уже заинтересовался.
 *
 * АВАТАР ЗДЕСЬ НЕ СОБИРАЕТСЯ, И ЭТО НЕ ПРОПУСК. Он уже есть —
 * public/media/brand/icon-512.png из make-brand-icons.mjs: тот же знак на
 * фирменном фиолетовом, которым помечены вкладка браузера и приложение. В круг,
 * которым все три площадки режут аватар, он входит с запасом: рисунок целиком
 * укладывается в радиус 128 из 264 единиц знака, то есть в 38% стороны против
 * 50% у вписанной окружности. Заводить второй файл с тем же знаком значило бы
 * завести второе место, где его правят, — а расходиться такие копии начинают
 * молча.
 *
 * РАЗМЕР 1920×768 — тот, что ВКонтакте называет в своей справке по оформлению
 * сообщества. Площадки обрезают обложку по-своему и по-разному на телефоне и на
 * компьютере, поэтому всё, что нужно прочитать, стоит в середине: по краям
 * оставлено по 190 px, снизу — 200 px под имя и аватар, которыми ВКонтакте
 * накрывает левый нижний угол.
 *
 * ЗАПУСК: node scripts/make-channel-cover.mjs
 */

import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const WIDTH = 1920;
const HEIGHT = 768;
const OUT = 'media-source/brand/channel-cover-1920x768.jpg';

/*
  Подпись берётся из контента сайта, а не пишется здесь заново: обложка
  обещает то же, что и первый экран, и разъехаться они не могут.
*/
const contacts = await readFile('src/content/contacts.ts', 'utf8');
const venue = contacts.match(/venue:\s*'([^']+)'/)?.[1];
const city = contacts.match(/city:\s*'([^']+)'/)?.[1];
if (!venue || !city) {
  throw new Error(
    'В src/content/contacts.ts не найдены venue и city — обложка не знает, что подписывать.',
  );
}

/*
  Прайми вшивается в страницу файлом. Playwright открывает разметку из строки,
  у неё нет своего адреса, и относительные ссылки ей не от чего считать.
*/
const praimi = await readFile('public/media/mascot/orca-3d.webp');
const praimiUri = `data:image/webp;base64,${praimi.toString('base64')}`;

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;position:relative;
       background:#180229;font-family:Inter,system-ui,sans-serif;color:#fff}

  /*
    Свет из-за фигуры, а не градиент по всему полю: на плоской заливке
    вырезанная косатка висит наклейкой, а мягкое пятно за ней ставит её в
    пространство. Один источник, без вторых слоёв.
  */
  .glow{position:absolute;top:-12%;right:0%;width:1180px;height:1180px;
        background:radial-gradient(circle, #4f017b 0%, rgba(79,1,123,0) 66%)}

  /*
    Хвост уходит за нижний край, голова — целиком в кадре. Порядок именно
    такой: силуэт, обрезанный по голове, читается пятном, а обрезанный по
    хвосту — движением. Ту же ошибку уже ловили на обложке ссылки.
  */
  .praimi{position:absolute;top:5%;right:-3%;height:112%;
          filter:drop-shadow(0 40px 60px rgba(11,1,20,.55))}

  .text{position:absolute;left:190px;top:50%;transform:translateY(-58%);
        max-width:900px}

  .word{font-family:Unbounded,sans-serif;font-weight:800;font-size:112px;
        letter-spacing:-.03em;line-height:1;white-space:nowrap}
  .word .b{color:#c7fe03}

  /* лайм только здесь и в слове SWIM: на тёмном это акцент, а не заливка */
  .rule{width:132px;height:5px;background:#c7fe03;margin:34px 0 30px;border-radius:3px}

  .lead{font-size:38px;line-height:1.35;color:rgba(255,255,255,.86);font-weight:500}
  .place{margin-top:14px;font-size:30px;color:rgba(255,255,255,.62)}
</style></head><body>
  <div class="glow"></div>
  <img class="praimi" src="${praimiUri}" alt="">
  <div class="text">
    <div class="word">PRIME<span class="b">SWIM</span></div>
    <div class="rule"></div>
    <div class="lead">Плавание для детей от 7 лет</div>
    <div class="place">${venue}, ${city}</div>
  </div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const png = await page.screenshot({ type: 'png' });
await browser.close();

await mkdir(path.dirname(OUT), { recursive: true });
await sharp(png).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile(OUT);

/* заодно кадр для предпросмотра в разговоре — те же пиксели, вдвое меньше */
await sharp(png).resize({ width: 960 }).png().toFile(OUT.replace('.jpg', '-preview.png'));

console.log(`${OUT} — ${WIDTH}×${HEIGHT}`);
console.log(`подпись: ${venue}, ${city}`);
