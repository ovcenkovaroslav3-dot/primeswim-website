'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/*
  Шапка и подвал посадочной страницы для рекламы отличаются от общих: нет
  меню, чтобы из объявления не уходили с формы. Общий layout один на весь
  сайт, поэтому выбор делается по адресу. Адрес известен уже при сборке
  статики, так что в HTML попадает только нужный вариант.
*/
export const LANDING_PATH = '/probnoe-zanyatie';

export function ChromeSwitch({ full, landing }: { full: ReactNode; landing: ReactNode }) {
  const pathname = usePathname() ?? '';
  const isLanding = pathname === LANDING_PATH || pathname.startsWith(`${LANDING_PATH}/`);
  return <>{isLanding ? landing : full}</>;
}
