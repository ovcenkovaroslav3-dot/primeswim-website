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
            className={`flex flex-col rounded-[20px] border p-7 ${
              price.featured
                ? 'relative overflow-hidden border-abyss-800 bg-abyss-900 text-white'
                : 'border-hairline bg-surface-alt'
            }`}
          >
            {price.featured ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-14 size-48 rounded-full bg-aqua-500/25 blur-3xl"
              />
            ) : null}
            <p
              className={`relative text-xs font-medium tracking-[0.2em] uppercase ${
                price.featured ? 'text-white/70' : 'text-ink-muted'
              }`}
            >
              {price.badge}
            </p>

            <h3
              className={`relative mt-4 text-xl font-light ${
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

            <p className="relative mt-6 mb-7 flex items-baseline gap-1.5">
              <span
                className={`text-4xl font-extralight tabular-nums ${
                  price.featured ? 'text-aqua-300' : 'text-ink'
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
              variant={price.featured ? 'secondary' : 'ghost'}
              className="relative mt-auto w-full"
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
