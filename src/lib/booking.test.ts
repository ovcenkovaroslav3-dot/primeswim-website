import assert from 'node:assert/strict';
import { test } from 'node:test';

import { programOptions } from '../content/programs.ts';
import { slotOptions } from '../content/schedule.ts';
import { prices } from '../content/prices.ts';

import { requestBooking, sanitizePrefill, takePendingBooking, slotFragment, tariffFragment, programFragment, programFromFragment, parseBookingFragment } from './booking.ts';

test('из хранилища берутся только строки известных полей', () => {
  assert.deepEqual(sanitizePrefill({ age: '9-10', program: 'sport', slot: 'mon-19:00', note: 'x', phone: '+7999' }), {
    age: '9-10',
    program: 'sport',
    slot: 'mon-19:00',
    note: 'x',
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

test('фрагменты всех программ восстанавливают только известное направление', () => {
  const ids = programOptions.map((option) => option.value).filter((id) => id !== '');
  for (const id of ids) assert.equal(programFromFragment(programFragment(id), ids), id);
  assert.equal(programFromFragment('booking-program-unknown', ids), undefined);
  assert.equal(programFromFragment('booking-program-', ['', ...ids]), undefined);
});

test('фрагмент каждого времени, тарифа и направления разбирается в тот же выбор', () => {
  const options = {
    slots: slotOptions.map((option) => option.value),
    tariffs: prices.map((price) => price.id),
    programs: programOptions.map((option) => option.value),
  };
  assert.ok(options.slots.length > 0 && options.tariffs.length > 0 && options.programs.length > 0);
  for (const slot of options.slots) {
    assert.deepEqual(parseBookingFragment(slotFragment(slot), options), { slot });
    assert.deepEqual(parseBookingFragment('#' + slotFragment(slot), options), { slot });
  }
  for (const tariff of options.tariffs) assert.deepEqual(parseBookingFragment(tariffFragment(tariff), options), { tariff });
  for (const program of options.programs.filter((id) => id !== '')) {
    assert.deepEqual(parseBookingFragment(programFragment(program), options), { program });
  }
});

test('чужой или пустой хэш не даёт выбора', () => {
  const options = { slots: ['tue-19:45'], tariffs: ['trial'], programs: ['', 'sport'] };
  for (const hash of ['', '#', 'booking', '#booking', 'booking-slot-unknown', 'booking-tariff-', 'booking-program-']) {
    assert.equal(parseBookingFragment(hash, options), null, hash);
  }
});
