/**
 * Снимок страницы через Playwright — основной инструмент визуальной проверки сайта.
 *
 * Почему не готовые скриншотилки:
 *  - панель браузера Claude Code не композитит кадры: IntersectionObserver молчит,
 *    ленивые картинки не грузятся, прокрутка не работает;
 *  - browse.exe и обычный `fullPage: true` захватывают страницу «виртуально»,
 *    без настоящих scroll-событий, поэтому секции с data-reveal остаются на
 *    opacity: 0, а блоки с content-visibility: auto не успевают отрисоваться;
 *  - на длинных страницах нативный fullPage в Chrome вдобавок склеивает кадр
 *    неверно — внизу оказывается копия шапки и первого экрана вместо подвала.
 *
 * Поэтому здесь: настоящий браузер, настоящая прокрутка, снимок собирается из
 * кадров вьюпорта и сшивается по фактическому scrollY.
 *
 * Запуск:
 *   node scripts/shot.mjs <url> [файл.png] [--mobile] [--width=N] [--height=N]
 *                              [--viewport] [--native] [--chromium]
 *
 * Примеры:
 *   node scripts/shot.mjs http://localhost:3000 shot.png
 *   node scripts/shot.mjs https://www.primeswim.ru home-mobile.png --mobile
 *   node scripts/shot.mjs http://localhost:3000/lager/ top.png --viewport
 */

import { chromium, devices } from 'playwright';
import sharp from 'sharp';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : fallback;
};

const url = positional[0] ?? 'http://localhost:3000';
const out = positional[1] ?? 'shot.png';
const mobile = flags.has('--mobile');
const viewportOnly = flags.has('--viewport');

const viewport = {
  width: opt('width', mobile ? 390 : 1440),
  height: opt('height', mobile ? 844 : 900),
};
const dpr = opt('dpr', mobile ? 3 : 2);

// Нужен настоящий браузер, а не дефолтный headless-shell: тот композитит иначе.
// Каналы перебираются по порядку — на этой машине сборка chromium из поставки
// Playwright не стартует («side-by-side configuration is incorrect»),
// рабочий вариант — системный Chrome.
const channels = flags.has('--chromium') ? ['chromium'] : ['chromium', 'chrome', 'msedge'];
let browser;
let used;
for (const channel of channels) {
  try {
    browser = await chromium.launch({ channel });
    used = channel;
    break;
  } catch (e) {
    if (channel === channels.at(-1)) throw e;
  }
}

const context = await browser.newContext({
  viewport,
  deviceScaleFactor: dpr,
  ...(mobile ? { isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent } : {}),
});
const page = await context.newPage();

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

// 'load', а не 'networkidle': Метрика держит соединение открытым и сеть
// никогда не «затихает» — ожидание networkidle отваливается по таймауту.
await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(600);

// У сайта scroll-behavior: smooth — прокрутка анимируется, и window.scrollY,
// прочитанный сразу после scrollTo, возвращает старую позицию. Из-за этого
// полосы склеиваются со сдвигом на шаг. Выключаем анимацию на время съёмки.
await page.addStyleTag({
  content: 'html, body, * { scroll-behavior: auto !important; }',
});

/** Настоящая прокрутка сверху донизу: будит IntersectionObserver и content-visibility. */
async function scrollThrough() {
  const step = Math.round(viewport.height * 0.8);
  for (let y = 0; ; y += step) {
    const done = await page.evaluate((top) => {
      window.scrollTo(0, top);
      return top >= document.documentElement.scrollHeight - window.innerHeight;
    }, y);
    await page.waitForTimeout(320);
    if (done) break;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

await scrollThrough();

// Шрифты и картинки — иначе снимок ловит момент до подстановки.
await page.evaluate(() => document.fonts.ready);
await page
  .waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 20_000 })
  .catch(() => {});

const stats = await page.evaluate(() => ({
  reveal: document.querySelectorAll('[data-reveal], .reveal').length,
  revealIn: document.querySelectorAll('.reveal-in, .is-in').length,
  brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
  height: document.documentElement.scrollHeight,
}));

if (viewportOnly) {
  await page.screenshot({ path: out });
} else if (flags.has('--native')) {
  await page.screenshot({ path: out, fullPage: true });
} else {
  // Сшивка: кадры вьюпорта на фактических позициях прокрутки.
  // Первый кадр — как есть (со скрытой шапкой и плашками), дальше липкие и
  // фиксированные слои прячем, иначе они повторятся на каждой полосе.
  const tiles = [await page.screenshot()];
  const offsets = [0];

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed' || pos === 'sticky') el.style.visibility = 'hidden';
    }
  });

  for (let y = viewport.height; y < stats.height; y += viewport.height) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(250);
    // scrollY читаем отдельным вызовом, уже после паузы: в одном evaluate
    // со scrollTo он вернёт позицию до прокрутки.
    const at = await page.evaluate(() => window.scrollY);
    tiles.push(await page.screenshot());
    offsets.push(at);
    if (at + viewport.height >= stats.height) break;
  }

  await sharp({
    create: {
      width: viewport.width * dpr,
      height: stats.height * dpr,
      channels: 4,
      background: '#ffffff',
    },
  })
    .composite(tiles.map((input, i) => ({ input, top: Math.round(offsets[i] * dpr), left: 0 })))
    .png()
    .toFile(out);
}

await browser.close();

console.log(
  `${out} — ${used}, ${viewport.width}×${viewport.height}${mobile ? ' mobile' : ''}, страница ${stats.height}px`,
);
console.log(
  `reveal-блоки: ${stats.revealIn}/${stats.reveal} проявлено, битых картинок: ${stats.brokenImages}`,
);
if (errors.length) console.log(`ошибки в консоли (${errors.length}):\n  ${errors.slice(0, 10).join('\n  ')}`);
