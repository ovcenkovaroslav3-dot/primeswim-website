import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCoachProfile } from './coach-schema.ts';
import { coachReviewIds } from './coach-reviews.ts';
import { coaches } from './coaches.ts';
import { reviews } from './reviews.ts';

const ids = {
  organization: 'https://example.test/#organization',
  person: 'https://example.test/trener/#person',
};

test('ProfilePage: Person с обязательными полями, сериализуется в JSON', () => {
  const data = JSON.parse(JSON.stringify(buildCoachProfile(ids)));
  const person = data.mainEntity;
  const coach = coaches[0]!;

  assert.equal(data['@type'], 'ProfilePage');
  assert.equal(person['@type'], 'Person');
  assert.equal(person['@id'], ids.person);
  assert.equal(person.name, coach.name);
  assert.equal(person.jobTitle, coach.role);
  assert.ok(person.description.length > 50);
  assert.match(person.image, /^https?:\/\/.+\.jpg$/);
  assert.match(person.url, /\/trener\/$/);
  assert.equal(person.worksFor['@id'], ids.organization);
  assert.equal(person.knowsAbout.length, 4);
});

test('«Родители о тренере»: ровно три отзыва, в которых назван тренер', () => {
  assert.equal(coachReviewIds.length, 3);
  for (const id of coachReviewIds) {
    const review = reviews.find((r) => r.id === id);
    assert.ok(review, `нет отзыва ${id}`);
    assert.match(review.text, /Ярослав/);
  }
  const named = reviews.filter((r) => /Ярослав/.test(r.text)).map((r) => r.id);
  assert.deepEqual([...named].sort(), [...coachReviewIds].sort());
});
