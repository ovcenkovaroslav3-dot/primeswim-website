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

test('амперсанд в значении не рвёт строку', () => {
  const source = pickKnownParams('?utm_content=a%26b&yclid=999');

  assert.equal(paramFromSource(source, 'utm_content'), 'a&b');
  assert.equal(paramFromSource(source, 'yclid'), '999');
});

test('плюс в значении остаётся плюсом, а не превращается в пробел', () => {
  const source = pickKnownParams('?utm_term=a%2Bb');

  assert.equal(paramFromSource(source, 'utm_term'), 'a+b');
});

test('процент в значении переживает сборку', () => {
  const source = pickKnownParams('?utm_campaign=%D1%81%D0%BA%D0%B8%D0%B4%D0%BA%D0%B0%2050%25');

  assert.equal(paramFromSource(source, 'utm_campaign'), 'скидка 50%');
});

test('кириллица в названии кампании остаётся читаемой — её читает школа в чате', () => {
  const source = pickKnownParams('?utm_campaign=%D0%9F%D0%BB%D0%B0%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5+%D0%B4%D0%B5%D1%82%D1%8F%D0%BC');

  assert.equal(source, 'utm_campaign=Плавание детям');
  assert.equal(paramFromSource(source, 'utm_campaign'), 'Плавание детям');
});

test('порядок меток не зависит от порядка в адресе', () => {
  assert.equal(
    pickKnownParams('?yclid=1&utm_source=yandex'),
    pickKnownParams('?utm_source=yandex&yclid=1'),
  );
});
