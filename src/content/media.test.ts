import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  heroImage,
  poolMainImage,
  poolPreviewImages,
  venuePreviewImages,
  galleryGridImages,
  galleryHighlights,
  type MediaItem,
} from './media.ts';
import { coaches } from './coaches.ts';

/*
  Каждой картинке — свой AVIF.

  Тест появился после настоящей поломки. Компонент Picture выводит адрес
  AVIF из адреса JPEG заменой расширения и кладёт его в <source>. Пока файл
  на месте, всё хорошо. Но если его нет, браузер НЕ откатывается к <img>:
  запасной вариант в <picture> работает для неподдерживаемых форматов, а не
  для не найденных файлов. Получается битая картинка.

  Ровно это и случилось: при генерации пропустили mgik-pool-flags.jpg —
  единственный снимок, который страница бассейна берёт оригиналом, а не
  уменьшенной копией. На странице появилась дыра, которую заметил только
  сетевой замер.

  Поэтому инвариант проверяется автоматически, до сборки: у любого файла,
  который сайт может отдать через Picture, обязан быть сосед .avif.
  Забыть пересобрать копию теперь нельзя — тест не пройдёт.
*/

const PUBLIC = join(process.cwd(), 'public');

/*
  Только те наборы, что реально доходят до Picture. Оригиналы галереи и
  снимков места сюда не входят намеренно: страницы отдают уменьшенные копии,
  а originals лежат в репозитории как исходники для пересборки и на экран
  не попадают. Требовать AVIF и для них значило бы тащить лишние четыре
  мегабайта ради файлов, которых никто не запрашивает.

  Добавили новый набор в компонент — впишите его и сюда.
*/
const sets: Record<string, MediaItem[]> = {
  heroImage: [heroImage],
  poolMainImage: [poolMainImage],
  poolPreviewImages,
  venuePreviewImages,
  galleryGridImages,
  galleryHighlights,
  coachPhotos: coaches.map((coach) => coach.photo),
};

for (const [name, items] of Object.entries(sets)) {
  test(`${name}: у каждого снимка есть AVIF рядом`, () => {
    const missing = items
      .map((item) => item.src)
      .filter((src) => {
        const avif = src.replace(/\.jpe?g$/i, '.avif');
        return !existsSync(join(PUBLIC, avif));
      });

    assert.deepEqual(
      missing,
      [],
      `нет AVIF для: ${missing.join(', ')} — пересоберите по public/media/preview/README.md`,
    );
  });

  test(`${name}: сам файл на месте`, () => {
    const missing = items
      .map((item) => item.src)
      .filter((src) => !existsSync(join(PUBLIC, src)));

    assert.deepEqual(missing, [], `нет файла: ${missing.join(', ')}`);
  });
}
