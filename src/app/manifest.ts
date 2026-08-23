import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description:
      'Групповые занятия по плаванию для детей в бассейне МГИК, Химки.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f017b',
    lang: 'ru',
  };
}

// сайт собирается в статику: файл должен быть посчитан на сборке
export const dynamic = 'force-static';
