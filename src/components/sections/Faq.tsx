import { Section, SectionHeading } from '../ui';
import { faq } from '@/content/faq';
import { contacts } from '@/content/contacts';

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" className="bg-surface">
      <SectionHeading
        id="faq-title"
        eyebrow="Вопросы"
        title="Частые вопросы родителей"
      />

      {/* Нативные details/summary: работают без JavaScript и с клавиатуры */}
      <div className="mt-12 grid gap-3 lg:grid-cols-2">
        {faq.map((item) => (
          <details
            key={item.id}
            className="group rounded-[20px] border border-hairline bg-surface-alt px-6 open:border-brand-200"
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

      <p className="mt-8 text-ink-soft">
        Не нашли ответ? Напишите нам в{' '}
        <a
          href={contacts.social.telegramBooking}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          Telegram
        </a>{' '}
        или позвоните по телефону{' '}
        <a
          href={contacts.phone.href}
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          {contacts.phone.display}
        </a>
        .
      </p>
    </Section>
  );
}
