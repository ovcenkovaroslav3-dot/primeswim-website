import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui';
import { contacts } from '@/content/contacts';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-32">
      <p className="font-display text-6xl font-extrabold text-brand-600 sm:text-7xl">
        404
      </p>
      <h1 className="mt-6 font-display text-2xl font-bold text-ink sm:text-3xl">
        Такой страницы нет
      </h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Возможно, адрес введён с ошибкой или страница была перенесена.
        Вернитесь на главную — там расписание, цены и запись на занятие.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          На главную
        </ButtonLink>
        <ButtonLink href="/#booking" variant="ghost" size="lg">
          Записаться на тренировку
        </ButtonLink>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Или позвоните нам:{' '}
        <a
          href={contacts.phone.href}
          className="font-semibold text-brand-600 underline underline-offset-4"
        >
          {contacts.phone.display}
        </a>
      </p>
    </div>
  );
}
