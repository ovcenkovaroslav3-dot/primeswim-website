import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { enrollmentSlots, enrollmentSummary, isEnrollmentDay } from './enrollment.ts';
import { schedule } from './schedule.ts';

test('enrollment selects Tue–Thu and derives times from schedule', () => {
  assert.deepEqual(enrollmentSlots.map(slot => slot.id), ['tue', 'wed', 'thu']);
  assert.equal(enrollmentSummary, 'Вт 19:45 · Ср 19:45 · Чт 19:45');
  for (const slot of enrollmentSlots) assert.equal(slot, schedule.find(item => item.id === slot.id));
  assert.equal(isEnrollmentDay('mon'), false);
  assert.equal(isEnrollmentDay('tue'), true);
});
test('review trial CTA routes to existing booking, not a second lead form', () => {
  const source = readFileSync(new URL('../components/sections/Reviews.tsx', import.meta.url), 'utf8');
  assert.match(source, /href="#booking"/);
  assert.match(source, /data-goal="cta_booking"/);
  assert.doesNotMatch(source, /<form/);
});
