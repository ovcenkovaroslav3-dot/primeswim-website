import Link from 'next/link';

import { Section, SectionHeading } from './ui';

/*
  Разделы сайта на главной.

  Появился вместе с разбивкой на страницы. Раньше всё лежало на одной
  ленте, и «навигация» сводилась к прокрутке. Теперь у разделов свои
  адреса, а на телефоне меню в шапке спрятано под кнопку — без явного
  блока со ссылками половина сайта осталась бы ненайденной.

  Порядок тот же, что в карте сайта: сначала расписание и цены, потому
  что с них начинается выбор школы.
*/
const links = [
  {
    href: '/raspisanie/',
    title: 'Расписание',
    description: 'Дни и время занятий детских групп.',
  },
  {
    href: '/price/',
    title: 'Стоимость',
    description: 'Разовое занятие, абонемент и условия оплаты.',
  },
  {
    href: '/trener/',
    title: 'Тренер',
    description: 'Кто ведёт занятия и с чем работает.',
  },
  {
    href: '/bassein/',
    title: 'Бассейн',
    description: 'Где проходят тренировки и как устроено занятие.',
  },
  {
    href: '/roditelyam/',
    title: 'Родителям',
    description: 'С каким уровнем приходить и частые вопросы.',
  },
  {
    href: '/galereya/',
    title: 'Галерея',
    description: 'Фото и видео с тренировок и соревнований.',
  },
  {
    href: '/sorevnovaniya/',
    title: 'Соревнования',
    description: 'Старты, сборы и спортивные разряды.',
  },
];

export function SiteMap() {
  return (
    <Section id="sections" labelledBy="sections-title" className="bg-surface-alt">
      <SectionHeading
        id="sections-title"
        eyebrow="Разделы"
        title="Что ещё есть на сайте"
        lead="Подробности вынесены на отдельные страницы — так быстрее найти нужное."
      />

      <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {links.map((link, i) => (
          <li
            key={link.href}
            className="reveal"
            style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
          >
            <Link
              href={link.href}
              className="lift group flex h-full flex-col rounded-[20px] border border-hairline bg-surface p-6 transition-colors hover:border-brand-300"
            >
              <span className="flex items-center gap-2 text-lg font-medium text-ink">
                {link.title}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="text-brand-600 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M4 14 14 4M6 4h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="mt-2 text-sm leading-relaxed text-ink-soft">
                {link.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
