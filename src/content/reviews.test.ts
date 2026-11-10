import test from 'node:test';
import assert from 'node:assert/strict';
import { reviews, reviewsSource } from './reviews.ts';

test('six distinct sourced excerpts, with authors and source-visible dates', () => {
  assert.equal(reviews.length, 6);
  assert.equal(new Set(reviews.map((review) => review.id)).size, 6);
  for (const review of reviews) {
    assert.ok(review.author.trim());
    assert.ok(review.text.trim());
    assert.match(review.date, /^\d{1,2} (ноября|августа)$/);
  }
  assert.equal(new URL(reviewsSource.href).hostname, 'yandex.com');
  assert.ok(reviewsSource.href.includes('52003694679/reviews/'));
});
