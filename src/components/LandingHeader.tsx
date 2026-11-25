import Link from 'next/link';

import { BookingLink } from './BookingLink';
import { Logo } from './Logo';
import { buttonClass } from './ui';
import { contacts } from '@/content/contacts';

/*
  Шапка посадочной страницы для рекламы: логотип и способ связи, без меню.
  Человек пришёл из объявления ради одной заявки, и каждая ссылка на другие
  разделы здесь уводит его от формы. Устроена как общая шапка (Header.tsx):
  та же липкая полоса, тот же телефон и та же кнопка записи, только без
  навигации и каналов. На узком экране телефон — иконка в зоне 44 px, на
  широком — номер.
*/
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[75rem] items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 min-w-0 items-center">
          <Logo mark="wide" />
          <span className="sr-only"> — на главную страницу</span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            aria-label={`Позвонить: ${contacts.phone.display}`}
            className="press inline-flex size-11 items-center justify-center rounded-control border border-hairline text-ink hover:bg-surface-alt sm:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M6.2 3.5 8 7l-1.6 1.4a11 11 0 0 0 5.2 5.2L13 12l3.5 1.8v3a1 1 0 0 1-1.1 1A14.4 14.4 0 0 1 2.2 4.6a1 1 0 0 1 1-1.1h3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="hidden py-2 text-sm font-medium whitespace-nowrap text-ink transition-colors hover:text-brand-600 dark:hover:text-brand-200 sm:inline-block"
          >
            {contacts.phone.display}
          </a>
          <span className="hidden sm:block">
            <BookingLink className={buttonClass('primary')} data-goal="cta_booking">
              Записаться
            </BookingLink>
          </span>
        </div>
      </div>
    </header>
  );
}
