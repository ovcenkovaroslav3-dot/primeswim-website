'use client';

import { BOOKING_EVENT, programFragment } from '@/lib/booking';
import { buttonClass } from './ui';

export function ProgramBookButton({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`#${programFragment(id)}`}
      aria-label={`Записаться на пробное: ${title}`}
      data-goal="cta_booking"
      className={buttonClass('primary', 'md', 'mt-6 self-start')}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { program: id } }));
      }}
    >
      Записаться на пробное <span aria-hidden="true">→</span>
    </a>
  );
}
