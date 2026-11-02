'use client';

import { requestBooking } from '@/lib/booking';
import { buttonClass } from './ui';

export function ProgramBookButton({ id, title }: { id: string; title: string }) {
  return (
    <a
      href="#booking"
      aria-label={`Подобрать группу: ${title}`}
      className={buttonClass('primary', 'md', 'mt-6 self-start')}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        requestBooking({ program: id });
      }}
    >
      Подобрать группу <span aria-hidden="true">→</span>
    </a>
  );
}
