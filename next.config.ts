import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
