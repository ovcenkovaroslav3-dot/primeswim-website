import { contacts } from '@/content/contacts';

const links = [
  { href: contacts.social.vk, label: 'ВКонтакте', short: 'VK' },
  { href: contacts.social.telegramChannel, label: 'Telegram-канал', short: 'TG' },
  { href: contacts.social.max, label: 'Сообщество в MAX', short: 'MAX' },
];

export function SocialLinks({ inverted = false }: { inverted?: boolean }) {
  const itemClass = inverted
    ? 'border-white/30 text-white hover:border-lime-brand hover:text-lime-brand'
    : 'border-hairline text-ink-soft hover:border-brand-600 hover:text-brand-600';

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors ${itemClass}`}
          >
            {link.short}
          </a>
        </li>
      ))}
    </ul>
  );
}
