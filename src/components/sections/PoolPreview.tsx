import Link from 'next/link';

import { Picture } from '../Picture';
import { ButtonLink } from '../ui';
import { contacts } from '@/content/contacts';
import { venuePreviewImages } from '@/content/media';

/*
  Бассейн и как доехать — последний блок перед формой.

  Локальная тревога перед первым визитом реальна: родитель везёт ребёнка в
  чужое место и хочет заранее узнать здание и вход. Поэтому здесь не схема
  проезда, а два снимка — корпус и ворота на территорию МГИК: по ним место
  узнаётся с улицы.

  Карта не встраивается iframe-ом: сторонний скрипт тянет много JavaScript
  ради блока, который на главной нужен единицам. Кнопка ведёт в Яндекс
  Карты, где маршрут строится от текущего положения человека — это точнее
  любой нарисованной схемы.

  Про пропускной режим сказано прямо здесь, а не только на /bassein/:
  бассейн стоит на территории института, и родитель, который узнаёт про
  КПП уже стоя у ворот с ребёнком, — это ровно та тревога, которую блок
  должен снимать. Две строки, подробности шагами на /bassein/.

  Парковки в тексте нет намеренно: чем подтверждена галочка «Парковка» в
  карточке Яндекса, владелец пока не уточнил, а «уточняйте у администратора»
  хуже молчания. См. content/route.ts.

  Адрес собирается из content/contacts.ts тем же способом, что и в
  микроразметке: поиск связывает сайт с карточкой организации в том числе
  по совпадению написания адреса.
*/
export function PoolPreview() {
  const [building, gate] = venuePreviewImages;

  return (
    <section
      id="pool-preview"
      aria-labelledby="pool-preview-title"
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-500/18 blur-3xl"
        style={{
          ['--parallax-from' as string]: '-12%',
          ['--parallax-to' as string]: '12%',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="reveal">
          <p className="text-xs font-medium tracking-[0.2em] text-lime-300 uppercase">
            Где занимаемся
          </p>

          <h2
            id="pool-preview-title"
            className="mt-4 text-3xl leading-[1.08] font-extralight sm:text-4xl"
          >
            Бассейн МГИК в Химках
          </h2>

          <address className="mt-6 text-lg leading-relaxed text-white/80 not-italic">
            {contacts.address.region}, г. {contacts.address.city},{' '}
            {contacts.address.district}
            <br />
            {contacts.address.street}
          </address>

          <p className="mt-4 leading-relaxed text-white/65">
            Шесть дорожек по 25 метров. Все группы школы занимаются здесь —
            другой площадки нет, ездить между бассейнами не придётся.
          </p>

          <p className="mt-4 leading-relaxed text-white/65">
            Бассейн на территории института: заходите через любой из двух КПП
            и скажите охране, что вы к тренеру Овченкову Ярославу Сергеевичу.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={contacts.address.yandexMaps}
              external
              variant="outline"
              data-goal="click_route"
            >
              Построить маршрут
            </ButtonLink>
            <Link
              href="/bassein/"
              prefetch={false}
              className="lift group inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-lime-300"
            >
              О бассейне и занятии
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
          </div>
        </div>

        {/* корпус и ворота: по ним место узнаётся с улицы.
            Копии 720×540 из media/preview — оригиналы на 1400 px нужны
            только странице бассейна, где снимок показан крупно. */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {[building, gate].filter(Boolean).map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800"
              style={{ ['--reveal-delay' as string]: `${80 + i * 80}ms` }}
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
