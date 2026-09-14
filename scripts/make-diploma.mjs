/**
 * Бланк диплома PRIME SWIM: media-source/brand/diploma-a4.pdf
 *
 * Школа возит детей на старты и выдаёт свои награды — бриф называет дипломы
 * прямо. Это бланк под заполнение от руки: имя, за что, дата, подпись.
 *
 * ПОЧЕМУ PDF, А НЕ КАРТИНКА. Картинку печатают с потерями и не правят. PDF из
 * браузера несёт текст вектором: он остаётся резким на любом принтере, а
 * шрифт вшивается в файл, поэтому бланк одинаков на чужом компьютере. Плюс
 * исходник остаётся здесь — поменять формулировку можно одной строкой и
 * пересобрать.
 *
 * ЛАЙМА НА БЛАНКЕ НЕТ, И ЭТО ПО СИСТЕМЕ. Правило палитры: на светлом акцент
 * фиолетовый, лайм живёт только на тёмном (шапка globals.css). Бланк белый —
 * значит весь акцент фиолетовый. Заодно это экономит краску: сплошную
 * заливку домашний принтер печатает и долго, и бледно, а по краю почти все
 * принтеры не печатают вовсе.
 *
 * ЛИНЕЙКИ ДЛЯ ЗАПОЛНЕНИЯ — НАСТОЯЩИЕ. Высота строк подобрана под письмо от
 * руки: 11 мм под имя, 9 мм под остальное. Тонкая линия не мешает писать
 * поверх, а пунктир мешает.
 *
 * ЗАПУСК: node scripts/make-diploma.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

import { orcaMarkup, VIEW_BOX } from './lib/orca-path.mjs';

const OUT = 'media-source/brand/diploma-a4.pdf';

/*
  Имя тренера и площадка берутся из тех же файлов, что и сайт. Разбор
  регулярным выражением, а не импортом: скрипт запускается на голом Node и
  TypeScript не читает. Выражение узкое и падает громко — молча подставить
  не то оно не может.
*/
async function pick(file, pattern, what) {
  const source = await readFile(file, 'utf8');
  const hit = source.match(pattern);
  if (!hit) throw new Error(`В ${file} не найдено: ${what}`);
  return hit[1];
}

const coach = await pick(
  'src/content/coaches.ts',
  /name:\s*'([^']+)'/,
  'имя тренера',
);
const venue = await pick(
  'src/content/contacts.ts',
  /venue:\s*'([^']+)'/,
  'название площадки',
);
const city = await pick(
  'src/content/contacts.ts',
  /city:\s*'([^']+)'/,
  'город',
).catch(() => 'Химки');

/*
  ТЕКСТЫ БЛАНКА СОБРАНЫ В ОДНО МЕСТО, И НЕ РАДИ ПОРЯДКА.

  Из них же строится набор букв для шрифта (ниже). Пока строки лежали прямо
  в разметке, а список букв рядом — руками, они разошлись на первой же
  сборке: часть знаков в подмножество не попала, эти буквы выпали в подмену,
  и браузер вшил в PDF системный Segoe UI вместо Inter. Молча.

  Теперь источник один: что написано на бланке, то и просится у Google.
*/
const TEXT = {
  tagline: 'Школа плавания для детей',
  place: `${venue}, ${city}`,
  award: 'Награждается',
  nameHint: 'фамилия и имя',
  deedHint: 'за что — достижение, дистанция, место',
  year: '20',
  yearSuffix: 'г.',
  coachRole: `${coach}, тренер`,
  /*
    Неразрывный пробел стоит в строке даты между прочерками. В наборе букв
    его не было — в остальных строках пробелы обычные, — и один-единственный
    знак падал в подмену, утаскивая за собой в PDF системный Segoe UI.
    Поэтому он перечислен явно, а не подразумевается.
  */
  nbsp: ' ',
};

/*
  INTER ЗАБИРАЕТСЯ ПОДМНОЖЕСТВОМ ПОД КОНКРЕТНЫЕ БУКВЫ, И ЭТО НЕ ЭКОНОМИЯ.

  Обычным способом он в PDF не попадает: Google отдаёт Inter переменным
  шрифтом, а экспорт PDF из браузера переменные не вкладывает. Unbounded
  вкладывается — он приходит одним начертанием. На машине без Inter мелкий
  текст подменился бы, то есть бланк выглядел бы по-разному у разных людей.

  Параметр `text=` возвращает статическое подмножество ровно под переданные
  знаки — такое вкладывается. Набор берётся из TEXT выше, поэтому пропустить
  букву нельзя: добавили слово на бланк — оно само попало в запрос.

  Прописные добавляются отдельно, и это не перестраховка. Часть строк выводится
  через `text-transform: uppercase`: в исходнике «Награждается», на листе
  «НАГРАЖДАЕТСЯ». Подмножество приходит ровно по запрошенным знакам, прописных
  в нём не было, и вся строка целиком уезжала в системный Segoe UI — при этом
  на экране разница почти не видна, а в PDF вкладывался чужой шрифт.
*/
const interHref =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400' +
  '&text=' +
  encodeURIComponent(
    [
      ...new Set(
        Object.values(TEXT)
          .flatMap((line) => [line, line.toUpperCase()])
          .join(''),
      ),
    ]
      .sort()
      .join(''),
  );

/*
  ШРИФТ ВШИВАЕТСЯ В СТРАНИЦУ ФАЙЛОМ, А НЕ ПОДКЛЮЧАЕТСЯ ССЫЛКОЙ.

  Подключённый ссылкой Inter в страницу загружается и применяется — это
  проверено, `document.fonts.check` отвечает утвердительно. Но в PDF он всё
  равно не попадал: экспорт подменял его локальным Segoe UI и вкладывал уже
  его. Чужой системный шрифт в раздаваемом файле — и вид разъезжается, и
  лицензия сомнительна.

  Скачанный и вшитый как data-URI файл экспорт вкладывает как свой. Побочно
  это делает сборку устойчивее: на отрисовке сеть уже не нужна, а Google
  запрашивается один раз, здесь.
*/
async function inlineInter() {
  const chromeUa =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120 Safari/537.36';
  const css = await (
    await fetch(interHref, { headers: { 'user-agent': chromeUa } })
  ).text();
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error('Google не отдал файл шрифта — проверьте запрос');
  const font = Buffer.from(await (await fetch(url)).arrayBuffer());
  return `@font-face{font-family:'Inter';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');}`;
}

const interFace = await inlineInter();

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap" rel="stylesheet">
<style>${interFace}</style>
<style>
  @page { size: A4 landscape; margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:297mm;height:210mm;background:#fff;color:#16101f;
       font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden}

  /* знак в углу поля: бледный, крупный, никогда не под текстом целиком */
  /* знак целиком в поле: обрезанный краем силуэт читается пятном, а не
     косаткой — ту же ошибку уже ловили на обложке ссылки */
  /*
    Знак уведён вниз и притушен: на прошлой сборке он лежал прямо под
    линейками, и поверх него предстояло писать от руки. Водяной знак не
    должен спорить с тем, ради чего бланк существует.
  */
  .watermark{position:absolute;left:50%;transform:translateX(-50%);
             bottom:14mm;width:98mm;opacity:.05}

  /* колонка на всю высоту: поля расходятся вниз, а не жмутся к заголовку */
  .sheet{position:relative;height:100%;padding:16mm 22mm 14mm;
         display:flex;flex-direction:column}
  /*
    Поля прижаты к заголовку, а не разогнаны по остатку высоты. При
    выравнивании по центру между «Награждается» и первой линейкой
    оставалось полторы строки пустоты, и подпись переставала относиться
    к полю под ней.
  */
  .fields{flex:1;display:flex;flex-direction:column;gap:11mm;padding-top:8mm}

  /* рамка не по краю листа: принтеры не печатают ближе 5 мм, а линия,
     обрезанная краем, выглядит браком печати, а не решением */
  .frame{position:absolute;inset:8mm;border:.6mm solid #4f017b;border-radius:3mm}
  .frame::after{content:'';position:absolute;inset:2.2mm;border:.2mm solid #d5a9f2;border-radius:1.6mm}

  .brand{position:relative;display:flex;align-items:center;gap:4mm}
  .brand svg{width:13mm}
  .brand .name{font-family:Unbounded,sans-serif;font-weight:800;font-size:6.4mm;
       letter-spacing:-.02em;color:#4f017b}
  .brand .sub{margin-left:auto;font-size:3.3mm;color:#6b6377;text-align:right;line-height:1.35}

  h1{font-family:Unbounded,sans-serif;font-weight:800;font-size:18mm;letter-spacing:.02em;
     color:#4f017b;text-align:center;margin-top:9mm;line-height:1}

  .lead{text-align:center;margin-top:4mm;font-size:4mm;color:#6b6377;letter-spacing:.18em;text-transform:uppercase}

  .line{border-bottom:.35mm solid #16101f}
  .line--name{height:16mm}
  .line--wide{height:14mm}
  /*
    Подпись под линейкой, а не заголовок над ней: двухбуквенное «ЗА» с
    трекингом читалось опечаткой, а не меткой. Все поля теперь подписаны
    одинаково — мелко и снизу, как в бланке.
  */
  .hint{margin-top:1.4mm;margin-bottom:2mm;font-size:3mm;color:#9b93a6}

  .foot{position:relative;margin-top:4mm;display:flex;
        align-items:flex-end;justify-content:space-between;gap:12mm;font-size:3.5mm;color:#4a4356}
  .foot .sign{width:78mm;text-align:center}
  .foot .sign .rule{height:8mm;border-bottom:.35mm solid #16101f}
  .foot .sign .who{margin-top:1.6mm;font-size:3mm;color:#6b6377}
  .foot .place{max-width:80mm;line-height:1.45}
  .foot .date .rule{display:inline-block;width:8mm;border-bottom:.35mm solid #16101f}
</style></head><body>
  <svg class="watermark" viewBox="-26 -26 ${VIEW_BOX.width + 52} ${VIEW_BOX.height + 52}" fill="none">
    ${orcaMarkup({ body: '#4f017b', tilt: -16 })}
  </svg>

  <div class="frame"></div>

  <div class="sheet">
    <div class="brand">
      <svg viewBox="0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}" fill="none">
        ${orcaMarkup({ body: '#4f017b', field: '#ffffff' })}
      </svg>
      <span class="name">PRIME&nbsp;SWIM</span>
      <span class="sub">${TEXT.tagline}<br>${TEXT.place}</span>
    </div>

    <h1>ДИПЛОМ</h1>

    <p class="lead">${TEXT.award}</p>

    <div class="fields">
      <div>
        <div class="line line--name"></div>
        <p class="hint">${TEXT.nameHint}</p>
      </div>
      <div>
        <div class="line line--wide"></div>
        <div class="line line--wide"></div>
        <p class="hint">${TEXT.deedHint}</p>
      </div>
    </div>

    <div class="foot">
      <div class="place">
        ${TEXT.place}<br>
        <span class="date"><span class="rule"></span>&nbsp;<span class="rule"></span>&nbsp;${TEXT.year}<span class="rule"></span>&nbsp;${TEXT.yearSuffix}</span>
      </div>
      <div class="sign">
        <div class="rule"></div>
        <div class="who">${TEXT.coachRole}</div>
      </div>
    </div>
  </div>
</body></html>`;

await mkdir('media-source/brand', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
/* шрифт применяется не к первому кадру — даём странице перерисоваться */
await page.waitForTimeout(400);

const pdf = await page.pdf({
  width: '297mm',
  height: '210mm',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});
await writeFile(OUT, pdf);

/*
  Разметка кладётся рядом с PDF. Во-первых, бланк можно открыть в браузере и
  поправить формулировку, ничего не пересобирая. Во-вторых, по ней видно, чем
  именно набран каждый кусок, — а это единственный способ поймать текст,
  который тихо уехал в подменный шрифт.
*/
await writeFile(OUT.replace('.pdf', '.html'), html);

/* предпросмотр рядом: посмотреть бланк, не открывая PDF */
await page.setViewportSize({ width: 1123, height: 794 });
await page.screenshot({ path: OUT.replace('.pdf', '-preview.png') });
await browser.close();

console.log(`${OUT} — A4 альбомная, ${(pdf.length / 1024).toFixed(0)} KB`);
console.log(`тренер: ${coach} · площадка: ${venue}, ${city}`);
