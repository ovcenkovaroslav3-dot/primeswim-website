/**
 * Разметка Schema.org.
 *
 * Включены только подтверждённые сведения: название, адрес, координаты,
 * телефон, цены, соцсети. Рейтинги и отзывы намеренно не размечены — их
 * достоверность не подтверждена, а выдуманный рейтинг в разметке это прямое
 * нарушение правил и поисковых систем, и закона о рекламе.
 */

import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { coaches } from '@/content/coaches';
import { prices } from '@/content/prices';
import { ogImage, seo } from '@/content/seo';

/** Устойчивые идентификаторы: по ним разные куски разметки ссылаются друг на друга. */
export const schemaId = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
};

/**
 * Один блок JSON-LD. Отдельным компонентом, потому что разметка нужна не
 * только на главной: хлебные крошки и вопросы живут на своих страницах.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const coach = coaches[0];
const amounts = prices.map((price) => price.amount);

export function StructuredData() {
  const organization = {
    '@type': 'SportsActivityLocation',
    '@id': schemaId.organization,
    name: site.name,
    alternateName: 'Школа плавания PRIME SWIM',
    description: seo.home.description,
    url: `${site.url}/`,
    // без картинки поиск подставляет к карточке что придётся или ничего
    image: ogImage.url,
    logo: ogImage.url,
    telephone: contacts.phone.display,
    email: contacts.legal.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address.street,
      addressLocality: contacts.address.city,
      addressRegion: contacts.address.region,
      postalCode: contacts.address.postalCode,
      addressCountry: 'RU',
    },
    /*
      Точка на карте. Главное, ради чего добавлена: она связывает сайт с
      карточкой организации в Яндекс Картах, а без этой связки школа не
      попадает в локальную выдачу «рядом со мной» и в колдунщик карт.
    */
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contacts.address.geo.lat,
      longitude: contacts.address.geo.lon,
    },
    hasMap: contacts.address.yandexMaps,
    /*
      Часы работы. Размечены после того, как владелец подтвердил фактический
      режим (27.08.2026): до этого на сайте стояло время занятий, а это не
      режим работы школы, и разметить его значило бы сообщить поиску неправду.

      Яндекс показывает часы прямо в выдаче и в карточке организации — при
      расхождении с Яндекс Бизнесом побеждает карточка, поэтому интервал
      здесь должен совпадать с ней слово в слово.
    */
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: contacts.workingHours.days.map(
        (day) => `https://schema.org/${day}`,
      ),
      opens: contacts.workingHours.opens,
      closes: contacts.workingHours.closes,
    },
    /*
      Зона обслуживания. Родитель ищет школу не «в Московской области»,
      а в своих Химках и своём районе — поэтому названы оба.
    */
    areaServed: [
      { '@type': 'City', name: 'Химки' },
      { '@type': 'Place', name: 'мкрн. Левобережный, Химки' },
    ],
    // диапазон собирается из прайса: править цену нужно в одном месте
    priceRange: `${Math.min(...amounts)}–${Math.max(...amounts)} ₽`,
    currenciesAccepted: 'RUB',
    sport: 'Плавание',
    founder: {
      '@type': 'Person',
      name: coach.name,
      jobTitle: coach.role,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Занятия плаванием',
      itemListElement: prices.map((price) => ({
        '@type': 'Offer',
        name: price.title,
        description: price.note,
        price: price.amount,
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
      })),
    },
    sameAs: [
      contacts.social.vk,
      contacts.social.telegramChannel,
      contacts.address.yandexMaps,
    ],
  };

  /*
    WebSite отдельным узлом: он говорит поиску, что домен и школа — это одно
    и то же, и даёт название сайта в сниппете. Поиск по сайту не размечен —
    его на сайте нет, а обещать несуществующее поисковику незачем.
  */
  const website = {
    '@type': 'WebSite',
    '@id': schemaId.website,
    url: `${site.url}/`,
    name: site.name,
    inLanguage: 'ru-RU',
    publisher: { '@id': schemaId.organization },
  };

  return (
    <JsonLd
      data={{ '@context': 'https://schema.org', '@graph': [organization, website] }}
    />
  );
}
