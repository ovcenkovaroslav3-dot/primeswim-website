/**
 * Заводит в счётчике Метрики цели для всех событий сайта, которых там ещё нет.
 *
 *   METRIKA_TOKEN=… node scripts/metrika-goals.mjs [--apply]
 *
 * Без --apply только печатает план. Список целей и названия — goalTitles в
 * src/lib/analytics.ts, правило «что уже заведено» — src/lib/metrika-goals.ts.
 * Существующие цели не меняются и не удаляются.
 *
 * Запускается воркфлоу «Цели Метрики» (.github/workflows/metrika-goals.yml):
 * у облачного агента API Метрики закрыто прокси, у раннера GitHub — открыто.
 * Токен — OAuth-токен Яндекса с правом «Метрика: изменение параметров»,
 * хранится в секрете репозитория METRIKA_TOKEN и в лог не попадает.
 */

import { goalTitles } from '../src/lib/analytics.ts';
import { missingGoals } from '../src/lib/metrika-goals.ts';

const counter = process.env.METRIKA_COUNTER || '111745879';
const token = process.env.METRIKA_TOKEN?.trim();
const apply = process.argv.includes('--apply');

if (!token) {
  console.error('Нет METRIKA_TOKEN — добавьте секрет репозитория (см. README, «Цели»).');
  process.exit(1);
}

// METRIKA_API подменяет адрес API в проверке скрипта на заглушке
const api = process.env.METRIKA_API || 'https://api-metrika.yandex.net';
const url = `${api}/management/v1/counter/${counter}/goals`;
const headers = { Authorization: `OAuth ${token}`, 'Content-Type': 'application/json' };

async function call(method, body) {
  const response = await fetch(url, { method, headers, body: body && JSON.stringify(body) });
  const text = await response.text();
  if (!response.ok) {
    // в ответе API нет токена — печатать его безопасно и нужно для разбора
    throw new Error(`${method} ${response.status}: ${text.slice(0, 500)}`);
  }
  return JSON.parse(text);
}

const { goals = [] } = await call('GET');
console.log(`Счётчик ${counter}: целей сейчас ${goals.length}.`);

const plan = missingGoals(goalTitles, goals);
if (plan.length === 0) {
  console.log('Все события сайта уже заведены целями — делать нечего.');
  process.exit(0);
}

console.log(`Не хватает ${plan.length}:`);
for (const goal of plan) console.log(`  + ${goal.name}`);

if (!apply) {
  console.log('Пробный запуск: ничего не создано. Для создания — с флагом --apply.');
  process.exit(0);
}

for (const goal of plan) {
  const { goal: created } = await call('POST', { goal });
  console.log(`  создана ${created.id}: ${created.name}`);
}

const after = await call('GET');
const left = missingGoals(goalTitles, after.goals ?? []);
if (left.length > 0) {
  console.error(`После создания всё ещё не хватает: ${left.map((g) => g.name).join(', ')}`);
  process.exit(1);
}
console.log(`Готово: целей в счётчике ${after.goals.length}, все события сайта заведены.`);
