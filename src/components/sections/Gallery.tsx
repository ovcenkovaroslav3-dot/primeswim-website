import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { galleryImages } from '@/content/media';

/*
  Галерея.

  Три одинаковых плитки в ряд выглядели как заготовка, поэтому раскладка
  асимметричная: первый снимок крупный и держит на себе внимание, два
  других идут столбцом рядом. Сетка вместо карусели — всё видно сразу,
  ничего не нужно листать.

  Пропорции у крупного и малых снимков разные, поэтому подсказка sizes
  задана отдельно для каждого: иначе браузер грузил бы под мелкую плитку
  файл, рассчитанный на крупную.
*/
export function Gallery() {
  const [main, ...rest] = galleryImages;

  return (
    <Section id="gallery" labelledBy="gallery-title" className="bg-surface-alt">
      <SectionHeading
        id="gallery-title"
        eyebrow="Галерея"
        title="PRIME SWIM в жизни"
        lead="Тренировки, соревнования и первые награды наших учеников."
      />

      <ul
        className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr]"
        style={{ ['--reveal-delay' as string]: '80ms' }}
      >
        <li className="zoom-frame relative aspect-4/5 overflow-hidden rounded-[20px] bg-surface sm:col-span-2 lg:col-span-1 lg:aspect-auto lg:min-h-[34rem]">
          <Image
            src={main.src}
            alt={main.alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </li>

        <li className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
          {rest.map((photo) => (
            <div
              key={photo.src}
              className="zoom-frame relative aspect-4/3 overflow-hidden rounded-[20px] bg-surface lg:aspect-auto lg:min-h-[16.5rem]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover"
              />
            </div>
          ))}
        </li>
      </ul>
    </Section>
  );
}
