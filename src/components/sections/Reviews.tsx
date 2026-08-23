import { Section, SectionHeading } from '../ui';
import { reviews, reviewsSource } from '@/content/reviews';

export function Reviews() {
  return (
    <Section id="reviews" labelledBy="reviews-title" className="bg-surface-alt">
      <SectionHeading
        id="reviews-title"
        eyebrow="Отзывы"
        title="Что говорят родители"
        lead={reviewsSource.label}
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="flex flex-col rounded-[20px] border border-hairline bg-white p-7"
          >
            <blockquote className="flex-1 leading-relaxed text-ink">
              «{review.text}»
            </blockquote>
            <footer className="mt-5 border-t border-hairline pt-4">
              <p className="font-medium text-ink">{review.author}</p>
              <p className="mt-1 text-sm text-ink-muted">{review.context}</p>
            </footer>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-ink-muted">
        Отзывы опубликованы пользователями на Яндекс Картах.{' '}
        <a
          href={reviewsSource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          Открыть карточку школы
        </a>
        .
      </p>
    </Section>
  );
}
