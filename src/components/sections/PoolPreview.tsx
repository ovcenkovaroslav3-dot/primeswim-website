import { Picture } from '../Picture';
import { ArrowLink, ButtonLink } from '../ui';
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
      className="on-dark relative overflow-clip bg-abyss-950 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-500/18 blur-3xl"
        style={{
          ['--parallax-from' as string]: '-12%',
          ['--parallax-to' as string]: '12%',
        }}
      />

      {/*
        КОЛОНКИ ТЯНУТСЯ, А НЕ ЦЕНТРУЮТСЯ. Стояло lg:items-center, и на 1440
        это выглядело так: текст 417 px, рядом два снимка 266×200 в общей
        высоте 200 — то есть колонка вдвое ниже соседней, посаженная по
        центру, с сотней пикселей пустоты сверху и снизу. Секция читалась
        перекошенной влево: весь вес в тексте, справа две марки в пустоте.

        Центровка верна, когда колонки сопоставимы по высоте. Здесь они не
        сопоставимы, и выравнивать было нечего — надо было дать правой
        колонке ту же высоту. Теперь она тянется до высоты текста, а снимки
        внутри делят её пополам.
      */}
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="reveal">
          <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            Где занимаемся
          </p>

          <h2
            id="pool-preview-title"
            className="mt-4 text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl"
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
            — с Библиотечной или с Совхозной улицы — и скажите охране, что вы
            к тренеру Овченкову Ярославу Сергеевичу. От КПП до бассейна около
            150 метров.
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
            <ArrowLink href="/bassein/" tone="white">
              О бассейне и занятии
            </ArrowLink>
          </div>
        </div>

        {/* корпус и ворота: по ним место узнаётся с улицы.
            Копии 720×540 из media/preview — оригиналы на 1400 px нужны
            только странице бассейна, где снимок показан крупно. */}
        {/*
          ДО lg — ДВА КАДРА В РЯД ПО 4:3, НА lg — ДРУГ ПОД ДРУГОМ ВО ВСЮ
          ШИРИНУ КОЛОНКИ. Пропорция там снимается совсем: высоту задаёт
          растянутая колонка, а ширину — она же, и кадр обрезается по
          середине. Оба снимка это переносят: и у корпуса, и у ворот
          содержание лежит посередине, сверху небо и кроны, снизу газон и
          асфальт.

          Площадь каждого кадра при этом вырастает вдвое — 548×200 против
          266×200, — а высота секции не меняется вовсе: она как была задана
          текстовой колонкой, так и осталась.

          ТОЧКА КАДРИРОВАНИЯ У ВОРОТ СДВИНУТА ВВЕРХ, И БЕЗ ЭТОГО ПРАВКА НЕ
          СТОИЛА БЫ ЗАТЕИ. По центру полоса приходилась ровно под вывеску
          «Московский государственный институт культуры» — а это и есть то,
          по чему родитель узнаёт место, стоя перед воротами. Секция,
          которая существует ради узнавания, срезала бы единственную
          надпись на снимке. На 20 % в кадр входят и вывеска, и колонны, и
          сами ворота, и будка охраны со шлагбаумом.

          Корпус остаётся по центру: там внизу козырёк и двери — то, куда
          заходят, — и сдвиг вверх срезал бы вход. Проверено снимками обоих
          кадров на 20, 30, 40 и 50 %.
        */}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2">
          {[building, gate].filter(Boolean).map((photo, i) => (
            <div
              key={photo.src}
              className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-[20px] bg-abyss-800 lg:aspect-auto"
              style={{ ['--reveal-delay' as string]: `${80 + i * 80}ms` }}
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                /*
                  Сдвиг нужен только на lg: ниже кадр стоит в своих 4:3,
                  обрезать нечего, и object-position там ничего не делает.
                  Порядок пар задан деструктуризацией выше — первый корпус,
                  второй ворота.
                */
                className={`absolute inset-0 size-full object-cover ${
                  i === 1 ? 'lg:object-[50%_20%]' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
