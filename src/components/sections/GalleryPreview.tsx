import Image from 'next/image';
import Link from 'next/link';

import { Section, SectionHeading } from '../ui';
import { galleryHighlights } from '@/content/media';

/*
  Восемь кадров на главной.

  Вся галерея — 23 фотографии и 3 видео — с главной вынесена не зря: она
  одна давала треть длины страницы. Но и совсем без снимков главная теряет
  главное доказательство: что дети действительно занимаются и действительно
  выигрывают старты. Ссылка «Галерея» в списке разделов эту работу не
  делала — по ней уходили единицы.

  Поэтому здесь ровно восемь отобранных кадров (content/media.ts): будни в
  воде, работа тренера с группой, результат на соревнованиях. Сетка
  квадратная и одинаковая — снимки разного формата, и без общего кадрирования
  блок рассыпался бы по высоте.

  Все восемь ленивые: они лежат глубоко внизу страницы, и грузить их вместе
  с первым экраном незачем.

  Видео здесь нет намеренно. Три клипа весят кратно больше всех восьми
  снимков вместе, а на главной они добавили бы вес ровно тем посетителям,
  которые до них не долистают.
*/
export function GalleryPreview() {
  return (
    <Section
      id="gallery-preview"
      labelledBy="gallery-preview-title"
      className="bg-surface-alt"
    >
      <SectionHeading
        id="gallery-preview-title"
        eyebrow="Как это выглядит"
        title="Тренировки и старты"
        lead="Будни в бассейне МГИК, работа с группой у бортика и соревнования, куда школа возит своих учеников."
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
        {galleryHighlights.map((photo, i) => (
          <li
            key={photo.src}
            className="reveal zoom-frame relative aspect-square overflow-hidden rounded-[16px] bg-surface"
            style={{ ['--reveal-delay' as string]: `${(i % 4) * 60}ms` }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <Link
        href="/galereya/"
        prefetch={false}
        className="lift group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-600"
      >
        Все фото и видео с тренировок
        <svg
          width="15"
          height="15"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path
            d="M3 9h12M10 4l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </Section>
  );
}
