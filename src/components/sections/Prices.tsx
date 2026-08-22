import { ButtonLink, Section, SectionHeading } from '../ui';
import { prices, pricesNote, pricesDisclaimer } from '@/content/prices';
import { contacts } from '@/content/contacts';

const formatter = new Intl.NumberFormat('ru-RU');

export function Prices() {
  return (
    <Section id="prices" labelledBy="prices-title" className="bg-surface">
      <SectionHeading
        id="prices-title"
        eyebrow="Стоимость"
        title="Сколько стоят занятия"
        lead={pricesNote}
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {prices.map((price) => (
          <li
            key={price.id}
            className={`flex flex-col rounded-2xl border p-7 ${
              price.featured
                ? 'border-brand-600 bg-brand-600 text-white shadow-lg'
                : 'border-hairline bg-surface-alt'
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                price.featured ? 'text-lime-brand' : 'text-brand-600'
              }`}
            >
              {price.badge}
            </p>

            <h3
              className={`mt-3 font-display text-xl font-bold ${
                price.featured ? 'text-white' : 'text-ink'
              }`}
            >
              {price.title}
            </h3>

            <p
              className={`mt-1 text-sm ${
                price.featured ? 'text-white/75' : 'text-ink-muted'
              }`}
            >
              {price.note}
            </p>

            <p className="mt-6 mb-7 flex items-baseline gap-1.5">
              <span
                className={`font-display text-4xl font-extrabold ${
                  price.featured ? 'text-lime-brand' : 'text-ink'
                }`}
              >
                {formatter.format(price.amount)} ₽
              </span>
              {price.unit ? (
                <span
                  className={`text-sm ${
                    price.featured ? 'text-white/70' : 'text-ink-muted'
                  }`}
                >
                  {price.unit}
                </span>
              ) : null}
            </p>

            <ButtonLink
              href="#booking"
              variant={price.featured ? 'secondary' : 'primary'}
              className="mt-auto w-full"
            >
              Записаться
            </ButtonLink>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-muted">
        {pricesDisclaimer} Условия возврата и переноса занятий описаны в договоре,
        который подписывается до начала занятий. Остались вопросы по оплате —{' '}
        <a
          href={contacts.social.telegramBooking}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          напишите нам в Telegram
        </a>
        .
      </p>
    </Section>
  );
}
