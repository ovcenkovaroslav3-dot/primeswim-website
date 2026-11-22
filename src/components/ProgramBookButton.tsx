'use client';

import { BOOKING_EVENT, programFragment } from '@/lib/booking';
import { buttonClass } from './ui';

export function ProgramBookButton({
  id,
  title,
  chip = false,
}: {
  id: string;
  title: string;
  /** Компактная кнопка с названием направления: для посадочной страницы на тёмном фоне. */
  chip?: boolean;
}) {
  return (
    <a
      href={`#${programFragment(id)}`}
      aria-label={`Записаться на пробное: ${title}`}
      data-goal="cta_booking"
      className={
        chip
          ? 'inline-flex min-h-11 items-center rounded-full border border-white/40 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20'
          : buttonClass('primary', 'md', 'mt-6 self-start')
      }
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { program: id } }));
      }}
    >
      {chip ? title : <>Записаться на пробное <span aria-hidden="true">→</span></>}
    </a>
  );
}
