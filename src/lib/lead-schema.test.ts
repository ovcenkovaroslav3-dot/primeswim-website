/**
 * Тесты проверки заявки. Запуск: npm test
 * Используется встроенный тест-раннер Node — дополнительные библиотеки не нужны.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateLead,
  normalizePhone,
  formatPhone,
  composeLeadComment,
  LEAD_COMMENT_MAX,
  type LeadInput,
} from './lead-schema.ts';

const validPrograms = new Set(['', 'beginners', 'technique', 'sport']);
const validAges = new Set(['under-7', '7-8', '9-10', '11-12', '13-14', '15+']);

function makeLead(overrides: Partial<LeadInput> = {}): LeadInput {
  return {
    name: 'Мария',
    phone: '+7 991 229-99-77',
    age: '7-8',
    program: 'beginners',
    comment: '',
    consent: true,
    hpx7: '',
    ...overrides,
  };
}

const check = (input: LeadInput) => validateLead(input, validPrograms, validAges);

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

test('без возраста заявка не проходит: без него не подобрать группу', () => {
  assert.equal(check(makeLead({ age: '' })).age, 'Выберите возраст ребёнка.');
});

test('возраст вне списка не принимается', () => {
  assert.ok(check(makeLead({ age: '99' })).age);
});

test('номер приводится к +7 (XXX) XXX-XX-XX с восьмёркой, семёркой и без кода', () => {
  assert.equal(formatPhone('89912299977'), '+7 (991) 229-99-77');
  assert.equal(formatPhone('+7 991 229 99 77'), '+7 (991) 229-99-77');
  assert.equal(formatPhone('9912299977'), '+7 (991) 229-99-77');
  assert.equal(formatPhone('8 (991) 229-99-77'), '+7 (991) 229-99-77');
});

test('непохожий на российский номер не переписывается', () => {
  assert.equal(formatPhone('+44 20 7946 0958'), '+44 20 7946 0958');
  assert.equal(formatPhone('8991'), '8991');
  assert.equal(formatPhone(''), '');
});

test('отформатированный номер проходит проверку', () => {
  const errors = validateLead(makeLead({ phone: formatPhone('89912299977') }), validPrograms, validAges);
  assert.equal(errors.phone, undefined);
});

test('комментарий собирается из времени, подбора и текста родителя', () => {
  assert.equal(
    composeLeadComment({ comment: '  боится воды ', slotLabel: 'Понедельник, 19:00', note: 'Подбор на сайте: x.' }),
    'Удобное время: Понедельник, 19:00.\nПодбор на сайте: x.\nбоится воды',
  );
  assert.equal(composeLeadComment({ comment: '' }), '');
  assert.equal(composeLeadComment({ comment: 'текст', slotLabel: null, note: '' }), 'текст');
});

test('длинный комментарий вместе с подбором ловится той же проверкой', () => {
  const comment = composeLeadComment({
    comment: 'а'.repeat(LEAD_COMMENT_MAX - 10),
    slotLabel: 'Суббота, 11:00',
  });
  const errors = validateLead(makeLead({ comment }), validPrograms, validAges);
  assert.ok(errors.comment);
});
