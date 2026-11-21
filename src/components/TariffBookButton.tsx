'use client';

import type { ComponentProps } from 'react';
import { ButtonLink, buttonClass } from './ui';
import { BOOKING_EVENT, tariffFragment } from '@/lib/booking';

/* Фрагмент сохраняет выбор при переходе до подключения формы. */
export function TariffBookButton({
  tariff,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: { tariff: string } & Omit<ComponentProps<typeof ButtonLink>, 'href' | 'onClick' | 'external'>) {
  return (
    <a
      {...props}
      className={buttonClass(variant, size, className)}
      href={`#${tariffFragment(tariff)}`}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        window.dispatchEvent(new CustomEvent(BOOKING_EVENT, { detail: { tariff } }));
      }}
    />
  );
}
