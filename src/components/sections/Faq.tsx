import Link from 'next/link';

import { Section, SectionHeading } from '../ui';
import { JsonLd } from '../StructuredData';
import { faq } from '@/content/faq';
import { contacts } from '@/content/contacts';

/*
  Частые вопросы.

  Блок стоит на двух страницах, и они устроены по-разному.

  На /roditelyam/ — все вопросы и разметка FAQPage. Разметка допустима
  именно там: вопросы и ответы видны посетителю целиком, details/summary
  прячет их до клика, но текст лежит в разметке страницы, а не подгружается
  скриптом. Размечать скрытый или несуществующий на странице текст было бы
  нарушением требований поисковых систем.

  На главной — короткая выборка и БЕЗ разметки. Отдавать FAQPage с двух
  адресов сразу нельзя: поиск увидел бы две страницы, претендующие на один
  и тот же расширенный сниппет, и это работает против обеих. Плюс на главной
  показаны не все вопросы — размечать пришлось бы обрезанный список.

  Поэтому и `limit`, и `withSchema` задаются страницей, а не угадываются
  внутри компонента: место, где блок стоит, знает страница.
*/
export function Faq({
  limit,
  withSchema = true,
  moreHref,
}: {
  /** Сколько вопросов показать. Без значения — все. */
  limit?: number;
  /** Отдавать ли разметку FAQPage. Ровно одна страница сайта должна отдавать true. */
  withSchema?: boolean;
  /** Куда вести за остальными вопросами, если список обрезан. */
  moreHref?: string;
} = {}) {
  const items = limit ? faq.slice(0, limit) : faq;
  const hasMore = Boolean(moreHref) && items.length < faq.length;

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <Section id="faq" labelledBy="faq-title" className="bg-surface-alt">
      {withSchema ? <JsonLd data={faqPage} /> : null}
      <SectionHeading
        id="faq-title"
        eyebrow="Вопросы"
        title="Частые вопросы родителей"
      />

      {/* Нативные details/summary: работают без JavaScript и с клавиатуры */}
      <div className="mt-12 grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <details
            key={item.id}
            className="group rounded-[20px] border border-hairline bg-surface px-6 open:border-brand-200"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink marker:content-none">
              {item.question}
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full border border-hairline text-brand-600 transition-transform group-open:rotate-45"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 1v10M1 6h10"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="pb-5 leading-relaxed text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>

      {hasMore ? (
        <Link
          href={moreHref as string}
          prefetch={false}
          className="lift group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-600"
        >
          Все вопросы и что взять на первое занятие
          <svg
            width="15"
            height="15"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            <path
              d="M3 9h12M10 4l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : null}

      <p className="mt-8 text-ink-soft">
        Не нашли ответ? Напишите нам в{' '}
        <a
          href={contacts.social.telegramBooking}
          target="_blank"
          rel="noopener noreferrer"
          data-goal="click_telegram_booking"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          Telegram
        </a>{' '}
        или позвоните по телефону{' '}
        <a
          href={contacts.phone.href}
          data-goal="click_phone"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          {contacts.phone.display}
        </a>
        .
      </p>
    </Section>
  );
}
