import Link from 'next/link';

import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ButtonLink } from './ui';
import { contacts } from '@/content/contacts';

export const navLinks = [
  { href: '/#why', label: 'Почему мы' },
  { href: '/#strokes', label: 'Стили' },
  { href: '/#training', label: 'Тренировки' },
  { href: '/#schedule', label: 'Расписание' },
  { href: '/#prices', label: 'Стоимость' },
  { href: '/#parents', label: 'Родителям' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0"
          aria-label="PRIME SWIM — на главную страницу"
        >
          <Logo />
        </Link>

        <nav aria-label="Основная навигация" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="hidden text-sm font-medium whitespace-nowrap text-ink transition-colors hover:text-brand-600 md:inline"
          >
            {contacts.phone.display}
          </a>
          {/*
            Прячем обёрткой, а не самой кнопкой: у ButtonLink в базовых классах
            уже есть inline-flex, и он перебивал hidden — кнопка оставалась
            видимой на узких экранах и разрывала шапку.
          */}
          <span className="hidden sm:block">
            <ButtonLink href="/#booking" variant="primary" data-goal="cta_booking">
              Записаться
            </ButtonLink>
          </span>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
