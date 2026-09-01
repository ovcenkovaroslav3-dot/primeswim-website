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

      В dev Next писал в консоль, что загрузчик не учитывает width. Это
      было ожидаемо: вариантов по ширине физически нет.

      СЕЙЧАС ЭТА НАСТРОЙКА НИЧЕГО НЕ ДЕЛАЕТ: компонентов на next/image в
      проекте не осталось. Картинки рисует components/Picture.tsx — обычный
      <picture> с AVIF и запасным JPEG, чего next/image не умеет вовсе.
      Загрузчик оттуда вызывается напрямую (lib/image-loader.ts), ради того
      же basePath.

      Настройка оставлена нарочно: если кто-то однажды снова возьмёт
      next/image, без неё картинки на GitHub Pages будут отдавать 404, и
      причину придётся искать заново.
    */
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;
