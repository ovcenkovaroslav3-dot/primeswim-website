import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { galleryImages, galleryVideos } from '@/content/media';

/*
  Галерея.

  С тремя снимками работала раскладка «крупный слева + два справа
  столбцом» — она держалась на точном количестве плиток и рассыпалась бы
  на большем наборе: лишние фото просто вставали бы в один нескончаемый
  столбец. Список вырос до двух десятков кадров с разных событий (будни в
  бассейне МГИК, выезд на соревнования в Тольятти, каток), и раскладке
  нужно было выдержать любое количество без переделки.

  Colonnes-мазонри вместо фиксированной сетки: каждая карточка сохраняет
  свои пропорции (next/image здесь без fill, с натуральными width/height),
  колонка сама подбирает следующую по высоте — щелей не остаётся, а новое
  фото можно дописать в конец массива, не трогая разметку.

  Видео вклиниваются в тот же поток плиток, а не выносятся отдельным рядом:
  так на большом экране не появляется голая полоса из трёх одинаковых
  вертикальных клипов подряд. У video нет autoplay — на телефоне это лишний
  трафик, а controls появляются только при наведении/фокусе, чтобы кадр не
  спорил с плиткой-фотографией рядом.
*/
const VIDEO_POSITIONS = [4, 11, 18];

type GalleryEntry =
  | { kind: 'photo'; key: string; src: string; alt: string; width: number; height: number }
  | {
      kind: 'video';
      key: string;
      src: string;
      poster: string;
      alt: string;
      width: number;
      height: number;
    };

function buildEntries(): GalleryEntry[] {
  const entries: GalleryEntry[] = [];
  let videoIndex = 0;

  galleryImages.forEach((photo, i) => {
    if (VIDEO_POSITIONS.includes(i) && videoIndex < galleryVideos.length) {
      const video = galleryVideos[videoIndex++];
      entries.push({ kind: 'video', key: video.src, ...video });
    }
    entries.push({ kind: 'photo', key: photo.src, ...photo });
  });

  while (videoIndex < galleryVideos.length) {
    const video = galleryVideos[videoIndex++];
    entries.push({ kind: 'video', key: video.src, ...video });
  }

  return entries;
}

export function Gallery() {
  const entries = buildEntries();

  return (
    <Section id="gallery" labelledBy="gallery-title" className="bg-surface-alt">
      <SectionHeading
        id="gallery-title"
        eyebrow="Галерея"
        title="PRIME SWIM в жизни"
        lead="Тренировки, соревнования и первые награды наших учеников."
      />

      <ul
        className="reveal mt-12 columns-2 gap-4 lg:columns-3"
        style={{ ['--reveal-delay' as string]: '80ms' }}
      >
        {entries.map((entry) =>
          entry.kind === 'photo' ? (
            <li
              key={entry.key}
              className="zoom-frame relative mb-4 overflow-hidden rounded-[20px] bg-surface break-inside-avoid"
            >
              <Image
                src={entry.src}
                alt={entry.alt}
                width={entry.width}
                height={entry.height}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="block h-auto w-full object-cover"
              />
            </li>
          ) : (
            <li
              key={entry.key}
              className="relative mb-4 overflow-hidden rounded-[20px] bg-surface break-inside-avoid"
            >
              <video
                src={entry.src}
                poster={entry.poster}
                aria-label={entry.alt}
                controls
                playsInline
                preload="none"
                className="block h-auto w-full"
              />
            </li>
          ),
        )}
      </ul>
    </Section>
  );
}
