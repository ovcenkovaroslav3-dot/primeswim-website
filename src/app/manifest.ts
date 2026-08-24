import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/**
 * Пути внутри манифеста Next.js не переписывает — в отличие от ссылок в
 * разметке. Пока сайт живёт по адресу вида user.github.io/primeswim-website,
 * '/' в start_url увёл бы установленное приложение в корень домена, а иконки
 * просто не нашлись бы. Поэтому basePath приклеиваем руками; при переезде на
 * собственный домен переменная пустеет и всё остаётся корректным.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description:
      'Групповые занятия по плаванию для детей в бассейне МГИК, Химки.',
    id: `${base}/`,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    background_color: '#4f017b',
    theme_color: '#4f017b',
    lang: 'ru',
    icons: [
      {
        src: `${base}/media/brand/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${base}/media/brand/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      /*
        Отдельная маскируемая иконка: Android обрезает её по форме темы
        (круг, капля, скруглённый квадрат). У неё буква меньше и лежит внутри
        безопасной зоны, иначе система срезала бы «P» по краям.
      */
      {
        src: `${base}/media/brand/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

// сайт собирается в статику: файл должен быть посчитан на сборке
export const dynamic = 'force-static';
