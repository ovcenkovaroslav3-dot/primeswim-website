import { ArrowLink, ButtonLink, Section, SectionHeading } from '../ui';
import { reviews, reviewsSource } from '@/content/reviews';

/** Static, accessible cards: no autoplay, external scripts or invented ratings. */
export function Reviews({ limit }: { limit?: number } = {}) {
  const shown = limit ? reviews.slice(0, limit) : reviews;
  if (shown.length === 0) return null;

  return (
    <Section id="reviews" labelledBy="reviews-title" className="bg-surface [overflow-wrap:anywhere]">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="reviews-title"
          eyebrow="Родители о PRIME SWIM"
          title="Доверие. В их словах."
          lead="Фрагменты настоящих отзывов на Яндекс Картах. Полные тексты можно прочитать в карточке школы."
        />
        <ArrowLink href={reviewsSource.href} external className="shrink-0 self-start md:self-auto">
          Читать на Яндекс Картах
        </ArrowLink>
      </div>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((review, i) => (
          <li
            key={review.id}
            className={`reveal relative flex min-w-0 flex-col rounded-card p-7 sm:p-8 ${i === 0 ? 'bg-abyss-900 text-white' : 'border border-hairline bg-surface-alt text-ink'}`}
            style={{ ['--reveal-delay' as string]: `${i * 40}ms` }}
          >
            <span aria-hidden="true" className={`mb-3 text-5xl leading-none ${i === 0 ? 'text-lime-300' : 'text-brand-600 dark:text-brand-200'}`}>“</span>
            <blockquote cite={reviewsSource.href} className={`flex-1 text-base leading-relaxed ${i === 0 ? 'text-white' : 'text-ink-soft'}`}>
              {review.text}
            </blockquote>
            <footer className={`mt-7 flex items-center gap-3 border-t pt-5 ${i === 0 ? 'border-white/20' : 'border-hairline'}`}>
              <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${i === 0 ? 'bg-white/10 text-lime-300' : 'bg-surface-deep text-brand-600 dark:text-brand-200'}`}>
                {review.author.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{review.author}</p>
                <p className={`mt-1 text-xs ${i === 0 ? 'text-white/70' : 'text-ink-muted'}`}>{review.date} · Яндекс Карты</p>
              </div>
            </footer>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-card border border-hairline bg-surface-alt p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h3 className="text-xl font-medium text-ink">Начните со знакомства</h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">На пробном занятии ребёнок познакомится с тренером и группой. Оставьте заявку — администратор поможет выбрать время.</p>
        </div>
        <ButtonLink href="#booking" data-goal="cta_booking" className="w-full shrink-0 sm:w-auto">
          Записаться на пробное
        </ButtonLink>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-ink-muted">
        Цитаты приведены без изменения слов. Имена и даты указаны как в источнике.
      </p>
    </Section>
  );
}
