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
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {prices.map((price, i) => (
          <li
            key={price.id}
            /*
              Карточки появляются с той же задержкой, что и во всех остальных
              секциях. Раньше их не было в общем ритме: блок со стоимостью
              единственный возникал разом и на фоне остального выглядел
              статичной вставкой.
            */
            className={`reveal lift flex flex-col rounded-[20px] border p-7 ${
              price.featured
                ? 'relative overflow-hidden border-abyss-800 bg-abyss-900 text-white'
                : 'border-hairline bg-surface-alt'
            }`}
            style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
          >
            {price.featured ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-14 size-48 rounded-full bg-brand-300/18 blur-3xl"
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
              {/* у выделенного тарифа сумма крупнее: разницу должно быть видно
                  раньше, чем читатель дойдёт до цифр */}
              <span
                className={`font-extralight tabular-nums ${
                  price.featured
                    ? 'text-5xl text-lime-300'
                    : 'text-4xl text-ink'
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

      {/*
        Скидка стояла подзаголовком секции и терялась в сером тексте рядом с
        заголовком. Это выгода, а не сноска, поэтому она вынесена под тарифы
        отдельной плашкой — до юридических оговорок, а не после них.
      */}
      <p className="reveal mt-6 rounded-[20px] border border-brand-100 bg-brand-50 px-7 py-5 text-sm leading-relaxed text-ink-soft">
        {pricesNote}
      </p>

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
