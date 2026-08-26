import Image from 'next/image';

import { ButtonLink, buttonClass } from '../ui';

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
export function Pool({ headingAs: Heading = 'h2' }: { headingAs?: 'h1' | 'h2' } = {}) {
  const [mainPhoto, ...restPhotos] = poolImages;

  return (
    <section
      id="pool"
      aria-labelledby="pool-title"
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28"
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
          <Heading
            id="pool-title"
            className="text-3xl leading-[1.08] font-extralight sm:text-4xl md:text-[44px]"
          >
            {site.pool.title}
          </Heading>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-white/70">
            {site.pool.lead}
          </p>
        </div>

        {/*
          Адрес и как добраться — сразу под заголовком, а не в подвале.

          Страница отвечает на запрос «бассейн МГИК»: человек пришёл узнать,
          где это и как доехать. Раньше ответ был размазан — название бассейна
          в заголовке, улица в подписи, а полный адрес только в контактах на
          главной, до которых с этой страницы ещё надо было дойти.

          Адрес написан ровно так же, как в карточке школы в Яндекс Картах,
          вплоть до индекса. Поиск связывает сайт с карточкой организации в
          том числе по совпадению адреса, и расхождение в написании эту связь
          ослабляет — поэтому строка собирается из одного источника
          (content/contacts.ts) и правится только там.
        */}
        <div className="reveal glass mt-10 rounded-[20px] p-6 sm:p-7">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-lime-300 uppercase">
                Адрес
              </dt>
              <dd className="mt-3">
                <address className="leading-relaxed text-white/80 not-italic">
                  {contacts.address.venue}
                  <br />
                  {contacts.address.region}, г. {contacts.address.city},{' '}
                  {contacts.address.district}
                  <br />
                  {contacts.address.street}, {contacts.address.postalCode}
                </address>
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium tracking-[0.2em] text-lime-300 uppercase">
                Чаша и занятие
              </dt>
              <dd className="mt-3 leading-relaxed text-white/80">
                Шесть дорожек по 25 метров. Тренировка длится 45 минут, в
                группе до 12 человек.
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-white/15 pt-6">
            <ButtonLink
              href={contacts.address.yandexMaps}
              external
              variant="outline"
              data-goal="click_route"
            >
              Построить маршрут на Яндекс Картах
            </ButtonLink>
            {/* tel: — обычная ссылка, как и везде на сайте: маршрутизатору тут делать нечего */}
            <a
              href={contacts.phone.href}
              data-goal="click_phone"
              className={buttonClass('outline')}
            >
              {contacts.phone.display}
            </a>
          </div>
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
      </div>
    </section>
  );
}
