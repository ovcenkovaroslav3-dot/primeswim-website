'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

/*
  Ссылка «Записаться» для шапки, подвала, меню и липкой панели.

  Эти блоки общие для всего сайта, а форма записи (#booking) есть не везде:
  на страницах договора, политики, согласия и на 404 голый «#booking» вёл
  в никуда. «/#booking» работает и до гидратации: без формы на странице Link
  уводит на главную к форме. Если форма на странице есть, остаёмся на ней и
  плавно прокручиваем к блоку, как раньше делал нативный якорь. Отступ под
  шапку даёт scroll-padding-top у html. Тот же запасной путь на главную у
  requestBooking (lib/booking.ts) для записи с подставленными полями.
*/
export function BookingLink({
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const section = document.getElementById('booking');
    if (!section) return;

    event.preventDefault();
    // в кадре, а не сразу: меню закрывается этим же кликом, и блокировка
    // прокрутки (body overflow) должна успеть сняться до scrollIntoView
    requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return <Link {...rest} href="/#booking" prefetch={false} onClick={handleClick} />;
}
