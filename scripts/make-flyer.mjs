/**
 * Листовка PRIME SWIM, A4: media-source/brand/flyer-a4.pdf
 *
 * Клеится на входы школ, читают её на ходу с метра-двух.
 *
 * Это не уменьшенный ролл-ап: A4 почти вдвое ниже по пропорции (1:1,41
 * против 1:2,35), поэтому та же иерархия переложена плотнее — знак →
 * «школа плавания» → заголовок → пловец → шесть преимуществ в два столбца →
 * запись с телефоном и адресом рядом с QR. Адрес нужен здесь и не нужен на
 * стенде: стенд стоит в бассейне, листовка — на улице.
 *
 * QR тот же, что на стенде (qr-primeswim-rollup.svg) — так решил владелец.
 *
 * Важное лежит не ближе 9 мм к краю: офисный принтер не печатает 4–5 мм по
 * краю, и фон там обрежется белым, а текст — нет.
 *
 * ЗАПУСК:
 *   PHOTO=путь/к/фото.jpg node scripts/make-flyer.mjs
 * BLEED=3 — вылеты под нож для типографии (лист 216×303 мм).
 * LIME=#accf11 — печатный лайм для перевода в CMYK, см. scripts/lib/print-brand.mjs.
 * DPI=300 — PNG в натуральный размер для scripts/print-cmyk.py.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

import {
  COPY,
  FIT_SCRIPT,
  PERK_ICONS,
  SCREEN_LIME,
  brandFonts,
  loadContacts,
  loadLogo,
  loadPhoto,
  svgIcon,
  withLime,
} from './lib/print-brand.mjs';

const PHOTO = process.env.PHOTO ?? 'media-source/brand/rollup-swimmer.jpg';
const DPI = Number(process.env.DPI ?? 150);
const W = 210; // мм
const H = 297;
const B = Number(process.env.BLEED ?? 0);
const LIME = process.env.LIME ?? SCREEN_LIME;
const PW = W + 2 * B;
const PH = H + 2 * B;
const OUT = `media-source/brand/flyer-a4${B ? `-bleed${B}` : ''}${LIME === SCREEN_LIME ? '' : '-print'}.pdf`;

const c = await loadContacts();
const TEXT = {
  ...COPY,
  phone: c.phone,
  address: `${c.venue} · ${c.city}, ${c.street}`,
};

const photo = await loadPhoto(PHOTO);
const logo = await loadLogo();
const qr = (await readFile('media-source/brand/qr-primeswim-rollup.svg', 'utf8'))
  .replace('<svg ', '<svg class="qr-code" ');
const fonts = await brandFonts(Object.values(TEXT).flat());

/*
  Фото уже, чем лист: в полную ширину лицо пловца заняло бы треть высоты и
  вытеснило бы преимущества. Края кадра растворяются в фоне маской.
*/
const PHOTO_W = 196;
const PHOTO_H = Math.round((PHOTO_W * 4) / 3);
const PHOTO_TOP = 30;

const markup = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>PRIME SWIM — листовка A4</title>
<style>${fonts}</style>
<style>
  @page { size: ${PW}mm ${PH}mm; margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --abyss:#0b0114; --abyss-900:#180229;
    --brand:#4f017b; --lime:#c7fe03; --ink:#16101f;
  }
  html,body{width:${PW}mm;height:${PH}mm}
  body{position:relative;overflow:hidden;color:#fff;background:var(--abyss-900);
       font-family:Manrope,system-ui,sans-serif;
       -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sheet{position:absolute;left:${B}mm;top:${B}mm;width:${W}mm;height:${H}mm}

  .bg{position:absolute;inset:-${B}mm;
      background:
        radial-gradient(120% 34% at 50% 0%, #6a0aa3 0%, var(--brand) 40%, transparent 78%),
        linear-gradient(180deg, var(--brand) 0mm, var(--abyss-900) 110mm, var(--abyss) 210mm, var(--abyss-900) 260mm, var(--brand) ${H + B}mm)}
  .photo{position:absolute;left:${(W - PHOTO_W) / 2}mm;top:${PHOTO_TOP}mm;width:${PHOTO_W}mm;height:${PHOTO_H}mm;
         background:url(${photo}) center/cover no-repeat;
         -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 26%,#000 70%,transparent 86%),
                            linear-gradient(90deg,transparent 0%,#000 14%,#000 86%,transparent 100%);
         -webkit-mask-composite:source-in;mask-composite:intersect}

  .safe{position:absolute;left:12mm;right:12mm}

  .logo{position:absolute;left:50%;transform:translateX(-50%);top:10mm;width:84mm;height:auto}
  .school{top:58mm;text-align:center;font-weight:800;font-size:4.8mm;letter-spacing:.32em;
          text-transform:uppercase;padding-left:.32em}
  .school::before,.school::after{content:"";display:inline-block;vertical-align:middle;
          width:10mm;height:.6mm;background:var(--lime);border-radius:1mm}
  .school::before{margin:0 3.5mm .4mm 0}
  .school::after{margin:0 0 .4mm calc(3.5mm - .32em)}

  h1{position:absolute;left:12mm;right:12mm;top:69mm;font-family:Unbounded,sans-serif;font-weight:800;
     text-transform:uppercase;line-height:.98;text-align:center}
  h1 span{display:block;white-space:nowrap}
  h1 .t2{color:var(--lime);margin-top:2.4mm}
  .lead{top:121mm;text-align:center;font-weight:700;font-size:4.4mm;line-height:1.24;
        text-wrap:balance;color:rgba(255,255,255,.92);text-shadow:0 .3mm 1.6mm rgba(11,1,20,.7)}

  /*
    Подложки плотные и без backdrop-filter: размытие под стеклом в PDF из
    Chrome не попадает — урок ролл-апа.
  */
  .perks{top:216mm;padding:3.4mm 4.5mm;border-radius:5mm;
         background:linear-gradient(180deg,rgba(24,2,41,.86),rgba(24,2,41,.94));
         border:.35mm solid rgba(255,255,255,.14);
         display:grid;grid-template-columns:1fr 1fr;gap:2.4mm 4mm}
  .perk{display:flex;align-items:center;gap:2.2mm;min-width:0}
  .perk .ic{flex:none;width:8mm;height:8mm;border-radius:50%;display:grid;place-items:center;
            background:rgba(199,254,3,.14);color:var(--lime)}
  .perk .ic svg{width:5.3mm;height:5.3mm}
  .perk p{font-weight:800;font-size:3.55mm;line-height:1.15;letter-spacing:-.01em}

  .cta{position:absolute;left:12mm;top:257mm;width:120mm;height:30mm;border-radius:5mm;
       background:var(--lime);color:var(--ink);padding:3.2mm 4mm 0;text-align:center}
  .cta .ask{font-family:Unbounded,sans-serif;font-weight:800;text-transform:uppercase;
            white-space:nowrap;line-height:1.05}
  .cta .tel{font-family:Unbounded,sans-serif;font-weight:800;white-space:nowrap;
            line-height:1;margin-top:1.8mm;color:var(--brand)}
  .cta .addr{display:flex;align-items:center;justify-content:center;gap:1.2mm;margin-top:2mm;
             font-weight:700;font-size:3mm;white-space:nowrap}
  .cta .addr svg{width:3.4mm;height:3.4mm;flex:none}

  /* QR — как на стенде: стекло, лаймовые уголки видоискателя, адрес сайта */
  .qr{position:absolute;right:12mm;top:257mm;width:62mm;height:30mm;border-radius:5mm;
      background:linear-gradient(180deg,rgba(24,2,41,.9),rgba(24,2,41,.96));
      border:.35mm solid rgba(255,255,255,.16);
      display:flex;align-items:center;gap:3mm;padding:2mm 3mm 2mm 2mm}
  .qr-frame{position:relative;flex:none;width:26mm;height:26mm;padding:1.3mm}
  .qr-frame i{position:absolute;width:5mm;height:5mm;border:0 solid var(--lime)}
  .qr-frame .tl{top:0;left:0;border-top-width:.6mm;border-left-width:.6mm;border-top-left-radius:1.6mm}
  .qr-frame .tr{top:0;right:0;border-top-width:.6mm;border-right-width:.6mm;border-top-right-radius:1.6mm}
  .qr-frame .bl{bottom:0;left:0;border-bottom-width:.6mm;border-left-width:.6mm;border-bottom-left-radius:1.6mm}
  .qr-frame .br{bottom:0;right:0;border-bottom-width:.6mm;border-right-width:.6mm;border-bottom-right-radius:1.6mm}
  .qr-tile{width:100%;height:100%;background:#fff;border-radius:1.3mm;padding:1.2mm}
  .qr-code{display:block;width:100%;height:100%}
  .qr-text{display:flex;flex-direction:column;align-items:flex-start;gap:1.6mm;min-width:0}
  .qr-label{display:flex;align-items:center;gap:1mm;font-weight:800;font-size:2.6mm;
            letter-spacing:.2em;text-transform:uppercase;color:var(--lime)}
  .qr-label::before{content:"";width:2.6mm;height:.4mm;border-radius:.2mm;background:var(--lime)}
  .qr-url{font-family:Unbounded,sans-serif;font-weight:800;white-space:nowrap;line-height:1}
  .qr-hint{font-weight:600;font-size:2.4mm;color:rgba(255,255,255,.75)}
</style></head><body><div class="sheet">
  <div class="bg"></div>
  <div class="photo"></div>

  ${logo}
  <div class="safe school">${TEXT.school}</div>
  <h1><span class="fit" data-w="172">${TEXT.title1}</span><span class="t2 fit" data-w="172">${TEXT.title2}</span></h1>
  <p class="safe lead">${TEXT.lead}</p>

  <div class="safe perks">
    ${TEXT.perks.map((t, i) => `<div class="perk"><span class="ic">${svgIcon(PERK_ICONS[i])}</span><p>${t}</p></div>`).join('')}
  </div>

  <div class="cta">
    <div class="ask fit" data-w="114">${TEXT.cta}</div>
    <div class="tel fit" data-w="114">${TEXT.phone}</div>
    <div class="addr">${svgIcon('pin')}${TEXT.address}</div>
  </div>
  <div class="qr">
    <div class="qr-frame"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>
      <div class="qr-tile">${qr}</div></div>
    <div class="qr-text">
      <div class="qr-label">${TEXT.qr}</div>
      <div class="qr-url fit" data-w="27.5">${TEXT.site}</div>
      <div class="qr-hint">${TEXT.qrHint}</div>
    </div>
  </div>

</div>
  ${FIT_SCRIPT}
</body></html>`;
const html = withLime(markup, LIME);

await mkdir('media-source/brand', { recursive: true });

const browser = await chromium.launch(
  process.env.CHROME ? { executablePath: process.env.CHROME } : {},
);
const pxW = Math.round((PW / 25.4) * 96);
const pxH = Math.round((PH / 25.4) * 96);

async function open(scale) {
  const p = await browser.newPage({ viewport: { width: pxW, height: pxH }, deviceScaleFactor: scale });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.fit());
  await p.waitForTimeout(300);
  return p;
}

const page = await open(1);
const pdf = await page.pdf({
  width: `${PW}mm`,
  height: `${PH}mm`,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});
await writeFile(OUT, pdf);
await writeFile(OUT.replace('.pdf', '.html'), html);

/* PNG в натуральный размер (DPI) — вход для перевода в CMYK, и превью */
const full = OUT.replace('.pdf', `-${DPI}dpi.png`);
await (await open(DPI / 96)).screenshot({ path: full });
await (await open(1)).screenshot({ path: OUT.replace('.pdf', '-preview.png') });
await browser.close();

console.log(`${OUT} — ${PW}×${PH} мм, ${(pdf.length / 1024 / 1024).toFixed(1)} MB`);
console.log(`${full} — ${Math.round((PW / 25.4) * DPI)}×${Math.round((PH / 25.4) * DPI)} px`);
