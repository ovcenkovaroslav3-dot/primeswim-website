'use client';

import { trackGoal } from '@/lib/analytics';
import { BOOKING_EVENT, slotFragment } from '@/lib/booking';
import { ArrowIcon } from './ui';

/*
  Время в расписании, по которому можно нажать.

  Раньше расписание было только для чтения: родитель находил удобное время
  и дальше должен был сам перенести его в комментарий формы — или не
  переносил, и администратор спрашивал заново. Теперь касание по времени
  подставляет его в заявку и уводит к форме; всё остальное родитель
  заполняет как обычно. Мест кнопка не бронирует и не обещает — это сказано
  рядом с расписанием и в самой форме.
*/
export function SlotBookButton({
  value,
  time,
  label,
  compact = false,
  dark = false,
}: {
  /** Значение из slotOptions (content/schedule.ts) */
  value: string;
  time: string;
  /** «Понедельник, 19:00» — для программы чтения с экрана */
  label: string;
  compact?: boolean;
  dark?: boolean;
}) {
  /*
    Доступное имя начинается с видимого текста (WCAG 2.5.3): тот, кто управляет
    голосом, говорит «Вт 19:45», а не пересказ. В полном варианте на кнопке
    только время, день виден из строки расписания, поэтому в имени он идёт
    после времени.
  */
  const day = label.split(',')[0]?.trim();
  const accessibleName = compact || !day
    ? `${time} — выбрать время, подставим в заявку`
    : `${time}, ${day} — выбрать время, подставим в заявку`;

  return (
    <a
      href={`#${slotFragment(value)}`}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        trackGoal('pick_slot', { slot: value });
        window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { slot: value } }));
      }}
      data-goal="cta_booking"
      aria-label={accessibleName}
      className={`press inline-flex min-h-11 items-center rounded-full border tabular-nums ${compact ? 'gap-1 px-2 text-sm font-medium' : 'gap-2 px-4 text-lg font-light'} ${dark ? 'border-white/40 bg-white/10 text-white hover:bg-white/20' : 'border-brand-300 bg-surface text-ink hover:border-brand-500 hover:bg-brand-50 dark:hover:border-brand-200 dark:hover:bg-brand-900/40'}`}
    >
      {time}
      {compact ? null : <ArrowIcon size={13} className="text-brand-600 dark:text-brand-200" />}
    </a>
  );
}
