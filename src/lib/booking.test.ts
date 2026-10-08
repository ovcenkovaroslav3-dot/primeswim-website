import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sanitizePrefill } from './booking.ts';

test('из хранилища берутся только строки известных полей', () => {
  assert.deepEqual(sanitizePrefill({ age: '9-10', program: 'sport', slot: 'mon-19:00', note: 'x', phone: '+7999' }), {
    age: '9-10',
    program: 'sport',
    slot: 'mon-19:00',
    note: 'x',
  });
});

test('мусор не превращается в подстановку', () => {
  assert.equal(sanitizePrefill(null), null);
  assert.equal(sanitizePrefill('строка'), null);
  const odd = sanitizePrefill({ age: 7, program: { a: 1 }, note: 'a'.repeat(1000) });
  assert.equal(odd?.age, undefined);
  assert.equal(odd?.program, undefined);
  assert.equal(odd?.note?.length, 240);
});
