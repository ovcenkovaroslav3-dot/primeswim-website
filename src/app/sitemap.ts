import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      // со слешем на конце: сборка настроена на trailingSlash,
      // и без него адрес в карте сайта не совпадал бы с каноническим
      url: `${site.url}/policy/`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

// сайт собирается в статику: файл должен быть посчитан на сборке
export const dynamic = 'force-static';
