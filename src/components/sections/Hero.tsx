import { EnrollmentLinks } from '../EnrollmentLinks';
import Link from 'next/link';

import { Picture } from '../Picture';
import { HeroVisual } from '../HeroVisual';
import { WaterScene } from '../WaterScene';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { prices } from '@/content/prices';
import { coaches } from '@/content/coaches';

/*
  Первый экран.

  Раньше он продавал бренд раньше услуги: во всю ширину шла надпись PRIME SWIM,
  фоном — абстрактная вода, а настоящий заголовок был скрыт через sr-only.
  Родитель видел красивую заставку, но не получал ни одного доказательства,
  куда он приведёт ребёнка: ни бассейна, ни цены, ни тренера.

  Теперь экран отвечает на четыре вопроса до прокрутки: что за занятия, для
  кого, где и сколько стоит первый шаг. Фирменный язык при этом остался —
  та же толща воды на WebGL, тот же лайм на главном акценте, та же
  проявляющаяся типографика.

  Фотография — настоящий кадр бассейна МГИК, того самого, где идут занятия
  (см. content/media.ts). Это единственное на экране, что нельзя подделать
  версткой, поэтому она стоит рядом с заголовком, а не где-то ниже.
  На снимке — дорожки и зал бассейна МГИК.

  Текст проявляется из-под масок с нарастающей задержкой. Разметка при этом
  остаётся обычной: без JavaScript классы `.reveal` не активируются,
  и содержимое просто видно — экран не пустеет.
*/

/*
  Обе цены первого экрана, и обе рядом с кнопкой.

  Раньше здесь была одна — минимум абонемента, — и она лежала в полосе
  фактов. Решение верное по сути: цена пробного выше цены регулярного
  занятия, и первым же числом на экране завышала представление о школе.
  Неверным было место. Полоса фактов стоит прямо под кнопкой «Записаться
  на пробное занятие», и получалось, что число рядом с кнопкой — 850, а
  пробное, на которое кнопка записывает, стоит 1 100. Формально не ложь:
  подпись говорила «занятие в абонементе». Но родитель не читает подписи,
  он читает число возле кнопки.

  Теперь обе цены стоят одной строкой прямо под кнопками — там, где человек
  решает нажимать. Ни одно число больше не остаётся без своего названия, и
  из полосы фактов цена ушла: дважды писать 850 на одном экране незачем.

  Минимум абонемента считается по тарифам, у которых цена указана за занятие
  (у пробного единицы нет — это разовый платёж). Так строка не разъедется,
  если тарифы поменяются или появится новый.
*/
const perLessonPrices = prices
  .filter((price) => price.unit)
  .map((price) => price.amount);
const fromPrice = perLessonPrices.length ? Math.min(...perLessonPrices) : null;
const trialPrice = prices.find((price) => price.id === 'trial')?.amount ?? null;
const coachYears = coaches[0]?.yearsExperience;
const rub = (amount: number) => `${amount.toLocaleString('ru-RU')} ₽`;

/*
  Факты первого экрана — те, о которых родитель спрашивает первым делом.
  Раньше здесь были размеры бассейна (25 м, шесть дорожек): они верны, но
  отвечают на вопрос, который задают уже после записи, и живут на своей
  странице /bassein/.

  Фактов немного намеренно: цена переехала в строку под кнопками — см.
  комментарий выше.

  26 ноября 2026: стаж («опыт тренера») ушёл из полосы фактов в строку
  тренера рядом с фото — см. coach ниже. Голое «13 лет · опыт тренера» без
  лица и имени было числом без источника, а тренер — главное, чем школа
  отличается от соседних, и на первом экране его не было вовсе. Стаж берётся из того же
  файла, что и страница тренера, — иначе первый экран однажды остался бы с
  числом, которого уже нет.
*/
const facts = [
  { value: '45 мин', label: 'тренировка' },
  /*
    Факт «до 12 детей на дорожке» убран 28 сентября 2026 по просьбе
    владельца: численность группы на первом экране больше не обещаем.
  */
];

/*
  Тренер на первом экране — 26 ноября 2026, по итогам разбора сайта.

  Раньше лицо школы появлялось только ниже по странице, а на первом экране
  стояло безымянное «13 лет · опыт тренера». Теперь это строка-ссылка: круглое фото,
  «Ведёт занятия лично» и имя с отчеством. Фамилия опущена намеренно —
  родителю с ребёнком привычнее «Ярослав Сергеевич». Имя выводится из данных
  (в файле порядок «Фамилия Имя Отчество»), а при неожиданном формате
  берётся строка целиком — экран не сломается.
*/
const coach = coaches[0];
const coachNameParts = coach?.name.split(/\s+/).filter(Boolean) ?? [];
const coachShortName =
  coachNameParts.length >= 3
    ? coachNameParts.slice(1, 3).join(' ')
    : (coach?.name ?? '');

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate overflow-clip bg-abyss-950 text-white"
    >
      <div className="absolute inset-0 -z-10">
        <WaterScene />
      </div>

      {/*
        Ширма под текстом: слева плотнее, вправо открывает сцену.

        Плотнее прежней — текста на экране стало больше, и он весь лежит
        поверх движущейся воды. Правый край всё равно оставлен приоткрытым:
        затемнить его до конца значило бы выключить сцену, ради которой она
        и написана. Фотография ширмы не касается — она выше по слою.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-abyss-950/88 via-abyss-950/62 to-abyss-950/88 md:bg-linear-to-r md:from-abyss-950/94 md:via-abyss-950/58 md:to-abyss-950/28"
      />

      <div className="hero-depart mx-auto w-full max-w-[75rem] px-4 pt-8 pb-16 sm:px-6 sm:pt-20 md:pt-28 md:pb-24">
        {/*
          Две колонки на десктопе, одна на телефоне. Фотография на телефоне
          идёт после кнопок, а не перед заголовком: сначала предложение,
          потом доказательство — на маленьком экране картинка сверху отодвинула
          бы за сгиб ровно то, ради чего человек пришёл.

          НО И НЕ ПОСЛЕДНЕЙ. Замер 19 сентября 2026: кадр бассейна начинался
          на 906-м пикселе при сгибе 844 — то есть на телефоне первый экран
          не показывал ни одной фотографии вообще. Единственное, что нельзя
          подделать вёрсткой, в предложение не входило. Между кнопками и
          кадром стояла полоса фактов, и она же его туда и отодвинула.

          Полоса и кадр поменялись местами. Порядок «предложение → кнопка →
          доказательство» цел: заголовок, лид, обе кнопки и цены остались
          выше кадра и за сгиб не ушли. А факты под кадром ничего не теряют —
          «45 минут» уже сказано словами в лиде.

          ТЕХНИЧЕСКИ ЭТО flex ДО lg И grid НА lg. Иначе никак: полоса
          фактов лежала внутри текстовой колонки, а вставить её нужно между
          колонкой и соседней — порядком в сетке этого не сделать. Поэтому
          блоков теперь три, на телефоне они идут колонкой в порядке разметки,
          а на lg фотография занимает вторую колонку и обе строки сразу.
        */}
        <div className="flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-x-12 lg:gap-y-10 xl:gap-x-16">
          <div className="min-w-0 lg:max-w-none md:max-w-[46rem]">
            <p
              className="reveal text-xs font-medium tracking-[0.14em] text-white/70 sm:tracking-[0.28em] uppercase"
              style={{ ['--reveal-delay' as string]: '80ms' }}
            >
              {site.hero.kicker}
            </p>

            {/*
              Заголовок один и он видимый. Порядок слов не случаен: сначала
              запрос, потом площадка. Школа новая, «PRIME SWIM» пока никто не
              ищет — начинать заголовок с неизвестного названия значило бы
              потратить впустую самую весомую его часть. Логотип остался
              в шапке, во весь экран его повторять незачем.

              UNBOUNDED В EXTRABOLD ЗДЕСЬ НАМЕРЕННО, И ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА.
              Пробовали набрать заголовок волосяным Inter — тем же, что и все
              заголовки ниже (SectionHeading в ui.tsx): по букве DESIGN.md
              так ровнее, «авторитет берётся сдержанностью, а не весом», и
              первый экран перестаёт выглядеть отдельным сайтом. Вариант
              отклонён — школе нужен голос погромче, чем у референса.

              Значит, Unbounded на сайте живёт в двух ролях: логотип и этот
              заголовок. Третьей не заводить — в остальных заголовках его
              нет, и разнобой начнётся именно оттуда.

              Лайм на площадке тоже остаётся. Он здесь второй по счёту после
              кнопки, и это предел: всё остальное на первом экране с лайма
              снято (надзаголовок, полоса фактов под ним) — см. ProofStrip.
            */}
            <h1
              id="hero-title"
              className="reveal mt-4 font-display sm:mt-5 text-[clamp(2.1rem,6.2vw,4rem)] lg:text-[clamp(2.1rem,5vw,4rem)] xl:text-[clamp(2.1rem,6.2vw,4rem)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] hyphens-auto"
              style={{ ['--reveal-delay' as string]: '160ms' }}
            >
              {site.hero.title}
              {' — '}
              <span className="text-lime-300">{site.hero.titleAccent}</span>
            </h1>

            <p
              className="reveal mt-4 max-w-[46ch] sm:mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ ['--reveal-delay' as string]: '280ms' }}
            >
              {site.hero.offer}
            </p>

            <div className="reveal mt-5 flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-inset border border-white/20 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white">
              <span className="font-semibold">Новый набор</span>
              <EnrollmentLinks dark />
            </div>

            <div
              className="reveal mt-6 flex flex-col sm:mt-8 gap-3 sm:flex-row sm:items-center"
              style={{ ['--reveal-delay' as string]: '380ms' }}
            >
              <Link
                href="#booking"
                data-goal="cta_booking"
                className="lift glow-accent inline-flex min-h-13 items-center justify-center rounded-control bg-lime-400 px-7 text-center text-base font-semibold text-abyss-950 hover:bg-lime-300"
              >
                {site.cta.primary}
              </Link>
              {/*
                Вторая кнопка ведёт на страницу расписания, а не на якорь
                главной: разделы разъехались по своим адресам, и «Посмотреть
                программу» вело в блок направлений — не туда, где родитель
                ищет время занятий.
              */}
              <Link
                href="/raspisanie/"
                data-goal="cta_schedule"
                className="lift inline-flex min-h-13 items-center justify-center rounded-control border border-white/25 px-7 text-center text-base font-semibold text-white hover:border-white/50 hover:bg-white/10"
              >
                Расписание занятий
              </Link>
            </div>

            {trialPrice && fromPrice ? (
              <p
                className="reveal mt-4 text-sm text-white/65"
                style={{ ['--reveal-delay' as string]: '440ms' }}
              >
                Пробное занятие — {rub(trialPrice)}, дальше от{' '}
                {rub(fromPrice)} за занятие в абонементе
              </p>
            ) : null}
          </div>

          {/* Запас над кадром нужен выступающей за его край косатке. */}
          <div
            className="mt-4 sm:mt-6 md:mt-10 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0"
            style={{ ['--reveal-delay' as string]: '320ms' }}
          >
            <HeroVisual />
          </div>

          <div className="min-w-0">
            {/*
              Карточка осталась стеклянной, но теперь в две ячейки: «45 мин» и
              строка тренера. min-w-0 и перенос нужны, чтобы на 320 px и при
              увеличенном шрифте имя не вылезало за край карточки.
            */}
            <div
              className="reveal glass grid max-w-xl gap-x-6 gap-y-5 rounded-card p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-6"
              style={{ ['--reveal-delay' as string]: '480ms' }}
            >
              <dl className="flex min-w-0 flex-col gap-y-5">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col">
                    <dt className="order-2 mt-1 text-xs leading-snug text-white/70">
                      {f.label}
                    </dt>
                    {/* значения короткие и переносу не подлежат: на 768 «45 мин»
                        ломалось на «45» и «мин» и читалось как два факта */}
                    <dd className="order-1 text-xl font-light whitespace-nowrap tabular-nums text-white sm:text-2xl">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {coach ? (
                <Link
                  href="/trener/"
                  data-goal="hero_coach"
                  className="group flex min-h-11 min-w-0 flex-wrap items-center gap-3 border-t border-white/15 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6"
                >
                  {/*
                    Размер и shrink-0 — на обёртке: флекс сжимает <picture>, а
                    не <img>, и с классами на картинке кружок на 320 px
                    сплющивался в овал 45×56. Размер в px, а не в rem: при
                    крупном шрифте фото не растёт до 112 px и не отнимает
                    место у имени. alt пустой — имя уже есть в тексте ссылки,
                    и экранный диктор не прочтёт его дважды.
                  */}
                  <span className="size-[56px] shrink-0 overflow-hidden rounded-full [&>picture]:size-full">
                    <Picture
                      src={coach.photo.src}
                      alt=""
                      width={coach.photo.width}
                      height={coach.photo.height}
                      sizes="56px"
                      className="size-full object-cover object-[50%_20%]"
                    />
                  </span>
                  {/*
                    Текст не уже 9em: при крупном шрифте на 320 px рядом с
                    фото оставалось ~170 px, и имя рвалось на буквы. Теперь
                    в таком случае текст уходит под фото (flex-wrap у ссылки),
                    а при обычном шрифте стоит рядом, как задумано.
                  */}
                  <span className="flex min-w-[min(9em,100%)] flex-1 flex-col">
                    <span className="text-xs leading-snug text-white/70">
                      Ведёт занятия лично
                    </span>
                    {/*
                      «· 13 лет опыта» держится вместе: на 320 px «13» уходило
                      в конец строки, а «лет опыта» — на следующую. Перенос
                      по слогам — запасной, там, где браузер его умеет.
                    */}
                    <span className="text-sm leading-snug text-white hyphens-auto group-hover:text-lime-200 sm:text-base">
                      <span className="underline-offset-4 group-hover:underline">
                        {coachShortName}
                      </span>
                      {/* неразрывные пробелы, а не nowrap: при шрифте 200 %
                          nowrap вытолкнул бы строку за край карточки */}
                      {coachYears ? ` ·\u00a0${coachYears}\u00a0лет опыта` : null}
                    </span>
                  </span>
                </Link>
              ) : null}
            </div>

            <p
              className="reveal mt-6 text-sm text-white/65"
              style={{ ['--reveal-delay' as string]: '560ms' }}
            >
              {contacts.address.short}
            </p>
          </div>
        </div>
      </div>

      {/*
        Переход в следующую секцию.

        Растворяется в abyss-900, а не в белом. За первым экраном идёт
        ProofStrip, и он тёмный: прежний градиент уводил низ сцены в белый,
        после чего страница резко возвращалась в тёмное — между двумя тёмными
        секциями лежала светлая полоса в палец шириной, читавшаяся как шов
        или недогрузившийся блок. Теперь сцена уходит ровно в цвет того, что
        под ней.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-abyss-900"
      />
    </section>
  );
}
