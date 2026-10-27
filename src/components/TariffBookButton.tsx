'use client';

import type { ComponentProps } from 'react';
import { ButtonLink } from './ui';
import { requestBooking } from '@/lib/booking';

/*
  Кнопка «Записаться» в карточке тарифа (27 октября 2026).

  Раньше все три кнопки были одинаковой ссылкой на #booking: родитель выбирал
  тариф, а форма об этом не знала, и в заявке не было видно, какой он имел в
  виду. Теперь выбор уходит в комментарий формы. Prices остаётся серверным
  компонентом, поэтому обработчик клика живёт здесь, в маленьком клиентском.

  href="#booking" оставлен как запасной путь без скриптов: ссылка просто
  приведёт к форме. С включённым JS переход делает requestBooking, а при
  клике с Ctrl/Cmd/Shift или не левой кнопкой оставляем поведение браузера.
*/
export function TariffBookButton({
  comment,
  ...props
}: { comment: string } & Omit<ComponentProps<typeof ButtonLink>, 'href' | 'onClick'>) {
  return (
    <ButtonLink
      {...props}
      href="#booking"
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        requestBooking({ comment });
      }}
    />
  );
}
