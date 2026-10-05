/**
 * Рекламные метки визита: utm_* и yclid.
 *
 * ЗАЧЕМ ХРАНИЛИЩЕ, А НЕ ПРОСТО АДРЕСНАЯ СТРОКА. Метки приходят только на
 * первую страницу — ту, на которую человек попал из объявления. Внутренние
 * ссылки их не переносят: Next отдаёт `/price/`, а не `/price/?yclid=...`.
 * Раньше форма читала метки прямо из адреса в момент отправки, и у каждого,
 * кто перед заявкой заглянул в расписание или в стоимость, источник
 * оказывался пустым — то есть у большинства. Проверено на боевом сайте
 * 7 сентября 2026: вход с `?utm_source=yandex&yclid=999`, один клик по
 * ссылке — и в адресе не осталось ничего.
 *
 * Метки нужны в двух местах. В самой заявке — школа видит в чате, откуда
 * пришло обращение. И отдельно `yclid`: по нему рекламный кабинет умеет
 * принимать офлайн-конверсии, то есть узнавать о заявке даже тогда, когда
 * счётчик на сайте не подключался.
 *
 * sessionStorage, а не localStorage: метка живёт ровно один визит. Если
 * человек вернётся через неделю прямым заходом, приписывать его старой
 * рекламе нечестно — это исказит и отчёт, и оптимизацию кампании.
 *
 * Согласия на аналитику здесь не требуется и оно не проверяется: это не
 * счётчик и не cookie для третьих лиц. Значение никуда не уходит само —
 * оно отправляется только вместе с заявкой, которую человек заполнил и
 * отправил сам, и ровно об этом сказано в политике.
 */

const KNOWN = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
] as const;

const STORAGE_KEY = 'primeswim:campaign-source';

/** Ограничение на значение одной метки — чтобы в чат не уехала простыня. */
const VALUE_LIMIT = 60;

/**
 * Экранирование значения — только то, что имеет смысл в строке запроса:
 * `%`, `&`, `+` и `=`.
 *
 * Кодировать значение целиком (`URLSearchParams.toString()`) нельзя: строка
 * уходит в чат школе строкой «Источник», а `utm_campaign` в Яндекс Директе
 * бывает кириллическим — вместо названия кампании там оказалось бы
 * `%D0%9F%D0%BB%D0%B0%D0%B2...`, и прочесть его человеку невозможно.
 * Кириллицу, пробелы и дефисы `URLSearchParams` разбирает как есть, разбору
 * они не мешают, поэтому их и не трогаем.
 *
 * Экранирование удлиняет значение втрое в худшем случае, но длина строки в
 * чате ограничена отдельно — см. `flatten` в server/lead/message.ts.
 */
function escapeValue(value: string): string {
  return value.replace(
    /[%&+=]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/**
 * Известные метки из строки запроса, одной строкой.
 *
 * Берём только знакомые ключи, а не всю строку: в query может оказаться
 * что угодно, вплоть до чужих персональных данных.
 *
 * Значение сначала обрезается, потом экранируется: предел в `VALUE_LIMIT`
 * задан для содержимого, а не для его записи, и обрезка до экранирования
 * не может разрубить `%26` пополам.
 */
export function pickKnownParams(search: string): string {
  const params = new URLSearchParams(search);
  const found: string[] = [];

  for (const key of KNOWN) {
    const value = params.get(key);
    if (value) found.push(`${key}=${escapeValue(value.slice(0, VALUE_LIMIT))}`);
  }

  return found.join('&');
}

/** Значение одной метки из собранной строки — нужно для `yclid`. */
export function paramFromSource(source: string, key: string): string {
  return new URLSearchParams(source).get(key) ?? '';
}

/**
 * Запомнить метки текущей страницы. Вызывается на каждой странице, но
 * записывает только если метки есть: переход внутри сайта не должен
 * стирать то, с чем человек пришёл.
 */
export function captureSource(): void {
  if (typeof window === 'undefined') return;

  const current = pickKnownParams(window.location.search);
  if (!current) return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, current);
  } catch {
    // приватный режим может запрещать хранилище — тогда метка доедет
    // только с той страницы, на которую человек пришёл
  }
}

/** Метки визита: сначала адрес страницы, потом запомненное при входе. */
export function readSource(): string {
  if (typeof window === 'undefined') return '';

  const current = pickKnownParams(window.location.search);
  if (current) return current;

  try {
    return window.sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}
