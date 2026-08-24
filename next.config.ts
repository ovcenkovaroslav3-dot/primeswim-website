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
    /*
      На статике нет сервера, который пересжимал бы картинки, поэтому
      оптимизации нет вообще: браузер получает те же файлы, что лежат в
      public. Свой загрузчик нужен ровно для одного — приклеить basePath;
      встроенный этого не делает, и на GitHub Pages всё отдавало бы 404.

      Отключить оптимизацию через images.unoptimized нельзя: тогда Next
      перестаёт вызывать загрузчик и basePath из путей пропадает. Проверено
      сборкой — в разметке остаётся голое «/media/...».

      Здесь стояли ещё formats, deviceSizes и minimumCacheTTL. Все три
      относятся к встроенному оптимизатору и при своём загрузчике не делают
      ничего: ни одного avif или webp сборка не создавала, srcset не
      генерировался. Комментарий при этом обещал выбор между AVIF и WebP —
      то есть описывал поведение, которого не было.

      В dev Next пишет в консоль, что загрузчик не учитывает width. Это
      ожидаемо (вариантов по ширине физически нет) и в продакшен-бандл
      предупреждение не попадает.
    */
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;
