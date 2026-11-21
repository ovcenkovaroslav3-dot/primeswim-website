import assert from 'node:assert/strict';
import { test } from 'node:test';

import { requestBooking, sanitizePrefill, takePendingBooking, slotFragment, tariffFragment } from './booking.ts';

test('из хранилища берутся только строки известных полей', () => {
  assert.deepEqual(sanitizePrefill({ age: '9-10', program: 'sport', slot: 'mon-19:00', note: 'x', comment: 'тариф', phone: '+7999' }), {
    age: '9-10',
    program: 'sport',
    slot: 'mon-19:00',
    note: 'x',
    comment: 'тариф',
    tariff: undefined,
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

test('комментарий тарифа — только строка и не длиннее 240 знаков', () => {
  assert.equal(sanitizePrefill({ comment: 'a'.repeat(1000) })?.comment?.length, 240);
  assert.equal(sanitizePrefill({ comment: 42 })?.comment, undefined);
});


test('выбор до подключения формы сохраняется и забирается один раз', () => {
  const store = new Map<string, string>();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const fakeWindow = new EventTarget() as EventTarget & { sessionStorage: Storage; history: { state: null; replaceState: () => void }; location: { pathname: string; search: string } };
  fakeWindow.history = { state: null, replaceState() {} };
  fakeWindow.location = { pathname: '/', search: '?utm_source=test' };
  fakeWindow.sessionStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() { return store.size; },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: fakeWindow });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    getElementById: () => ({ querySelector: () => ({ scrollIntoView() {} }) }),
  } });
  try {
    requestBooking({ slot: 'mon-19:45' });
    assert.equal(takePendingBooking()?.slot, 'mon-19:45');
    assert.equal(takePendingBooking(), null);

    let received: string | undefined;
    fakeWindow.addEventListener('primeswim:booking', (event) => {
      takePendingBooking();
      received = (event as CustomEvent<{ slot: string }>).detail.slot;
    });
    requestBooking({ slot: 'wed-20:00' });
    assert.equal(received, 'wed-20:00');
    assert.equal(takePendingBooking(), null);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('фрагменты содержат только выбранный идентификатор', () => {
  assert.equal(slotFragment('tue-19:45'), 'booking-slot-tue-19-45');
  assert.equal(tariffFragment('once-a-week'), 'booking-tariff-once-a-week');
  assert.equal(sanitizePrefill({ tariff: 'trial' })?.tariff, 'trial');
});
