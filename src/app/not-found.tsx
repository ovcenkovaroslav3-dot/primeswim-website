import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui';
import { WaterScene } from '@/components/WaterScene';
import { contacts } from '@/content/contacts';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
};

/*
  Страница 404 сделана на той же тёмной сцене, что первый экран и блок записи.
  Раньше она была единственным местом сайта, где не было ни воды, ни глубины:
  человек, попавший сюда по битой ссылке, видел белый лист и мог решить, что
  ушёл куда-то не туда. Теперь ошибка выглядит частью сайта, а не сбоем.
*/
export default function NotFound() {
  return (
    <section
      aria-labelledby="notfound-title"
      className="on-dark relative isolate flex min-h-[78vh] items-center overflow-clip bg-abyss-950 px-4 py-24 text-white sm:px-6 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <WaterScene />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-abyss-950/70" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <p className="font-display text-[clamp(4.5rem,18vw,9rem)] leading-none font-extrabold tracking-tight text-lime-400">
          404
        </p>

        <h1
          id="notfound-title"
          className="mt-6 text-[clamp(1.6rem,5vw,2.4rem)] leading-tight font-extralight"
        >
          Такой страницы нет
        </h1>

        <p className="mx-auto mt-5 max-w-[46ch] leading-relaxed text-white/70">
          Возможно, адрес введён с ошибкой или страница была перенесена.
          Вернитесь на главную — там расписание, цены и запись на занятие.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            На главную
          </ButtonLink>
          <ButtonLink href="/#booking" variant="outline" size="lg">
            Записаться на тренировку
          </ButtonLink>
        </div>

        <p className="mt-10 text-sm text-white/60">
          Или позвоните нам:{' '}
          <a
            href={contacts.phone.href}
            className="font-medium text-lime-300 underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
