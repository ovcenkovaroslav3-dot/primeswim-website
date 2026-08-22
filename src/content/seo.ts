/**
 * SEO-метаданные страниц. Один источник для title, description и Open Graph.
 */

import { site } from './site';

export type PageSeo = {
  title: string;
  description: string;
  /** Путь без домена, например '/policy' */
  path: string;
};

export const seo = {
  home: {
    title: 'Prime Swim — школа плавания в Химках | мкрн. Левобережный, МГИК',
    description:
      'Школа плавания Prime Swim в Химках: занятия для детей с 7 лет в бассейне МГИК на Библиотечной, 7. Группы до 12 человек, тренировки 45 минут, расписание и цены.',
    path: '/',
  },
  /**
   * Для внутренних страниц название школы дописывается автоматически
   * шаблоном в layout.tsx — здесь его указывать не нужно.
   */
  policy: {
    title: 'Политика обработки персональных данных',
    description:
      'Как школа плавания PRIME SWIM обрабатывает персональные данные посетителей сайта primeswim.ru.',
    path: '/policy',
  },
} satisfies Record<string, PageSeo>;

/**
 * Изображение для Open Graph.
 * [ТРЕБУЕТ УТОЧНЕНИЯ] На текущем сайте в OG стоит AI-картинка. Здесь используется
 * реальная фотография бассейна. Согласуйте финальный вариант.
 */
export const ogImage = {
  url: `${site.url}/media/pool/mgik-pool-lanes.jpg`,
  width: 1920,
  height: 2560,
  alt: 'Бассейн МГИК в Химках, где проходят занятия школы плавания PRIME SWIM',
};
