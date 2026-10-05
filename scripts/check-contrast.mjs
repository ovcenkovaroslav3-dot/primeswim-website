/**
 * Проверка контраста текста по WCAG AA на всех страницах сайта.
 *
 * Запуск (dev-сервер должен работать): node scripts/check-contrast.mjs
 * Или: npm run check:contrast
 *
 * ГЛАВНАЯ ЛОВУШКА, РАДИ КОТОРОЙ СКРИПТ И СУЩЕСТВУЕТ. Tailwind v4 собирает
 * прозрачности через `color-mix(in oklab, ...)`, и getComputedStyle отдаёт
 * результат строкой вида `oklab(0.999 0.00004 0.00002 / 0.7)`. Ни наивный
 * разбор чисел, ни canvas этого не берут:
 *
 *   • разбор строкой принимает 0.999 за красный канал — весь текст
 *     оказывается почти чёрным, и проверка выдаёт сотню несуществующих
 *     нарушений;
 *   • canvas на незнакомом значении НЕ бросает ошибку, а молча оставляет
 *     прежний fillStyle. Отладить это тяжелее всего: цифры выглядят
 *     правдоподобно и все до одной неверны.
 *
 * Поэтому oklab и oklch переводятся в sRGB здесь, формулой Оттоссона.
 * Первый прогон 13 сентября 2026 по наивному разбору дал 101 «нарушение»,
 * по верному — четыре, и все четыре оказались настоящими.
 *
 * ЧТО ИСКЛЮЧЕНО ИЗ ПРОВЕРКИ И ПОЧЕМУ:
 *   • подписи поверх фотографий — подложка не однотонная, считать не по чему;
 *   • ловушка для ботов — уведена за край экрана, её никто не видит.
 */

import { chromium } from 'playwright';
const base = 'http://localhost:3000';
const pages = ['/', '/raspisanie/', '/price/', '/trener/', '/bassein/', '/roditelyam/', '/galereya/', '/sorevnovaniya/', '/dogovor/', '/policy/'];
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const seen = new Map();
for (const p of pages) {
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const bad = await page.evaluate(() => {
    /*
      Chrome отдаёт цвета, полученные из прозрачностей Tailwind, в oklab() —
      это и есть форма, в которой вычисляется color-mix(in oklab, ...).
      Ни строковый разбор, ни canvas их не берут: canvas на неизвестном
      значении молча оставляет прежний fillStyle, и весь замер уезжает в
      чёрный. Поэтому oklab переводится в sRGB здесь, по формуле Оттоссона.
    */
    const srgb = (v) => {
      v = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
      return Math.max(0, Math.min(255, Math.round(v * 255)));
    };
    const oklabToRgb = (L, A, B) => {
      const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
      const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
      const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
      return [
        srgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        srgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        srgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
      ];
    };
    const rgba = (css) => {
      if (!css || css === 'transparent') return [0, 0, 0, 0];
      if (css.startsWith('#')) {
        const n = parseInt(css.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
      }
      const nums = (css.match(/-?[\d.]+(?:e-?\d+)?/g) || []).map(Number);
      if (css.startsWith('oklab')) {
        const [L, A, B] = nums;
        const a = css.includes('/') ? nums[3] : 1;
        return [...oklabToRgb(L, A, B), a === undefined ? 1 : a];
      }
      if (css.startsWith('oklch')) {
        const [L, C, H] = nums;
        const a = css.includes('/') ? nums[3] : 1;
        const rad = (H * Math.PI) / 180;
        return [...oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad)), a === undefined ? 1 : a];
      }
      return [nums[0], nums[1], nums[2], nums[3] === undefined ? 1 : nums[3]];
    };
    const lum = ([r, g, b]) => {
      const f = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
    };
    /** Фон — первый предок с непрозрачной заливкой, полупрозрачные слои по пути смешиваются. */
    const bgOf = (el) => {
      let acc = null;
      for (let n = el; n; n = n.parentElement) {
        const c = rgba(getComputedStyle(n).backgroundColor);
        if (c[3] === 0) continue;
        acc = acc === null ? c : acc.map((v, i) => (i < 3 ? v * acc[3] + c[i] * (1 - acc[3]) : 1));
        if (acc[3] >= 0.99) return acc.slice(0, 3);
      }
      return acc ? acc.slice(0, 3) : [255, 255, 255];
    };
    const out = [];
    for (const el of document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, dt, dd, label, button, figcaption, strong, em, td, th')) {
      if (!el.textContent?.trim() || el.children.length) continue;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity < 0.1) continue;

      /*
        Текст только для программ чтения не меряем.

        Приём `sr-only` прячет строку не прозрачностью и не display, а
        обрезкой в один пиксель: clip-path плюс размер 1×1. Глазами такой
        текст не виден вовсе, и его цвет ни на что не влияет — а проверка
        честно считала контраст и требовала 4.5. Поймалось на кнопке
        воспроизведения: подпись «Смотреть: …» унаследовала тёмные чернила
        светлой секции поверх тёмной карточки ролика. Правило здесь было бы
        ложным: чинить нечего, видимого текста нет.
      */
      const box = el.getBoundingClientRect();
      if (box.width <= 1 || box.height <= 1) continue;
      if (st.clipPath && st.clipPath !== 'none') continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      // текст поверх фотографии посчитать нечем — подложка не однотонная
      if (el.closest('figcaption') || el.closest('.zoom-frame')) continue;
      // ловушка для ботов уведена за экран — её никто не видит и не должен
      if (b.left < -1000 || b.right < 0) continue;
      const fg = rgba(st.color);
      const bg = bgOf(el);
      const mixed = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
      const L1 = lum(mixed), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(st.fontSize);
      const large = size >= 24 || (size >= 18.66 && +st.fontWeight >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need) {
        out.push({ r: +ratio.toFixed(2), need, size: Math.round(size), w: st.fontWeight,
          txt: el.textContent.trim().slice(0, 30),
          fg: `rgb(${mixed.map(Math.round).join(',')})`, bg: `rgb(${bg.map(Math.round).join(',')})` });
      }
    }
    return out;
  });
  for (const b of bad) {
    const key = `${b.fg}|${b.bg}|${b.size}`;
    if (seen.has(key)) { seen.get(key).n++; continue; }
    seen.set(key, { ...b, n: 1, page: p });
  }
  await page.close();
}
const rows = [...seen.values()].sort((a, b) => a.r - b.r);
for (const b of rows) {
  console.log(`${String(b.r).padStart(5)} (нужно ${b.need})  ${String(b.size).padStart(2)}px/${b.w}  ${b.fg.padEnd(20)} на ${b.bg.padEnd(16)} ×${b.n}  «${b.txt}»  ${b.page}`);
}
console.log(rows.length ? `\nразных сочетаний ниже AA: ${rows.length}` : '\nвсё проходит WCAG AA');
await browser.close();
