/**
 * Какие цели завести в счётчике, чтобы каждое событие сайта было видно в
 * отчёте «Цели». Чистая функция без сети — её проверяет тест, а сеть и токен
 * остаются в scripts/metrika-goals.mjs.
 *
 * Сначала ищем, потом создаём: цель считается заведённой, если в счётчике
 * уже есть JavaScript-событие с тем же идентификатором — как бы она ни
 * называлась. Существующие цели не меняются и не удаляются: у них история
 * конверсий, и переименование задним числом спутало бы отчёты.
 */

export type MetrikaGoal = {
  id?: number;
  name: string;
  type: string;
  conditions?: { type: string; url: string }[];
};

/** Идентификаторы JavaScript-событий, которые уже есть в счётчике. */
export function existingEventIds(goals: readonly MetrikaGoal[]): Set<string> {
  const ids = new Set<string>();
  for (const goal of goals) {
    if (goal.type !== 'action') continue;
    for (const condition of goal.conditions ?? []) {
      if (condition.type === 'exact') ids.add(condition.url);
    }
  }
  return ids;
}

/** Цели, которых в счётчике нет, — в формате тела запроса API Метрики. */
export function missingGoals(
  wanted: Readonly<Record<string, string>>,
  existing: readonly MetrikaGoal[],
): MetrikaGoal[] {
  const have = existingEventIds(existing);
  return Object.entries(wanted)
    .filter(([id]) => !have.has(id))
    .map(([id, title]) => ({
      name: `${title} (${id})`,
      type: 'action',
      conditions: [{ type: 'exact', url: id }],
    }));
}
