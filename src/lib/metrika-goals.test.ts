import assert from 'node:assert/strict';
import { test } from 'node:test';

import { existingEventIds, missingGoals, type MetrikaGoal } from './metrika-goals.ts';
import { goalTitles } from './analytics.ts';

const counter: MetrikaGoal[] = [
  { id: 1, name: 'Заявка', type: 'action', conditions: [{ type: 'exact', url: 'lead_delivered' }] },
  { id: 2, name: 'Просмотр стоимости', type: 'url', conditions: [{ type: 'contain', url: '/price/' }] },
  { id: 3, name: 'Звонок, старое имя', type: 'action', conditions: [{ type: 'exact', url: 'click_phone' }] },
];

test('заведённой считается цель с тем же идентификатором, как бы она ни называлась', () => {
  assert.deepEqual([...existingEventIds(counter)].sort(), ['click_phone', 'lead_delivered']);
});

test('цели по адресу страницы не принимаются за JavaScript-события', () => {
  assert.ok(!existingEventIds(counter).has('/price/'));
});

test('создаются только недостающие, в формате API', () => {
  const plan = missingGoals({ lead_delivered: 'Заявка', view_form: 'Форма на экране' }, counter);
  assert.deepEqual(plan, [
    { name: 'Форма на экране (view_form)', type: 'action', conditions: [{ type: 'exact', url: 'view_form' }] },
  ]);
});

test('повторный запуск ничего не создаёт', () => {
  const first = missingGoals(goalTitles, counter);
  assert.equal(missingGoals(goalTitles, [...counter, ...first]).length, 0);
});

test('название цели укладывается в лимит Метрики', () => {
  for (const goal of missingGoals(goalTitles, [])) assert.ok(goal.name.length <= 255, goal.name);
});
