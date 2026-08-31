import { contacts } from '@/content/contacts';

/*
  Публичные страницы школы: ВКонтакте и каналы в Telegram и MAX.

  Здесь только чтение. Личные чаты, куда пишут заявку, живут отдельно — в
  кнопках «Написать в Telegram/MAX» — и отправляют другие цели. Раньше цель
  была общая (`click_telegram`), и в отчёте открытие канала складывалось с
  обращением в личку: два противоположных действия выглядели одним числом.

  Подпись собрана из видимого текста и скрытой расшифровки, а не из
  aria-label поверх него. С aria-label кнопка «VK» называлась для
  скринридера «ВКонтакте»: видимое и озвученное расходились, и голосовое
  управление по команде «нажми VK» кнопку не находило (WCAG 2.5.3).
*/
const links = [
  {
    href: contacts.social.vk,
    short: 'VK',
    label: 'ВКонтакте',
    goal: 'click_vk',
  },
  {
    href: contacts.social.telegramChannel,
    short: 'TG',
    label: 'Telegram-канал',
    goal: 'click_telegram_channel',
  },
  {
    href: contacts.social.maxChannel,
    short: 'MAX',
    label: 'канал в MAX',
    goal: 'click_max_channel',
  },
];

export function SocialLinks({ inverted = false }: { inverted?: boolean }) {
  const itemClass = inverted
    ? 'border-white/30 text-white hover:border-lime-300 hover:text-lime-300'
    : 'border-hairline text-ink-soft hover:border-brand-500 hover:text-brand-600';

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-goal={link.goal}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${itemClass}`}
          >
            {link.short}
            <span className="sr-only"> — {link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
