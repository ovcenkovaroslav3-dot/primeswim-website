import type { NextConfig } from 'next';

/*
  Сайт собирается в статику и живёт на GitHub Pages.
  basePath нужен, пока адрес вида user.github.io/primeswim-website — при
  переезде на собственный домен достаточно очистить NEXT_PUBLIC_BASE_PATH.
*/
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  // хвостовой слеш даёт папку с index.html на каждый маршрут — так Pages
  // отдаёт /policy/ без ручной настройки перезаписей
  trailingSlash: true,
  images: {
    // на статике оптимизировать нечем; свой загрузчик нужен только чтобы
    // приклеить basePath — встроенный этого не делает
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    /*
      AVIF сжимает фотографии заметно лучше WebP. Браузер сам выбирает формат,
      который понимает: сначала пробуется AVIF, затем WebP, иначе исходный JPEG.
    */
    formats: ['image/avif', 'image/webp'],

    /*
      Исходники не шире 2560 px, поэтому запрашивать более крупные размеры
      незачем — это только тратит время на пересжатие.
    */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],

    // Кешируем оптимизированные варианты на 30 дней.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
