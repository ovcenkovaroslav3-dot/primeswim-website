import { contacts } from '@/content/contacts';

/*
  Публичные страницы школы: ВКонтакте и каналы в Telegram и MAX.

  Здесь только чтение. Личные чаты, куда пишут заявку, живут отдельно — в
  кнопках «Написать в Telegram/MAX» — и отправляют другие цели. Раньше цель
  была общая (`click_telegram`), и в отчёте открытие канала складывалось с
  обращением в личку: два противоположных действия выглядели одним числом.

  Подписи полные, а не «VK/TG/MAX». Аббревиатуры в кружках владелец не
  находил на собственном сайте: три одинаковых кругляша по 40 пикселей
  читались как декор, а не как ссылки, и по ним не было понятно, куда
  они ведут. Заодно ушёл и приём с sr-only-расшифровкой: когда видимый
  текст сам называет ссылку, прятать расшифровку больше не от кого, и
  видимое совпадает с озвученным (WCAG 2.5.3).
*/
const links = [
  {
    href: contacts.social.telegramChannel,
    label: 'Telegram-канал',
    short: 'Telegram',
    tail: '-канал',
    handle: 't.me/prime_swim',
    goal: 'click_telegram_channel',
  },
  {
    href: contacts.social.maxChannel,
    label: 'Канал в MAX',
    short: 'MAX',
    tail: ' — канал школы',
    handle: 'max.ru',
    goal: 'click_max_channel',
  },
  {
    href: contacts.social.vk,
    label: 'ВКонтакте',
    short: 'ВКонтакте',
    tail: ' — страница школы',
    handle: 'vk.com/primeswim',
    goal: 'click_vk',
  },
];

/**
 * `inline` — строка ссылок для подвала и мобильного меню.
 * `cards` — крупные плитки с адресом канала, для секции «Контакты».
 * `bar` — узкая строка для полоски над шапкой.
 */
export function SocialLinks({
  inverted = false,
  variant = 'inline',
  align = 'start',
}: {
  inverted?: boolean;
  variant?: 'inline' | 'cards' | 'bar';
  /*
    Выравнивание строки ссылок. Обёртки с justify-center снаружи мало:
    при переносе список занимает всю доступную ширину, и вторая строка
    всё равно липнет к левому краю — центрировать надо сам список.
  */
  align?: 'start' | 'center';
}) {
  if (variant === 'bar') {
    /*
      В полоске над шапкой места мало, поэтому подписи короткие: слово
      «каналы» стоит один раз слева, для всех трёх сразу. Уточнение уезжает
      в sr-only — и не просто так: доступное имя начинается ровно с того,
      что написано на экране («Telegram» → «Telegram-канал»), поэтому
      голосовое управление находит ссылку по видимому слову (WCAG 2.5.3).
    */
    return (
      <ul className="flex items-center gap-3 sm:gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-goal={link.goal}
              /* py-1.5 расширяет зону нажатия до 28 пикселей: без него
                 палец на телефоне целится в 16, а с py-1 — в 24, ровно
                 в минимум WCAG 2.5.8. Высоту полоски это не меняет —
                 её собственные отступы уменьшены на столько же. */
              className="inline-block py-1.5 text-xs font-medium text-brand-600 underline-offset-4 transition-colors hover:underline sm:text-[13px]"
            >
              {link.short}
              <span className="sr-only">{link.tail}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'cards') {
    return (
      <ul className="grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-goal={link.goal}
              className="lift flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface px-5 py-4 transition-colors hover:border-brand-500"
            >
              <span>
                <span className="block text-base font-medium text-ink">
                  {link.label}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">
                  {link.handle}
                </span>
              </span>
              {/* стрелка «наружу»: ссылка открывается в новой вкладке */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden="true"
                fill="none"
                className="shrink-0 text-brand-600"
              >
                <path
                  d="M4 10L10 4M10 4H5M10 4v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  const itemClass = inverted
    ? 'border-white/30 text-white hover:border-lime-300 hover:text-lime-300'
    : 'border-hairline text-ink-soft hover:border-brand-500 hover:text-brand-600';

  return (
    <ul
      className={`flex flex-wrap items-center gap-2 ${
        align === 'center' ? 'justify-center' : ''
      }`.trim()}
    >
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-goal={link.goal}
            className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${itemClass}`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
