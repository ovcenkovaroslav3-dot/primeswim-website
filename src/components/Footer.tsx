import Link from 'next/link';

import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-abyss-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {site.tagline}. Групповые занятия для детей в бассейне МГИК.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Контакты
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <a
                  href={contacts.phone.href}
                  className="font-medium text-white transition-colors hover:text-lime-300"
                >
                  {contacts.phone.display}
                </a>
              </li>
              <li>{contacts.address.short}</li>
              <li>
                <a
                  href={contacts.address.yandexMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-lime-300"
                >
                  Посмотреть на Яндекс Картах
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <SocialLinks inverted />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Разделы
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <Link
                  href="/raspisanie/"
                  className="transition-colors hover:text-lime-300"
                >
                  Расписание
                </Link>
              </li>
              <li>
                <Link
                  href="/price/"
                  className="transition-colors hover:text-lime-300"
                >
                  Стоимость занятий
                </Link>
              </li>
              <li>
                <Link
                  href="#booking"
                  className="transition-colors hover:text-lime-300"
                >
                  Запись на тренировку
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="transition-colors hover:text-lime-300"
                >
                  Политика обработки персональных данных
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/*
          Сведения об исполнителе. Статья 9 Закона «О защите прав
          потребителей» требует показать их самому потребителю, а не прятать
          в политике: ФИО предпринимателя, данные о госрегистрации,
          наименование зарегистрировавшего органа и режим работы.
        */}
        <div className="mt-12 space-y-3 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/55">
          <p>
            {contacts.legal.operator}. ОГРНИП {contacts.legal.ogrnip}, ИНН{' '}
            {contacts.legal.inn}. Зарегистрирован:{' '}
            {contacts.legal.registrar}.
          </p>
          <p>
            Режим работы: {contacts.workingHours}. Место оказания услуг:{' '}
            {contacts.address.full}.
          </p>
          <p>
            © {year} {site.name}. Информация на сайте не является публичной
            офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
