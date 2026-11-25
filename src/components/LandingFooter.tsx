import Link from 'next/link';

import { Logo } from './Logo';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

/*
  Урезанный подвал посадочной страницы: контакты, три обязательных документа
  и сведения об исполнителе (ст. 9 Закона «О защите прав потребителей»), как в
  общем Footer.tsx. Разделов сайта здесь нет — см. LandingHeader.tsx.
*/
export function LandingFooter() {
  const year = new Date().getFullYear();
  const linkClass =
    'flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300';

  return (
    <footer className="on-dark bg-abyss-900 text-white">
      <div className="mx-auto w-full max-w-[75rem] px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {site.tagline}. Групповые занятия для детей в бассейне МГИК.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-white/80">
              <li>
                <a
                  href={contacts.phone.href}
                  data-goal="click_phone"
                  className="-my-2 inline-flex min-h-11 items-center font-medium text-white transition-colors hover:text-lime-300"
                >
                  {contacts.phone.display}
                </a>
              </li>
              <li>{contacts.address.short}</li>
            </ul>
          </div>

          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <Link href="/dogovor/" prefetch={false} className={linkClass}>
                Договор на занятия
              </Link>
            </li>
            <li>
              <Link href="/policy/" prefetch={false} className={linkClass}>
                Политика обработки персональных данных
              </Link>
            </li>
            <li>
              <Link href="/soglasie/" prefetch={false} className={linkClass}>
                Согласие на обработку персональных данных
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 space-y-3 border-t border-white/15 pt-6 text-sm leading-relaxed text-white/55">
          <p>
            {contacts.legal.operator}. ОГРНИП {contacts.legal.ogrnip}, ИНН {contacts.legal.inn}.
            Зарегистрирован: {contacts.legal.registrar}.
          </p>
          <p>
            Режим работы: {contacts.workingHours.display}. Место оказания услуг:{' '}
            {contacts.address.full}.
          </p>
          <p>
            © {year} {site.name}. Информация на сайте не является публичной офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
