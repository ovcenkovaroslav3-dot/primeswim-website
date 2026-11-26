import test from 'node:test';
import assert from 'node:assert/strict';
import { enrollmentSlots } from './enrollment.ts';
import { findSlot, slotOptions } from './schedule.ts';
import { parseBookingFragment } from '../lib/booking.ts';

test('Wednesday 19:45 is an active, advertised slot', () => {
  assert.deepEqual(slotOptions.map(({ value }) => value), [
    'mon-19:45', 'tue-19:45', 'wed-19:45', 'thu-19:45', 'fri-19:00', 'fri-19:45', 'sat-11:00', 'sun-11:45',
  ]);
  assert.equal(findSlot('wed-19:45')?.value, 'wed-19:45');
  assert.deepEqual(enrollmentSlots.map(({ id }) => id), ['tue', 'wed', 'thu']);
  const options = { slots: slotOptions.map(({ value }) => value), tariffs: [], programs: [] };
  assert.deepEqual(parseBookingFragment('#booking-slot-wed-19-45', options), { slot: 'wed-19:45' });
  assert.deepEqual(parseBookingFragment('#booking-slot-fri-19-45', options), { slot: 'fri-19:45' });
});
