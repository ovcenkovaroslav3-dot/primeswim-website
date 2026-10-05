/**
 * Шрифт Google, вшитый в страницу файлом.
 *
 * ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ. Приём понадобился второй раз — бланку диплома и
 * бланку согласия, — а разобран он был в комментарии одного из них. Копия
 * такого кода живёт ровно до первой правки в одной из двух.
 *
 * ПОЧЕМУ ВООБЩЕ ВШИВАЕМ. Подключённый ссылкой Inter в страницу загружается и
 * применяется — `document.fonts.check` отвечает утвердительно. Но в PDF он
 * всё равно не попадал: Google отдаёт Inter переменным шрифтом, а экспорт PDF
 * из браузера переменные не вкладывает и подменяет их локальным системным.
 * Чужой системный шрифт в раздаваемом файле — и вид разъезжается у разных
 * людей, и лицензия сомнительна.
 *
 * Параметр `text=` возвращает статическое подмножество ровно под переданные
 * знаки — такое вкладывается. Скачанный файл вшивается data-URI, и на
 * отрисовке сеть уже не нужна.
 *
 * ПРОПИСНЫЕ ПЕРЕДАВАТЬ ОТДЕЛЬНО. Подмножество приходит по запрошенным знакам,
 * и строка, выведенная через `text-transform: uppercase`, в него не попадает:
 * в исходнике «Награждается», на листе «НАГРАЖДАЕТСЯ». Такая строка целиком
 * уезжает в системный шрифт, причём на экране разница почти не видна. Для
 * этого у `glyphsFrom` есть второй проход по верхнему регистру.
 */

/**
 * Набор знаков для запроса: сами строки плюс их версии прописными.
 *
 * @param lines строки, которые появятся на листе
 */
export function glyphsFrom(lines) {
  return [
    ...new Set(lines.flatMap((line) => [line, line.toUpperCase()]).join('')),
  ]
    .sort()
    .join('');
}

/**
 * Скачивает подмножество шрифта и возвращает готовое правило @font-face.
 *
 * @param family    имя семейства у Google, например `Inter`
 * @param weight    начертание, например 400
 * @param glyphs    строка со знаками — результат glyphsFrom
 */
export async function inlineGoogleFont(family, weight, glyphs) {
  /*
    Браузерный user-agent обязателен: без него Google отдаёт css со ссылкой на
    ttf, а нам нужен woff2 — он вчетверо легче и вкладывается так же.
  */
  const chromeUa =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120 Safari/537.36';

  const href =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(glyphs)}`;

  const css = await (
    await fetch(href, { headers: { 'user-agent': chromeUa } })
  ).text();

  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) {
    throw new Error(
      `Google не отдал файл шрифта ${family} — проверьте запрос: ${href}`,
    );
  }

  const font = Buffer.from(await (await fetch(url)).arrayBuffer());
  return (
    `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
    `src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');}`
  );
}
