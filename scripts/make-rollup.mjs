/**
 * Ролл-ап PRIME SWIM 85 × 200 см: media-source/brand/rollup-85x200.pdf
 *
 * Стенд в холле бассейна. Его читают на ходу с 3–5 метров, поэтому на листе
 * шесть вещей в строгом порядке: знак → «школа плавания» → заголовок → пловец
 * → четыре преимущества → запись и телефон. Мелкого текста нет: самая мелкая
 * строка набрана 26 мм, это читается с пяти метров.
 *
 * ПОЧЕМУ PDF. Текст и знак уходят в типографию вектором и остаются резкими на
 * любом увеличении; растр — только фотография. Шрифты вшиваются (см.
 * scripts/lib/google-font.mjs), поэтому у печатника макет не разъедется.
 *
 * ЗНАК — ВЕКТОР. prime-swim-logo-vector.svg оттрассирован из
 * public/media/brand/prime-swim-logo.jpg: исходный jpg на ширине 55 см дал бы
 * около 30 dpi, это мыло.
 *
 * ПАЛИТРА ПО СИСТЕМЕ САЙТА (src/app/globals.css): тёмная толща и фирменный
 * фиолетовый, лайм — только акцент на тёмном. Жёлтого нет.
 *
 * ЗОНЫ СТЕНДА. Верхние ~3 см уходят под планку, нижние ~8 см у многих
 * механизмов прячутся за основанием, по бокам — 5 см поля. Всё важное лежит
 * внутри этих границ.
 *
 * ЗАПУСК:
 *   PHOTO=путь/к/фото.jpg node scripts/make-rollup.mjs
 * Без PHOTO берётся media-source/brand/rollup-swimmer.jpg. Фото — вертикаль
 * 3:4, верхняя треть тёмная (под заголовок).
 * DPI=100 (по умолчанию) — разрешение PNG-превью в натуральный размер.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

import { glyphsFrom, inlineGoogleFont } from './lib/google-font.mjs';

const OUT = 'media-source/brand/rollup-85x200.pdf';
const PHOTO = process.env.PHOTO ?? 'media-source/brand/rollup-swimmer.jpg';
const DPI = Number(process.env.DPI ?? 100);
const W = 850; // мм
const H = 2000; // мм

async function pick(file, pattern, what) {
  const source = await readFile(file, 'utf8');
  const hit = source.match(pattern);
  if (!hit) throw new Error(`В ${file} не найдено: ${what}`);
  return hit[1];
}

/* телефон — из того же файла, что и сайт */
const phone = await pick(
  'src/content/contacts.ts',
  /display:\s*'([^']+)'/,
  'телефон',
);

const TEXT = {
  school: 'школа плавания',
  title1: 'Плавание',
  title2: 'для детей',
  lead: 'От первых уверенных движений в воде до соревнований и спортивных разрядов',
  perks: [
    'Обучаем всем 4 стилям плавания',
    'Подход к каждому ученику',
    'Соревнования и спортивные разряды',
    'Спортивные сборы и развитие результата',
  ],
  cta: 'Запишитесь на занятие',
  phone,
  site: 'primeswim.ru',
};

if (!existsSync(PHOTO)) throw new Error(`Нет фотографии: ${PHOTO}`);
const photoExt = PHOTO.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
const photo = `data:image/${photoExt};base64,${(await readFile(PHOTO)).toString('base64')}`;

const logo = (await readFile('media-source/brand/prime-swim-logo-vector.svg', 'utf8'))
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace('<svg ', '<svg class="logo" ');

const all = [...Object.values(TEXT).flat()];
const display = await inlineGoogleFont('Unbounded', 800, glyphsFrom(all));
const inter600 = await inlineGoogleFont('Inter', 600, glyphsFrom(all));
const inter700 = await inlineGoogleFont('Inter', 700, glyphsFrom(all));

/* иконки: одна толщина линии, один размер, лайм — как пиктограммы на сайте */
const icon = {
  strokes: `<path d="M6 34c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"/><path d="M6 44c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"/><circle cx="31" cy="11" r="5"/><path d="M12 24l10-6 8 5 10-6"/>`,
  person: `<circle cx="26" cy="14" r="7"/><path d="M12 44c0-9 6-15 14-15s14 6 14 15"/><path d="M37 8l3 3 6-7" />`,
  medal: `<path d="M17 4l9 15 9-15"/><circle cx="26" cy="32" r="13"/><path d="M26 25l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"/>`,
  growth: `<path d="M6 44h40"/><path d="M8 36l11-11 8 8 15-17"/><path d="M33 16h9v9"/>`,
};
const svgIcon = (body) =>
  `<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const perkIcons = [icon.strokes, icon.person, icon.medal, icon.growth];

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>PRIME SWIM — ролл-ап 85×200</title>
<style>${display}${inter600}${inter700}</style>
<style>
  @page { size: ${W}mm ${H}mm; margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --abyss:#0b0114; --abyss-900:#180229; --abyss-800:#260640;
    --brand:#4f017b; --brand-500:#7a19b4; --brand-400:#9a3fd2;
    --lime:#c7fe03; --ink:#16101f;
  }
  html,body{width:${W}mm;height:${H}mm}
  body{position:relative;overflow:hidden;color:#fff;
       font-family:Inter,system-ui,sans-serif;
       background:var(--abyss);
       -webkit-print-color-adjust:exact;print-color-adjust:exact}

  /* ── фон: фирменный фиолетовый сверху уходит в толщу ── */
  .bg{position:absolute;inset:0;
      background:
        radial-gradient(120% 40% at 50% 0%, #6a0aa3 0%, var(--brand) 35%, transparent 75%),
        linear-gradient(180deg, var(--brand) 0mm, var(--abyss-900) 700mm, var(--abyss) 1300mm, var(--abyss-900) 1700mm, var(--brand) ${H}mm);}

  /* ── фото: без рамки, растворяется в фоне сверху и снизу ── */
  .photo{position:absolute;left:0;width:${W}mm;top:430mm;height:${Math.round(W * 4 / 3)}mm;
         background:url(${photo}) center/cover no-repeat;
         -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 26%,#000 66%,transparent 92%);
                 mask-image:linear-gradient(180deg,transparent 0%,#000 26%,#000 66%,transparent 92%);}
  /* фиолетовый свет по краям кадра связывает фото с фоном */
  .tint{position:absolute;left:0;width:${W}mm;top:430mm;height:${Math.round(W * 4 / 3)}mm;
        background:
          radial-gradient(60% 45% at 0% 55%, rgba(122,25,180,.55), transparent 70%),
          radial-gradient(55% 40% at 100% 70%, rgba(79,1,123,.6), transparent 70%);
        mix-blend-mode:screen;opacity:.7}

  /* динамические линии: дорожки бассейна под углом, лайм — одна линия */
  .lanes{position:absolute;left:0;top:0;width:${W}mm;height:${H}mm}

  .safe{position:absolute;left:55mm;right:55mm}

  /* 1. знак */
  .logo{position:absolute;left:50%;transform:translateX(-50%);top:70mm;width:560mm;height:auto;
        filter:drop-shadow(0 4mm 10mm rgba(11,1,20,.35))}

  /* 2. школа плавания */
  .school{top:395mm;text-align:center;font-weight:700;font-size:40mm;letter-spacing:.32em;
          text-transform:uppercase;padding-left:.32em;color:#fff}
  .school::before,.school::after{content:"";display:inline-block;vertical-align:middle;
          width:46mm;height:2.2mm;background:var(--lime);margin:0 14mm 1.2mm 0;border-radius:2mm}
  .school::after{margin:0 0 1.2mm -.32em;margin-left:calc(14mm - .32em)}

  /* 3. заголовок */
  h1{position:absolute;left:55mm;right:55mm;top:500mm;font-family:Unbounded,sans-serif;font-weight:800;
     text-transform:uppercase;line-height:.98;letter-spacing:-.005em;text-align:center}
  h1 span{display:block;white-space:nowrap}
  h1 .t2{color:var(--lime)}
  .lead{top:735mm;text-align:center;font-weight:600;font-size:31mm;line-height:1.22;color:rgba(255,255,255,.92);
        text-wrap:balance;text-shadow:0 1mm 6mm rgba(11,1,20,.6)}

  /* 4. преимущества: стеклянная плашка поверх нижнего края фото */
  .perks{top:1318mm;padding:26mm 28mm;border-radius:22mm;
         background:linear-gradient(180deg,rgba(24,2,41,.78),rgba(24,2,41,.9));
         border:1.4mm solid rgba(255,255,255,.12);
         backdrop-filter:blur(6mm);display:flex;flex-direction:column;gap:18mm}
  .perk{display:flex;align-items:center;gap:18mm}
  .perk .ic{flex:none;width:58mm;height:58mm;border-radius:50%;display:grid;place-items:center;
            background:rgba(199,254,3,.12);color:var(--lime)}
  .perk .ic svg{width:38mm;height:38mm}
  .perk p{font-weight:700;font-size:28.5mm;white-space:nowrap;letter-spacing:-.01em;line-height:1.12;color:#fff}

  /* 5–6. запись: самый яркий блок листа */
  .cta{top:1708mm;background:var(--lime);color:var(--ink);border-radius:22mm;
       padding:26mm 30mm 24mm;text-align:center;box-shadow:0 8mm 24mm rgba(199,254,3,.18)}
  .cta .ask{font-family:Unbounded,sans-serif;font-weight:800;text-transform:uppercase;
            font-size:35mm;line-height:1.05;white-space:nowrap}
  .cta .tel{font-family:Unbounded,sans-serif;font-weight:800;white-space:nowrap;
            margin-top:12mm;line-height:1;color:var(--brand)}
  .site{top:1918mm;text-align:center;font-weight:600;font-size:26mm;letter-spacing:.08em;color:rgba(255,255,255,.85)}
</style></head><body>
  <div class="bg"></div>
  <div class="photo"></div>
  <div class="tint"></div>
  <svg class="lanes" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" fill="none">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".22"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="lime" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#c7fe03" stop-opacity="0"/>
        <stop offset=".35" stop-color="#c7fe03" stop-opacity=".95"/>
        <stop offset="1" stop-color="#c7fe03" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M-40 1290 C 220 1225, 560 1250, 900 1150" stroke="url(#fade)" stroke-width="2.2"/>
    <path d="M-40 1316 C 240 1255, 580 1285, 900 1182" stroke="url(#lime)" stroke-width="3.2"/>
    <path d="M-40 1342 C 260 1290, 600 1318, 900 1216" stroke="url(#fade)" stroke-width="1.6"/>
    <path d="M-40 440 C 260 470, 560 420, 900 455" stroke="url(#fade)" stroke-width="1.6"/>
  </svg>

  ${logo}
  <div class="safe school">${TEXT.school}</div>
  <h1><span class="t1 fit" data-w="740">${TEXT.title1}</span><span class="t2 fit" data-w="740">${TEXT.title2}</span></h1>
  <p class="safe lead">${TEXT.lead}</p>

  <div class="safe perks">
    ${TEXT.perks.map((t, i) => `<div class="perk"><span class="ic">${svgIcon(perkIcons[i])}</span><p>${t}</p></div>`).join('')}
  </div>

  <div class="safe cta">
    <div class="ask fit" data-w="680">${TEXT.cta}</div>
    <div class="tel fit" data-w="680">${TEXT.phone}</div>
  </div>
  <div class="safe site">${TEXT.site}</div>

  <script>
    /* строка подгоняется под ширину: заголовок и телефон — во всю колонку */
    const MM = 96 / 25.4;
    window.fit = () => document.querySelectorAll('.fit').forEach((el) => {
      el.style.display = 'inline-block';
      el.style.fontSize = '100mm';
      const k = (Number(el.dataset.w) * MM) / el.getBoundingClientRect().width;
      el.style.fontSize = 100 * k + 'mm';
      el.style.display = '';
    });
  </script>
</body></html>`;

await mkdir('media-source/brand', { recursive: true });

const browser = await chromium.launch(
  process.env.CHROME ? { executablePath: process.env.CHROME } : {},
);
const pxW = Math.round((W / 25.4) * 96);
const pxH = Math.round((H / 25.4) * 96);
const page = await browser.newPage({ viewport: { width: pxW, height: pxH } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => window.fit());
await page.waitForTimeout(400);

const pdf = await page.pdf({
  width: `${W}mm`,
  height: `${H}mm`,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});
await writeFile(OUT, pdf);
await writeFile(OUT.replace('.pdf', '.html'), html);

/* PNG в натуральный размер (DPI) и лёгкое превью */
const full = OUT.replace('.pdf', `-${DPI}dpi.png`);
const scale = DPI / 96;
const big = await browser.newPage({ viewport: { width: pxW, height: pxH }, deviceScaleFactor: scale });
await big.setContent(html, { waitUntil: 'load' });
await big.evaluate(() => document.fonts.ready);
await big.evaluate(() => window.fit());
await big.waitForTimeout(400);
await big.screenshot({ path: full, fullPage: false });

const small = await browser.newPage({ viewport: { width: pxW, height: pxH }, deviceScaleFactor: 0.25 });
await small.setContent(html, { waitUntil: 'load' });
await small.evaluate(() => document.fonts.ready);
await small.evaluate(() => window.fit());
await small.waitForTimeout(400);
await small.screenshot({ path: OUT.replace('.pdf', '-preview.png') });
await browser.close();

console.log(`${OUT} — ${W}×${H} мм, ${(pdf.length / 1024 / 1024).toFixed(1)} MB`);
console.log(`${full} — ${Math.round((W / 25.4) * DPI)}×${Math.round((H / 25.4) * DPI)} px`);
