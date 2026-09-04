import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/*
  Карта сайта.

  Приоритеты расставлены по тому, ради чего родитель приходит из поиска:
  сначала расписание и цены — это два вопроса, с которых начинается выбор
  школы, — потом тренер и бассейн, потом остальное.

  Все адреса со слешем на конце: сборка настроена на trailingSlash, и без
  него адрес в карте не совпадал бы с каноническим.
*/
const routes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/raspisanie/', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/price/', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/trener/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/bassein/', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/roditelyam/', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/galereya/', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/sorevnovaniya/', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/policy/', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/soglasie/', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

// сайт собирается в статику: файл должен быть посчитан на сборке
export const dynamic = 'force-static';
