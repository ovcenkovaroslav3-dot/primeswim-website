/**
 * Обход всех страниц: ошибки, структура, битые ссылки.
 *
 * ЗАЧЕМ ОТДЕЛЬНО ОТ ТЕСТОВ. Тесты проверяют данные и инварианты файлов, а
 * здесь проверяется собранная страница в настоящем браузере — то, что видно
 * только когда разметка, стили и скрипты уже сошлись вместе:
 *
 *   • ошибки консоли и коды ответов;
 *   • боковая прокрутка на телефоне (375 px);
 *   • скачки уровней заголовков (h2 → h4);
 *   • картинки без alt, повторяющиеся id, ссылки без названия;
 *   • по одному h1, description и canonical на каждой странице;
 *   • каждая внутренняя ссылка отдаёт 200.
 *
 * Ничего из этого не ловится типами и не ловится тестами контента: сломать
 * можно правкой в компоненте, а увидеть — только на собранной странице.
 *
 * Проверяются 375 px, потому что узкий экран — самый строгий: боковая
 * прокрутка и налезания появляются там и почти никогда на десктопе.
 *
 * ЗАПУСК: npm run check:pages   (нужен поднятый `npm run dev`)
 */

import { chromium } from 'playwright';

const PAGES = ['/', '/raspisanie/', '/price/', '/trener/', '/bassein/', '/roditelyam/', '/galereya/', '/sorevnovaniya/', '/dogovor/', '/policy/', '/soglasie/'];
const BASE = 'http://localhost:3000';

const browser = await chromium.launch({ channel: 'chrome' });
const found = { console: [], overflow: [], headings: [], alt: [], dupIds: [], emptyLinks: [], links: new Map(), titles: [] };

for (const p of PAGES) {
  const page = await browser.newPage({ viewport: { width: 375, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 120)));

  const res = await page.goto(BASE + p, { waitUntil: 'load' });
  if (res.status() !== 200) found.console.push(`${p}: HTTP ${res.status()}`);
  await page.waitForTimeout(500);

  const r = await page.evaluate(() => {
    const out = {};
    out.over = document.documentElement.scrollWidth - innerWidth;
    out.title = document.title;
    out.desc = document.querySelector('meta[name="description"]')?.content ?? null;
    out.canonical = document.querySelector('link[rel="canonical"]')?.href ?? null;
    out.h1 = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 40));
    let prev = 0; out.jumps = [];
    for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
      const l = +h.tagName[1];
      if (prev && l > prev + 1) out.jumps.push(`h${prev}→h${l}: ${h.textContent.trim().slice(0, 30)}`);
      prev = l;
    }
    out.noAlt = [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null).length;
    const seen = new Set(); out.dups = [];
    for (const el of document.querySelectorAll('[id]')) { if (seen.has(el.id)) out.dups.push(el.id); seen.add(el.id); }
    out.empty = [...document.querySelectorAll('a[href]')].filter((a) => !(a.textContent || '').trim() && !a.getAttribute('aria-label') && !a.querySelector('img')?.alt).map((a) => a.getAttribute('href'));
    out.internal = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0]).filter(Boolean))];
    return out;
  });

  if (errs.length) found.console.push(`${p}: ${[...new Set(errs)].join(' | ')}`);
  if (r.over > 1) found.overflow.push(`${p}: +${r.over}px`);
  if (r.jumps.length) found.headings.push(`${p}: ${r.jumps.join(', ')}`);
  if (r.noAlt) found.alt.push(`${p}: ${r.noAlt} img без alt`);
  if (r.dups.length) found.dupIds.push(`${p}: ${[...new Set(r.dups)].join(', ')}`);
  if (r.empty.length) found.emptyLinks.push(`${p}: ${r.empty.join(', ')}`);
  if (r.h1.length !== 1) found.titles.push(`${p}: h1 ×${r.h1.length}`);
  if (!r.desc) found.titles.push(`${p}: нет description`);
  if (!r.canonical) found.titles.push(`${p}: нет canonical`);
  for (const l of r.internal) found.links.set(l, (found.links.get(l) ?? 0) + 1);
  await page.close();
}

/* каждая внутренняя ссылка должна отдавать 200 */
const page = await browser.newPage();
const broken = [];
for (const href of found.links.keys()) {
  const res = await page.goto(BASE + href, { waitUntil: 'commit' }).catch(() => null);
  if (!res || res.status() >= 400) broken.push(`${href} → ${res ? res.status() : 'нет ответа'}`);
}
await browser.close();

const report = (name, list) => console.log(`${name}: ${list.length ? '\n  ' + list.join('\n  ') : 'чисто'}`);
report('ошибки консоли и HTTP', found.console);
report('боковая прокрутка', found.overflow);
report('скачки заголовков', found.headings);
report('картинки без alt', found.alt);
report('повторы id', found.dupIds);
report('ссылки без названия', found.emptyLinks);
report('мета и h1', found.titles);
report('битые внутренние ссылки', broken);
console.log(`внутренних адресов проверено: ${found.links.size}`);
