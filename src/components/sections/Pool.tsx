import { Picture } from '../Picture';
import { ButtonLink, buttonClass } from '../ui';

import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { poolMainImage, poolPreviewImages, venuePreviewImages } from '@/content/media';
import { routeSteps, routeTransit } from '@/content/route';

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
  /*
    Крупная плитка берёт оригинал, мелкие — уменьшенные копии.

    Первый снимок показывается примерно в 560 px, и копия шире оригинала
    (1050 px) всё равно не получится — пересжатие только добавило бы вес.
    Остальные плитки идут в 270 px, там оригинал избыточен вчетверо.
  */
  const mainPhoto = poolMainImage;
  const restPhotos = poolPreviewImages;

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

        {/*
          Как добраться.

          Бассейн стоит на территории института, и попасть в него нельзя,
          просто подойдя к зданию: сначала КПП. До этого блока сайт про это
          не говорил вовсе — родитель узнавал о пропускном режиме, уже стоя
          у ворот с ребёнком. Это и есть та самая локальная тревога перед
          первым визитом, ради которой блок написан.

          Шаги пронумерованы, потому что порядок настоящий, а не оформление.

          Про дорогу от КПП до самого бассейна здесь ничего нет намеренно —
          владелец её пока не описал, а придумывать путь к месту, куда
          человек везёт ребёнка, нельзя. Пока эту работу делает фотография
          корпуса ниже: здание узнаваемое. См. content/route.ts.
        */}
        <div className="reveal mt-10 rounded-[20px] border border-white/12 p-6 sm:p-7">
          <h3 className="text-xs font-medium tracking-[0.2em] text-lime-300 uppercase">
            Как добраться
          </h3>

          <ol className="mt-6 grid gap-6 sm:grid-cols-2">
            {routeSteps.map((step, i) => (
              <li key={step.id} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-lime-400/50 text-sm tabular-nums text-lime-300"
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-medium text-white">
                    {step.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/70">
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-6 border-t border-white/12 pt-5 text-sm leading-relaxed text-white/70">
            Ближайшая остановка — «{routeTransit.stop}», {routeTransit.distance}.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="reveal zoom-frame relative aspect-[3/4] overflow-hidden rounded-[20px] bg-abyss-800 sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]"
            style={{ ['--reveal-delay' as string]: '60ms' }}
          >
            <Picture
              src={mainPhoto.src}
              alt={mainPhoto.alt}
              width={mainPhoto.width}
              height={mainPhoto.height}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          {restPhotos.map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800"
              style={{ ['--reveal-delay' as string]: `${120 + i * 60}ms` }}
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, 25vw"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          ))}

          {venuePreviewImages.map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800"
              style={{
                ['--reveal-delay' as string]: `${120 + (restPhotos.length + i) * 60}ms`,
              }}
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, 25vw"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
