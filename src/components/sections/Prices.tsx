import Link from 'next/link';
import { Section, SectionHeading } from '../ui';
import { TariffBookButton } from '../TariffBookButton';
import { prices, pricesNote, pricesDisclaimer, type Price } from '@/content/prices';
import { contacts } from '@/content/contacts';

const formatter = new Intl.NumberFormat('ru-RU');

/*
  Строка «В месяц» считается из цены и числа занятий, а не хранится готовой
  суммой: поменяли цену занятия — месячная строка пересчиталась сама и не
  разошлась с крупной цифрой над ней. Число занятий — данные тарифа
  (content/prices.ts, 26.10.2026, подтверждено владельцем).
*/
function monthlyLine(price: Price): string | null {
  const m = price.monthLessons;
  if (!m) return null;
  const from = formatter.format(price.amount * m.min);
  if (m.max === undefined) {
    return `В месяц: от ${from} ₽ (от ${m.min} занятий)`;
  }
  const to = formatter.format(price.amount * m.max);
  return `В месяц: ${from}–${to} ₽ (${m.min}–${m.max} занятий)`;
}

/*
  Что уходит в комментарий формы при выборе тарифа. Собирается из тех же
  данных, что и карточка, чтобы строка не разошлась с ценой на экране.
*/
function tariffComment(price: Price): string {
  const sum = `${formatter.format(price.amount)} ₽`;
  return `Интересует тариф: ${price.title} (${price.unit ? `${sum} за занятие` : sum})`;
}

export function Prices({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' } = {}) {
  // название тарифа на своей странице идёт сразу за h1 — без промежуточного h2 это был бы пропуск уровня
  const PriceHeading = headingAs === 'h1' ? 'h2' : 'h3';

  return (
    <Section id="prices" labelledBy="prices-title" className="bg-surface">
      <SectionHeading
        as={headingAs}
        id="prices-title"
        eyebrow="Стоимость"
        title="Стоимость занятий плаванием в Химках"
        /*
          У секции не было подводки вовсе: после заголовка сразу шли три
          карточки с цифрами. Здесь названы место занятий и то, от чего
          вообще зависит цена, — это первый вопрос после самой суммы.
        */
        lead="Занятия проходят в бассейне МГИК в Химках, мкрн. Левобережный. Цена зависит только от того, сколько раз в неделю ребёнок ходит в бассейн: чем чаще занятия, тем дешевле одно."
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {prices.map((price, i) => {
          const monthly = monthlyLine(price);
          return (
            <li
              key={price.id}
              /*
                Карточки появляются с той же задержкой, что и во всех остальных
                секциях. Раньше их не было в общем ритме: блок со стоимостью
                единственный возникал разом и на фоне остального выглядел
                статичной вставкой.
              */
              className={`reveal lift flex flex-col rounded-card border p-7 ${
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

              <PriceHeading
                className={`relative mt-4 text-xl font-light ${
                  price.featured ? 'text-white' : 'text-ink'
                }`}
              >
                {price.title}
              </PriceHeading>

              <p
                className={`mt-1 text-sm ${
                  price.featured ? 'text-white/75' : 'text-ink-muted'
                }`}
              >
                {price.note}
              </p>

              <p className={`relative mt-6 flex items-baseline gap-1.5 ${monthly ? '' : 'mb-7'}`}>
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
              {monthly ? (
                <p
                  className={`relative mt-2 mb-7 text-sm ${
                    price.featured ? 'text-white/75' : 'text-ink-muted'
                  }`}
                >
                  {monthly}
                </p>
              ) : null}

              <TariffBookButton
                comment={tariffComment(price)}
                variant={price.featured ? 'secondary' : 'ghost'}
                data-goal="cta_booking"
                className="relative mt-auto w-full"
              >
                Записаться
              </TariffBookButton>
            </li>
          );
        })}
      </ul>

      {/*
        Скидка стояла подзаголовком секции и терялась в сером тексте рядом с
        заголовком. Это выгода, а не сноска, поэтому она вынесена под тарифы
        отдельной плашкой — до юридических оговорок, а не после них.
      */}
      <p className="reveal mt-6 rounded-card border border-brand-100 bg-brand-50 px-7 dark:border-brand-700 dark:bg-brand-900/40 py-5 text-sm leading-relaxed text-ink-soft">
        {pricesNote}
      </p>

      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-muted">
        {pricesDisclaimer} Условия возврата и переноса занятий описаны{' '}
        {/*
          Ссылка появилась вместе со страницей договора. До этого здесь стояло
          «описаны в договоре» без возможности его прочитать — обещание,
          которое проверить нельзя, доверия не прибавляет.
        */}
        <Link
          href="/dogovor/"
          prefetch={false}
          className="font-medium text-brand-600 dark:text-brand-200 underline underline-offset-4"
        >
          в договоре
        </Link>
        , который подписывается до начала занятий. Остались вопросы по оплате —{' '}
        <a
          href={contacts.social.telegramBooking}
          target="_blank"
          rel="noopener noreferrer"
          data-goal="click_telegram_booking"
          className="font-medium text-brand-600 dark:text-brand-200 underline underline-offset-4"
        >
          напишите нам в Telegram
        </a>
        .
      </p>
    </Section>
  );
}
