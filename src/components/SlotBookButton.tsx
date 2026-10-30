'use client';

import { trackGoal } from '@/lib/analytics';
import { requestBooking } from '@/lib/booking';

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
}: {
  /** Значение из slotOptions (content/schedule.ts) */
  value: string;
  time: string;
  /** «Понедельник, 19:00» — для программы чтения с экрана */
  label: string;
}) {
  return (
    <a
      href="#booking"
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        trackGoal('pick_slot', { slot: value });
        requestBooking({ slot: value });
      }}
      aria-label={`Выбрать время: ${label} — подставим в заявку`}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-300 bg-surface px-4 text-lg font-light tabular-nums text-ink transition-colors hover:border-brand-500 hover:bg-brand-50 dark:hover:border-brand-200 dark:hover:bg-brand-900/40"
    >
      {time}
      <span
        aria-hidden="true"
        className="text-sm text-brand-600 dark:text-brand-200 transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}
