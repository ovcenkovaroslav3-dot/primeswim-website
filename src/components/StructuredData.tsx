/**
 * Разметка Schema.org.
 * Включены только подтверждённые сведения: название, адрес, телефон, соцсети.
 * Рейтинги и отзывы намеренно не размечены — их достоверность не подтверждена.
 */

import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { seo } from '@/content/seo';

export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: site.name,
    description: seo.home.description,
    url: site.url,
    telephone: contacts.phone.display,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address.street,
      addressLocality: contacts.address.city,
      addressRegion: contacts.address.region,
      addressCountry: 'RU',
    },
    sameAs: [
      contacts.social.vk,
      contacts.social.telegramChannel,
      contacts.address.yandexMaps,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
