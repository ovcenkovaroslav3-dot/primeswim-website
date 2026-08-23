import type { MetadataRoute } from 'next';

import { site } from '@/content/site';

/**
 * Индексация разрешается только явно, через NEXT_PUBLIC_ALLOW_INDEXING=true.
 * Так тестовое размещение не попадёт в поиск по забывчивости.
 */
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

  if (!allowIndexing) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

// сайт собирается в статику: файл должен быть посчитан на сборке
export const dynamic = 'force-static';
