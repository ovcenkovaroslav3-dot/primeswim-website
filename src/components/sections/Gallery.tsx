import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { galleryImages } from '@/content/media';

export function Gallery() {
  return (
    <Section id="gallery" labelledBy="gallery-title" className="bg-surface">
      <SectionHeading
        id="gallery-title"
        eyebrow="Галерея"
        title="PRIME SWIM в жизни"
        lead="Тренировки, соревнования и первые награды наших учеников."
      />

      {/* Сетка вместо карусели: всё видно сразу, ничего не нужно листать */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {galleryImages.map((photo) => (
          <li
            key={photo.src}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-alt"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
