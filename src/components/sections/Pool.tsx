import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { poolImages, venueImages } from '@/content/media';
import { lessonFlow } from '@/content/programs';

export function Pool() {
  const [mainPhoto, ...restPhotos] = poolImages;

  return (
    <Section id="pool" labelledBy="pool-title" className="bg-surface">
      <SectionHeading
        id="pool-title"
        eyebrow="Бассейн"
        title={site.pool.title}
        lead={`${site.pool.lead} ${contacts.address.street}.`}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-alt sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]">
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
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-alt"
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
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-alt"
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
            className="rounded-2xl border border-hairline bg-surface-alt p-5"
          >
            <dt className="text-sm text-ink-muted">{fact.label}</dt>
            <dd className="mt-1 text-xl font-extralight text-ink">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-16 text-2xl font-extralight text-ink sm:text-3xl">
        Как проходит занятие
      </h3>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {lessonFlow.map((item) => (
          <li key={item.step} className="border-t border-hairline pt-5">
            <p className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
              Шаг {item.step}
            </p>
            <h4 className="mt-2 text-lg font-light text-ink">
              {item.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
