import Link from 'next/link';

import { Picture } from '../Picture';

import { WaterScene } from '../WaterScene';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { heroImage } from '@/content/media';
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
  Кадров занятия с детьми именно в МГИК пока нет — подставлять сюда снимок
  с другой площадки нельзя, это было бы обещанием не того места.

  Текст проявляется из-под масок с нарастающей задержкой. Разметка при этом
  остаётся обычной: без JavaScript классы `.reveal` не активируются,
  и содержимое просто видно — экран не пустеет.
*/

/*
  Цена первого экрана — минимальная стоимость занятия в абонементе.

  Здесь стояла цена пробного. Она выше цены регулярного занятия, и первым
  же числом на экране завышала представление о школе: родитель видел 1 100 ₽
  там, где на самом деле платит от 850 ₽ за тренировку.

  Минимум считается по тарифам, у которых цена указана за занятие (у пробного
  единицы нет — это разовый платёж). Так строка не разъедется, если тарифы
  поменяются или появится новый.
*/
const perLessonPrices = prices
  .filter((price) => price.unit)
  .map((price) => price.amount);
const fromPrice = perLessonPrices.length ? Math.min(...perLessonPrices) : null;
const coachYears = coaches[0]?.yearsExperience;

/*
  Четыре факта первого экрана — те, о которых родитель спрашивает первым
  делом. Раньше здесь были размеры бассейна (25 м, шесть дорожек): они
  верны, но отвечают на вопрос, который задают уже после записи, и живут
  на своей странице /bassein/.

  Цена и стаж берутся из тех же файлов, что и страницы стоимости и тренера, —
  иначе первый экран однажды остался бы с ценой, которой уже нет.
*/
const facts = [
  {
    value: fromPrice ? `от ${fromPrice.toLocaleString('ru-RU')} ₽` : null,
    label: 'занятие в абонементе',
  },
  { value: '45 мин', label: 'тренировка' },
  /*
    «На дорожке», а не «в группе»: родителю важно, сколько детей делят воду
    с его ребёнком, а не численность списка. Цифра та же — группа занимает
    одну дорожку.
  */
  { value: 'до 12', label: 'детей на дорожке' },
  { value: coachYears ? `${coachYears} лет` : null, label: 'опыт тренера' },
].filter((fact): fact is { value: string; label: string } =>
  Boolean(fact.value),
);

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

      <div className="hero-depart mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
        {/*
          Две колонки на десктопе, одна на телефоне. Фотография на телефоне
          идёт после кнопок, а не перед заголовком: сначала предложение,
          потом доказательство — на маленьком экране картинка сверху отодвинула
          бы за сгиб ровно то, ради чего человек пришёл.
        */}
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="min-w-0">
            <p
              className="reveal text-xs font-medium tracking-[0.28em] text-lime-300 uppercase"
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
            */}
            <h1
              id="hero-title"
              className="reveal mt-5 font-display text-[clamp(2.1rem,6.2vw,4rem)] leading-[1.04] font-extrabold tracking-[-0.02em] text-balance"
              style={{ ['--reveal-delay' as string]: '160ms' }}
            >
              {site.hero.title}
              {' — '}
              <span className="text-lime-300">{site.hero.titleAccent}</span>
            </h1>

            <p
              className="reveal mt-6 max-w-[46ch] text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ ['--reveal-delay' as string]: '280ms' }}
            >
              {site.hero.offer}
            </p>

            <div
              className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ ['--reveal-delay' as string]: '380ms' }}
            >
              <Link
                href="#booking"
                data-goal="cta_booking"
                className="lift glow-accent inline-flex min-h-13 items-center justify-center rounded-[10px] bg-lime-400 px-7 text-center text-[15px] font-semibold text-abyss-950 transition-colors duration-200 hover:bg-lime-300"
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
                className="lift inline-flex min-h-13 items-center justify-center rounded-[10px] border border-white/25 px-7 text-center text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
              >
                Расписание занятий
              </Link>
            </div>

            <dl
              className="reveal glass mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 rounded-[20px] p-5 sm:grid-cols-4 sm:gap-x-4 sm:p-6"
              style={{ ['--reveal-delay' as string]: '480ms' }}
            >
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col">
                  <dt className="order-2 mt-1 text-xs leading-snug text-white/55">
                    {f.label}
                  </dt>
                  <dd className="order-1 text-xl font-light tabular-nums text-white sm:text-2xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p
              className="reveal mt-6 text-sm text-white/65"
              style={{ ['--reveal-delay' as string]: '560ms' }}
            >
              {contacts.address.short}
            </p>
          </div>

          {/*
            Фотография бассейна. priority — потому что это самый крупный
            элемент экрана и он же кандидат в LCP: без приоритета браузер
            дошёл бы до него в общей очереди.

            sizes задан по колонке, а не по ширине окна. Свой загрузчик на
            статике не создаёт вариантов по ширине (см. next.config.ts), но
            атрибут остаётся верным описанием разметки — и станет рабочим в
            тот день, когда появится нормальная сборка изображений.
          */}
          <figure
            className="reveal relative mx-auto w-full max-w-sm md:max-w-none"
            style={{ ['--reveal-delay' as string]: '320ms' }}
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <Picture
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                priority
                sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 24rem"
                className="h-[clamp(16rem,42vw,30rem)] w-full object-cover md:h-[clamp(22rem,46vw,34rem)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-abyss-950/85"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm leading-snug text-white/85">
                {contacts.address.venue} · {contacts.address.district}
              </figcaption>
            </div>
          </figure>
        </div>
      </div>

      {/* переход в следующую секцию: сцена растворяется в светлом фоне */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-surface"
      />
    </section>
  );
}
