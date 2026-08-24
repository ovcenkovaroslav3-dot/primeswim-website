import Image from 'next/image';

import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { poolImages, venueImages } from '@/content/media';

/*
  Где проходят тренировки.

  Единственная секция, где толщу подсвечивают фотографии, а не текст —
  снимки бассейна на тёмном фоне выглядят дороже, чем на белом. Так же
  важна её позиция: без неё между «От первого вдоха» и «Дальше — не просто
  умение плавать» шло пять светлых секций подряд, и вся глубина сайта
  оказывалась только в начале и в конце. Эта секция стоит ровно посередине
  того разрыва.
*/
export function Pool() {
  const [mainPhoto, ...restPhotos] = poolImages;

  return (
    <section
      id="pool"
      aria-labelledby="pool-title"
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-20 text-white sm:px-6 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -right-24 size-[30rem] rounded-full bg-brand-500/16 blur-3xl"
        style={{
          ['--parallax-from' as string]: '12%',
          ['--parallax-to' as string]: '-12%',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-lime-300 uppercase">
            Бассейн
          </p>
          <h2
            id="pool-title"
            className="text-3xl leading-[1.08] font-extralight sm:text-4xl md:text-[44px]"
          >
            {site.pool.title}
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-white/70">
            {site.pool.lead} {contacts.address.street}.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="reveal zoom-frame relative aspect-[3/4] overflow-hidden rounded-[20px] bg-abyss-800 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]"
            style={{ ['--reveal-delay' as string]: '60ms' }}
          >
            <Image
              src={mainPhoto.src}
              alt={mainPhoto.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {restPhotos.map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800"
              style={{ ['--reveal-delay' as string]: `${120 + i * 60}ms` }}
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

          {venueImages.map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800"
              style={{
                ['--reveal-delay' as string]: `${120 + (restPhotos.length + i) * 60}ms`,
              }}
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
            <div key={fact.label} className="glass rounded-[20px] p-5">
              <dt className="text-sm text-white/60">{fact.label}</dt>
              <dd className="mt-1 text-xl font-extralight text-white">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
