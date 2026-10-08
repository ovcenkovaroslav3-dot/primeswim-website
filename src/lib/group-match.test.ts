import assert from 'node:assert/strict';
import { test } from 'node:test';

import { matchGroup, type PickerAnswers } from './group-match.ts';
import { slotOptions, schedule } from '../content/schedule.ts';
import { validAgeIds, validProgramIds } from '../content/programs.ts';

const base: PickerAnswers = { age: '9-10', level: 'none', goal: 'learn', days: 'any' };

test('не держится на воде — всегда «с нуля», какой бы ни была цель', () => {
  for (const goal of ['learn', 'technique', 'sport'] as const) {
    assert.equal(matchGroup({ ...base, goal }, slotOptions).program, 'beginners');
  }
});

test('держится, но сам не плывёт: учиться — «с нуля», иначе — техника', () => {
  assert.equal(matchGroup({ ...base, level: 'floats', goal: 'learn' }, slotOptions).program, 'beginners');
  assert.equal(matchGroup({ ...base, level: 'floats', goal: 'technique' }, slotOptions).program, 'technique');
  assert.equal(matchGroup({ ...base, level: 'floats', goal: 'sport' }, slotOptions).program, 'technique');
});

test('плавает сам: спорт — спортивная подготовка, остальное — техника', () => {
  assert.equal(matchGroup({ ...base, level: 'swims', goal: 'sport' }, slotOptions).program, 'sport');
  assert.equal(matchGroup({ ...base, level: 'swims', goal: 'learn' }, slotOptions).program, 'technique');
  assert.equal(matchGroup({ ...base, level: 'swims', goal: 'technique' }, slotOptions).program, 'technique');
});

test('любой результат — существующее направление из формы записи', () => {
  for (const level of ['none', 'floats', 'swims'] as const) {
    for (const goal of ['learn', 'technique', 'sport'] as const) {
      const { program } = matchGroup({ ...base, level, goal }, slotOptions);
      assert.ok(validProgramIds.has(program), program);
    }
  }
});

test('дни фильтруют время: будни без выходных и наоборот, «любые» — всё', () => {
  const weekdays = matchGroup({ ...base, days: 'weekdays' }, slotOptions).slots;
  const weekend = matchGroup({ ...base, days: 'weekend' }, slotOptions).slots;
  const any = matchGroup({ ...base, days: 'any' }, slotOptions).slots;
  assert.ok(weekdays.length > 0 && weekdays.every((s) => !s.weekend));
  assert.ok(weekend.length > 0 && weekend.every((s) => s.weekend));
  assert.equal(any.length, slotOptions.length);
  assert.equal(weekdays.length + weekend.length, any.length);
});

test('младше семи — честная оговорка, а не отказ', () => {
  assert.match(matchGroup({ ...base, age: 'under-7' }, slotOptions).ageNote ?? '', /с 7 лет/);
  assert.equal(matchGroup(base, slotOptions).ageNote, null);
  assert.ok(validAgeIds.has('under-7'));
});

test('ни один результат не обещает свободных мест', () => {
  const { reason, summary } = matchGroup(base, slotOptions);
  assert.doesNotMatch(`${reason} ${summary}`, /мест/i);
});

test('варианты времени построены из расписания один к одному', () => {
  const total = schedule.reduce((n, day) => n + day.times.length, 0);
  assert.equal(slotOptions.length, total);
  assert.equal(new Set(slotOptions.map((s) => s.value)).size, total);
  assert.ok(slotOptions.find((s) => s.value === 'sat-11:00')?.weekend);
  assert.equal(slotOptions.find((s) => s.value === 'mon-19:00')?.weekend, false);
});
