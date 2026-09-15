/**
 * Бланк согласия на фото- и видеосъёмку: media-source/brand/soglasie-foto-a4.pdf
 *
 * ЗАЧЕМ. Статья 152.1 ГК разрешает обнародовать изображение гражданина только
 * с его согласия, за несовершеннолетнего — с согласия законного представителя.
 * В галерее сайта двадцать фотографий и три видео с узнаваемыми детьми, и
 * согласий на них нет. Это не штраф надзора, а иск и требование удалить — риск
 * персональный и неприятный.
 *
 * Собрать согласия нечем: устная договорённость на бортике доказательством не
 * является, а форма нужна такая, чтобы её можно было подписать за минуту между
 * занятиями. Отсюда лист — один, А4, с полями от руки.
 *
 * ТЕКСТ ВЗЯТ ИЗ ДОГОВОРА ДОСЛОВНО. В подписываемом договоре уже есть отдельный
 * лист согласия (см. `photoConsent` в src/content/dogovor.ts), и формулировки
 * берутся оттуда, а не пишутся заново: два разных текста про одно и то же — это
 * вопрос «а какой из них я подписывал».
 *
 * ЧТО ЭТОТ БЛАНК НЕ ЗАКРЫВАЕТ. Он про съёмку, которая будет. Кадры, уже
 * снятые и опубликованные, им не покрываются: там нужна другая формулировка
 * — про использование уже сделанных материалов, — и писать её должен юрист, а
 * не скрипт. Для старой галереи путей два: найти тех родителей или заменить
 * кадры. Разбор — в docs/legal-checklist.md, п. 2.4.
 *
 * ЗАПУСК: node scripts/make-consent-form.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

import { orcaMarkup, VIEW_BOX } from './lib/orca-path.mjs';
import { glyphsFrom, inlineGoogleFont } from './lib/google-font.mjs';

const OUT = 'media-source/brand/soglasie-foto-a4.pdf';

/*
  Строка в одинарных кавычках. Экранирование намеренно не учитывается:
  текст согласия — русские фразы с кавычками-ёлочками, апострофов в нём
  нет и быть не может. Простое выражение читается с одного взгляда, а
  сложное пришлось бы проверять.
*/
const STRING_LITERAL = /'([^']*)'/g;

/*
  Площадка и тренер берутся из данных сайта разбором, а не пишутся здесь:
  сменится тренер — бланк догонит сайт сам. Выражения узкие и падают громко.
*/
const contacts = await readFile('src/content/contacts.ts', 'utf8');
const venue = contacts.match(/venue:\s*'([^']+)'/)?.[1];
const city = contacts.match(/city:\s*'([^']+)'/)?.[1];
const operator = contacts.match(/operator:\s*'([^']+)'/)?.[1];
const ogrnip = contacts.match(/ogrnip:\s*'([^']+)'/)?.[1];
if (!venue || !city || !operator || !ogrnip) {
  throw new Error(
    'В src/content/contacts.ts не найдены venue, city, operator или ogrnip — бланк не знает, кому даётся согласие.',
  );
}

/*
  Формулировки согласия — из того же файла, что и страница договора. Разойтись
  бумага и сайт не могут.
*/
const dogovor = await readFile('src/content/dogovor.ts', 'utf8');
const consentBlock = dogovor.slice(dogovor.indexOf('export const photoConsent'));

/*
  Берётся ровно массив `clauses`, а не весь блок. Сначала выбирались все строки
  подряд — и в бланк попадала ещё и подпись `note`, дословно повторяя строку под
  заголовком. Одно и то же дважды на листе, который подписывают, читается
  небрежностью.
*/
const from = consentBlock.indexOf('clauses: [');
const clausesSource = consentBlock.slice(from, consentBlock.indexOf(']', from));
const clauses = [...clausesSource.matchAll(STRING_LITERAL)].map((m) => m[1]);

if (clauses.length < 2) {
  throw new Error(
    'В src/content/dogovor.ts не разобрался photoConsent — бланк остался бы без текста согласия.',
  );
}

const TEXT = {
  school: 'PRIME SWIM',
  tagline: 'Школа плавания для детей',
  place: `${venue}, ${city}`,
  title: 'Согласие на фото- и видеосъёмку',
  lead: `Отдельный лист к договору на оказание услуг по плаванию. Подписывается по желанию и на условия занятий не влияет.`,
  clauses,
  fieldsTitle: 'Кто даёт согласие',
  parent: 'Фамилия, имя, отчество родителя или законного представителя',
  child: 'Фамилия и имя ребёнка',
  birth: 'Дата рождения ребёнка',
  operator,
  /*
    Кому даётся согласие — обязательная часть, а не подпись для красоты.
    Согласие без указания того, кто вправе снимать и публиковать, не согласие:
    непонятно, кого оно связывает и с кого спрашивать при отзыве.
  */
  given: `Согласие даётся: ${operator}, ОГРНИП ${ogrnip}. Место проведения занятий: ${venue}, ${city}.`,
  revoke:
    'Отозвать согласие можно в любой момент — письменным заявлением Исполнителю или сообщением тренеру. Отзыв на занятия не влияет.',
  sign: 'Подпись',
  date: 'Дата',
  nbsp: ' ',
};

const interFace = await inlineGoogleFont(
  'Inter',
  400,
  glyphsFrom([
    ...Object.values(TEXT).flat().filter((v) => typeof v === 'string'),
  ]),
);

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap" rel="stylesheet">
<style>${interFace}</style>
<style>
  @page { size: A4 portrait; margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:210mm;height:297mm;background:#fff;color:#16101f;
       font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden}

  .sheet{position:relative;height:100%;padding:18mm 20mm 16mm;
         display:flex;flex-direction:column}

  .brand{display:flex;align-items:center;gap:4mm}
  .brand svg{width:12mm}
  .brand .name{font-family:Unbounded,sans-serif;font-weight:800;font-size:5.6mm;
       letter-spacing:-.02em;color:#4f017b}
  .brand .sub{margin-left:auto;font-size:3.1mm;color:#6b6377;text-align:right;line-height:1.35}

  h1{font-family:Unbounded,sans-serif;font-weight:800;font-size:8.4mm;
     letter-spacing:-.01em;color:#4f017b;margin-top:12mm;line-height:1.1}

  .lead{margin-top:4mm;font-size:3.6mm;line-height:1.5;color:#6b6377;max-width:150mm}

  .clauses{margin-top:9mm;padding-top:7mm;border-top:.3mm solid #e6dcf0}
  .clauses p{font-size:4mm;line-height:1.55;color:#2c2438}
  .clauses p + p{margin-top:4mm}

  .fields{margin-top:11mm;flex:1}
  .fields h2{font-size:3mm;letter-spacing:.18em;text-transform:uppercase;
             color:#6b6377;font-weight:500}

  .row{margin-top:9mm}
  .rule{height:11mm;border-bottom:.35mm solid #16101f}
  .hint{margin-top:1.4mm;font-size:3mm;color:#9b93a6}

  .pair{display:flex;gap:12mm;margin-top:9mm}
  .pair > div{flex:1}

  .revoke{margin-top:8mm;font-size:3.2mm;line-height:1.5;color:#6b6377;
          border-left:.8mm solid #d5a9f2;padding-left:5mm}

  .given{margin-top:auto;padding-top:9mm;font-size:3.2mm;line-height:1.5;
         color:#6b6377;border-top:.3mm solid #e6dcf0}

  .foot{margin-top:9mm;display:flex;gap:12mm;align-items:flex-end}
  .foot > div{flex:1}
  .foot .rule{height:9mm}
</style></head><body>
  <div class="sheet">
    <div class="brand">
      <svg viewBox="0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}" fill="none">
        ${orcaMarkup({ body: '#4f017b', field: '#ffffff' })}
      </svg>
      <span class="name">PRIME&nbsp;SWIM</span>
      <span class="sub">${TEXT.tagline}<br>${TEXT.place}</span>
    </div>

    <h1>${TEXT.title}</h1>
    <p class="lead">${TEXT.lead}</p>

    <div class="clauses">
      ${TEXT.clauses.map((c) => `<p>${c}</p>`).join('')}
    </div>

    <div class="fields">
      <h2>${TEXT.fieldsTitle}</h2>

      <div class="row">
        <div class="rule"></div>
        <p class="hint">${TEXT.parent}</p>
      </div>

      <div class="pair">
        <div>
          <div class="rule"></div>
          <p class="hint">${TEXT.child}</p>
        </div>
        <div style="flex:0 0 52mm">
          <div class="rule"></div>
          <p class="hint">${TEXT.birth}</p>
        </div>
      </div>

      <p class="revoke">${TEXT.revoke}</p>

      <p class="given">${TEXT.given}</p>

      <div class="foot">
        <div>
          <div class="rule"></div>
          <p class="hint">${TEXT.sign}</p>
        </div>
        <div style="flex:0 0 52mm">
          <div class="rule"></div>
          <p class="hint">${TEXT.date}</p>
        </div>
      </div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
/* вьюпорт по размеру листа: иначе предпросмотр снимается шире страницы */
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const pdf = await page.pdf({ format: 'A4', printBackground: true });
const preview = await page.screenshot({ fullPage: true });
await browser.close();

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, pdf);
await writeFile(OUT.replace('.pdf', '.html'), html);
await writeFile(OUT.replace('.pdf', '-preview.png'), preview);

console.log(`${OUT} — A4, ${Math.round(pdf.length / 1024)} KB`);
console.log(`оператор: ${operator} · площадка: ${TEXT.place}`);
