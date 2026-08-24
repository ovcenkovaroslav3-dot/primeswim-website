import { ButtonLink, Section, SectionHeading } from '../ui';
import { schedule, scheduleIntro, weekDays } from '@/content/schedule';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

/*
  Расписание.

  Сверху — полоса недели целиком, а не только дни с занятиями. Так виден
  ритм: две тренировки в будни и две в выходные, между ними перерыв.
  Четыре карточки вразнобой этого не показывали.

  Полоса помечена как изображение с текстовым описанием: по отдельности
  «Пн Вт Ср» ничего не сообщают программе чтения с экрана, а списком дней
  с занятиями — сообщают.

  Длительность занятия вынесена во вступление: раньше «45 минут» стояло
  в каждой карточке и работало шумом, а не информацией.
*/
export function Schedule() {
  const active = new Map(schedule.map((s) => [s.short, s]));
  const activeDays = schedule.map((s) => `${s.day.toLowerCase()} в ${s.time}`);

  return (
    <Section id="schedule" labelledBy="schedule-title" className="bg-surface-alt">
      <SectionHeading
        id="schedule-title"
        eyebrow="Расписание"
        title="Когда проходят тренировки"
        lead={scheduleIntro}
      />

      <div
        className="reveal mt-12 grid grid-cols-7 gap-2 sm:gap-3"
        role="img"
        aria-label={`Занятия проходят: ${activeDays.join(', ')}`}
      >
        {weekDays.map((d) => {
          const slot = active.get(d);
          return (
            <div
              key={d}
              aria-hidden="true"
              className={`flex flex-col items-center rounded-[14px] border py-4 ${
                slot
                  ? 'border-brand-300 bg-surface'
                  : 'border-transparent bg-surface/40'
              }`}
            >
              <span
                className={`text-xs font-medium tracking-[0.14em] uppercase ${
                  slot ? 'text-brand-600' : 'text-ink-muted/60'
                }`}
              >
                {d}
              </span>
              {/*
                На узком экране время в ячейку не влезает и вылезает за рамку,
                поэтому там остаётся только отметка — само время идёт списком ниже.
              */}
              <span
                className={`mt-2 size-1.5 rounded-full sm:hidden ${
                  slot ? 'bg-brand-500' : 'bg-ink-muted/25'
                }`}
              />
              <span
                className={`mt-2 hidden text-sm tabular-nums sm:block sm:text-base ${
                  slot ? 'font-light text-ink' : 'text-ink-muted/45'
                }`}
              >
                {slot ? slot.time : '—'}
              </span>
            </div>
          );
        })}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {schedule.map((slot, i) => (
          <li
            key={slot.id}
            className="reveal flex items-baseline justify-between gap-3 rounded-[14px] border border-hairline bg-surface px-5 py-4"
            style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
          >
            <span className="text-sm text-ink-soft">{slot.day}</span>
            <span className="text-right">
              <span className="block text-lg font-light tabular-nums text-ink">
                {slot.time}
              </span>
              <span className="block text-xs text-ink-muted">{slot.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="reveal mt-8 flex flex-col items-start gap-4 rounded-[20px] border border-hairline bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-soft">
          Не нашли удобное время? Напишите — подберём группу под ваш график.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            href={contacts.social.telegramBooking}
            external
            variant="primary"
            data-goal="click_telegram"
          >
            {site.cta.telegram}
          </ButtonLink>
          <ButtonLink
            href={contacts.social.max}
            external
            variant="ghost"
            data-goal="click_max"
          >
            {site.cta.max}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
