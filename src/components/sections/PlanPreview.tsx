import Link from 'next/link';

import { Section, SectionHeading } from '../ui';
import { schedule } from '@/content/schedule';
import { prices, pricesNote } from '@/content/prices';

/*
  Расписание и стоимость рядом — самый нужный блок главной.

  Это два первых вопроса родителя, и раньше ответ на оба лежал за
  переходом: на главной их не было вовсе, только ссылка в общем списке
  разделов. Человек, пришедший с рекламы, должен был догадаться уйти на
  другую страницу — часть уходила вообще.

  Здесь ровно то, что нужно для решения: когда занятия и сколько стоит.
  Всё остальное — недели целиком, оговорки по абонементу, скидки, условия
  переноса — осталось на /raspisanie/ и /price/, куда ведут обе ссылки.
  Блок специально не превращается в третью копию этих страниц: копия
  устареет отдельно от оригинала.

  Данные берутся из тех же файлов, что и полные страницы. Поправить цену
  в одном месте и забыть про главную здесь невозможно.
*/
export function PlanPreview() {
  return (
    <Section id="plan" labelledBy="plan-title" className="bg-surface">
      <SectionHeading
        id="plan-title"
        eyebrow="Когда и сколько"
        title="Расписание и стоимость"
        lead="Занятия идут четыре раза в неделю в бассейне МГИК. Группу подберём по возрасту и уровню подготовки ребёнка."
      />

      <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-2">
        {/* расписание */}
        <div className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8">
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Расписание
          </h3>

          <ul className="mt-6 flex-1 divide-y divide-hairline">
            {schedule.map((slot) => (
              <li
                key={slot.id}
                className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0"
              >
                <span className="text-ink-soft">{slot.day}</span>
                <span className="text-right">
                  <span className="block text-lg font-light tabular-nums text-ink">
                    {slot.time}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {slot.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-hairline pt-5 text-sm text-ink-muted">
            Тренировка — 45 минут, группа до 12 человек.
          </p>

          <Link
            href="/raspisanie/"
            data-goal="cta_schedule"
            prefetch={false}
            className="lift group mt-5 inline-flex items-center gap-2 self-start text-sm font-medium text-brand-600"
          >
            Всё расписание
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
        </div>

        {/* стоимость */}
        <div className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8">
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Стоимость
          </h3>

          <ul className="mt-6 flex-1 divide-y divide-hairline">
            {prices.map((price) => (
              <li
                key={price.id}
                className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0"
              >
                <span className="text-ink-soft">
                  {price.title}
                  <span className="block text-xs text-ink-muted">
                    {price.note}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className={`text-lg font-light tabular-nums ${
                      price.featured ? 'text-brand-600' : 'text-ink'
                    }`}
                  >
                    {price.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  {price.unit ? (
                    <span className="block text-xs text-ink-muted">
                      {price.unit}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-hairline pt-5 text-sm text-ink-muted">
            {pricesNote}
          </p>

          <Link
            href="/price/"
            prefetch={false}
            className="lift group mt-5 inline-flex items-center gap-2 self-start text-sm font-medium text-brand-600"
          >
            Условия оплаты и абонемента
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
        </div>
      </div>
    </Section>
  );
}
