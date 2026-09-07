import Link from 'next/link';

import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SocialLinks } from './SocialLinks';
import { ButtonLink } from './ui';
import { contacts } from '@/content/contacts';

/*
  Навигация ведёт на отдельные страницы, а не на якоря главной: разделы
  разъехались по своим адресам, и ссылка вида /#schedule вела бы в никуда.
*/
export const navLinks = [
  { href: '/raspisanie/', label: 'Расписание' },
  { href: '/price/', label: 'Стоимость' },
  { href: '/trener/', label: 'Тренер' },
  { href: '/bassein/', label: 'Бассейн' },
  { href: '/roditelyam/', label: 'Родителям' },
  { href: '/galereya/', label: 'Галерея' },
];

export function Header() {
  return (
    <>
      {/*
        Полоска с каналами школы — над липкой шапкой, а не внутри неё.

        Внутри она добавила бы к шапке ещё три десятка пикселей, которые
        висели бы поверх страницы всю прокрутку. Здесь она встречает
        посетителя на любой странице и уезжает вместе с содержимым.

        В самой шапке для них места нет: на ноутбуке 1024 меню, телефон и
        кнопка уже стоят впритык (см. комментарий у навигации). Поэтому
        отдельная строка — она есть и на телефоне: мобильных посетителей у
        школы больше, и «наверху» без них означало бы «у половины».
        Подписи короткие ровно затем, чтобы уместиться в 390 пикселей одной
        строкой; полные названия остались в меню, подвале и «Контактах».
      */}
      <div className="border-b border-hairline bg-surface-alt">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-4 py-1.5 sm:gap-4 sm:px-6 lg:justify-end">
          <span className="text-xs text-ink-muted sm:text-[13px]">
            Каналы школы
          </span>
          <SocialLinks variant="bar" />
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          {/*
            Пояснение лежит внутри ссылки скрытым текстом, а не в aria-label.
            С aria-label доступное имя было «PRIME SWIM — на главную страницу»,
            а на экране написано «PRIMESWIM» слитно: видимая подпись в имя не
            входила, и голосовое управление по ней ссылку не находило
            (WCAG 2.5.3). Теперь имя начинается ровно с того, что видно.
          */}
          <Link href="/" className="shrink-0">
            <Logo />
            <span className="sr-only"> — на главную страницу</span>
          </Link>

          <nav aria-label="Основная навигация" className="ml-auto hidden lg:block">
            {/*
              На 1024 меню, телефон и кнопка вместе шире контейнера, и шапка
              уезжала вбок на пять пикселей. Вместо того чтобы прятать телефон
              или само меню, поджимаем шаг между пунктами и логотип — на
              широком экране и то и другое возвращается к прежнему размеру.
            */}
            <ul className="flex items-center gap-4 xl:gap-6">
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
              <ButtonLink href="#booking" variant="primary" data-goal="cta_booking">
                Записаться
              </ButtonLink>
            </span>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
