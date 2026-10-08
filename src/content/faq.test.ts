import assert from 'node:assert/strict';
import { test } from 'node:test';

import { faq } from './faq.ts';
import { prices } from './prices.ts';

const rub = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

test('ответ про стоимость называет каждую цену из прайса', () => {
  const answer = faq.find((item) => item.id === 'price')?.answer ?? '';
  for (const price of prices) assert.ok(answer.includes(rub(price.amount)), price.id);
});

test('ответ про пробное называет его цену из прайса', () => {
  const trial = prices.find((price) => price.id === 'trial');
  const answer = faq.find((item) => item.id === 'trial')?.answer ?? '';
  assert.ok(trial && answer.includes(rub(trial.amount)));
});

test('у вопросов уникальные id', () => {
  assert.equal(new Set(faq.map((item) => item.id)).size, faq.length);
});
