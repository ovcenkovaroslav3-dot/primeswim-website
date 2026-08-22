/**
 * Тесты проверки заявки. Запуск: npm test
 * Используется встроенный тест-раннер Node — дополнительные библиотеки не нужны.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { validateLead, normalizePhone, type LeadInput } from './lead-schema.ts';

const validPrograms = new Set(['', 'beginners', 'technique', 'sport']);

function makeLead(overrides: Partial<LeadInput> = {}): LeadInput {
  return {
    name: 'Мария',
    phone: '+7 991 229-99-77',
    program: 'beginners',
    comment: '',
    consent: true,
    company: '',
    ...overrides,
  };
}

const check = (input: LeadInput) => validateLead(input, validPrograms);

test('корректная заявка проходит проверку', () => {
  assert.deepEqual(check(makeLead()), {});
});

test('номер приводится к цифрам независимо от формата ввода', () => {
  assert.equal(normalizePhone('+7 (991) 229-99-77'), '79912299977');
  assert.equal(normalizePhone('8 991 229 99 77'), '89912299977');
});

test('пустое имя отклоняется', () => {
  const errors = check(makeLead({ name: '   ' }));
  assert.ok(errors.name);
});

test('слишком короткий номер отклоняется', () => {
  const errors = check(makeLead({ phone: '123' }));
  assert.ok(errors.phone);
});

test('пустой номер отклоняется отдельным сообщением', () => {
  const errors = check(makeLead({ phone: '' }));
  assert.ok(errors.phone);
  assert.notEqual(
    errors.phone,
    check(makeLead({ phone: '123' })).phone,
    'сообщения для пустого и некорректного номера должны отличаться',
  );
});

test('заявка без согласия на обработку данных отклоняется', () => {
  const errors = check(makeLead({ consent: false }));
  assert.ok(errors.consent);
});

test('несуществующее направление отклоняется', () => {
  const errors = check(makeLead({ program: 'выдуманное-направление' }));
  assert.ok(errors.program);
});

test('пустое направление допустимо — человек может не знать, что выбрать', () => {
  assert.equal(check(makeLead({ program: '' })).program, undefined);
});

test('слишком длинный комментарий отклоняется', () => {
  const errors = check(makeLead({ comment: 'a'.repeat(601) }));
  assert.ok(errors.comment);
});
