import assert from 'node:assert/strict';
import { test } from 'node:test';

import { paramFromSource, pickKnownParams } from './campaign-source.ts';

test('берёт только известные метки', () => {
  assert.equal(
    pickKnownParams('?utm_source=yandex&utm_medium=cpc&phone=%2B79991234567'),
    'utm_source=yandex&utm_medium=cpc',
  );
});

test('пустая строка запроса даёт пустой результат', () => {
  assert.equal(pickKnownParams(''), '');
  assert.equal(pickKnownParams('?foo=bar'), '');
});

test('yclid сохраняется — по нему кабинет принимает офлайн-конверсии', () => {
  const source = pickKnownParams('?yclid=123456789&utm_source=yandex');
  assert.equal(paramFromSource(source, 'yclid'), '123456789');
});

test('слишком длинное значение обрезается', () => {
  const long = 'a'.repeat(200);
  const source = pickKnownParams(`?utm_campaign=${long}`);
  assert.equal(paramFromSource(source, 'utm_campaign').length, 60);
});

test('порядок меток не зависит от порядка в адресе', () => {
  assert.equal(
    pickKnownParams('?yclid=1&utm_source=yandex'),
    pickKnownParams('?utm_source=yandex&yclid=1'),
  );
});
