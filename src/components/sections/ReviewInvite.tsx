import { contacts } from '@/content/contacts';
import { ButtonLink, Section } from '../ui';

/*
  Приглашение оставить отзыв.

  Вторичное действие: кнопка «ghost», чтобы не спорить с «Записаться» в
  финальном блоке ниже. Без обещаний бонусов и без подсказки оценки —
  просто ссылка на страницу отзывов школы в Яндекс Картах.
*/
export function ReviewInvite() {
  return (
    <Section id="review-invite" labelledBy="review-invite-title" className="bg-surface-alt !py-12 md:!py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="review-invite-title" className="text-2xl font-normal tracking-[-0.02em] text-ink sm:text-3xl">
          Нравятся занятия?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-balance text-ink-soft">
          Расскажите другим родителям на Яндекс Картах — это помогает им выбрать школу.
        </p>
        <div className="mt-6">
          <ButtonLink
            href={contacts.address.yandexReviews}
            external
            variant="ghost"
            data-goal="review_click"
          >
            Оставить отзыв
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
