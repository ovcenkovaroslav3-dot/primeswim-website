import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { poolImages, venueImages } from '@/content/media';

export function Pool() {
  const [mainPhoto, ...restPhotos] = poolImages;

  return (
    <Section id="pool" labelledBy="pool-title" className="bg-surface-alt">
      <SectionHeading
        id="pool-title"
        eyebrow="Бассейн"
        title={site.pool.title}
        lead={`${site.pool.lead} ${contacts.address.street}.`}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="zoom-frame relative aspect-[3/4] overflow-hidden rounded-[20px] bg-surface sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]">
          <Image
            src={mainPhoto.src}
            alt={mainPhoto.alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {restPhotos.map((photo) => (
          <div
            key={photo.src}
            className="zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-surface"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}

        {venueImages.map((photo) => (
          <div
            key={photo.src}
            className="zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-surface"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.pool.facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-[20px] border border-hairline bg-surface p-5"
          >
            <dt className="text-sm text-ink-muted">{fact.label}</dt>
            <dd className="mt-1 text-xl font-extralight text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

    </Section>
  );
}
