import { contacts } from '@/content/contacts';

const links = [
  { href: contacts.social.vk, label: 'ВКонтакте', short: 'VK', goal: 'click_vk' },
  {
    href: contacts.social.telegramChannel,
    label: 'Telegram-канал',
    short: 'TG',
    goal: 'click_telegram',
  },
  {
    href: contacts.social.max,
    label: 'Сообщество в MAX',
    short: 'MAX',
    goal: 'click_max',
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
            aria-label={link.label}
            data-goal={link.goal}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors ${itemClass}`}
          >
            {link.short}
          </a>
        </li>
      ))}
    </ul>
  );
}
