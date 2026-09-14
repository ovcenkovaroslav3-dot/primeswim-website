'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { strokes } from '@/content/method';
import imageLoader from '@/lib/image-loader';

/*
  Четыре стиля плавания.

  Каждому стилю соответствует своя траектория гребка — она прочерчивается
  линией и по ней бежит светящаяся точка. Сама траектория векторная и весит
  доли килобайта: тянуть сюда WebGL было бы неоправданно.

  ЗА ТРАЕКТОРИЕЙ СТОИТ СИЛУЭТ ПЛОВЦА, и появился он потому, что одной кривой
  мало: она показывает ритм гребка, но не показывает, как это выглядит.
  Родитель, который читает «баттерфляй», в большинстве случаев представляет
  его смутно. Силуэт отвечает на это за полсекунды и не требует чтения.

  Силуэты плоские, в шапочке и купальнике, единым цветом. Первый заход был
  объёмный, как у талисмана, — вышли обнажённые манекены, что на сайте
  детской школы плавания недопустимо; разбор в scripts/make-stroke-art.mjs.

  Файл берётся по `stroke.id`: имена в content/method.ts и в
  public/media/strokes/ совпадают по договорённости, и это проверяет
  strokes.test.ts — иначе несовпадение вылезло бы битой картинкой у
  посетителя, а не падающим тестом.

  Показывается только активная вкладка, поэтому в разметке всегда одна
  картинка: 8–13 КБ в AVIF.

  Переключатель собран по образцу вкладок: стрелки влево-вправо переводят
  фокус между стилями, активная вкладка помечена aria-selected, панель
  связана с ней через aria-labelledby.

  Обе анимации сделаны на CSS, поэтому системная настройка «уменьшить
  движение» гасит их вместе со всем остальным движением на сайте.
*/
/*
  У КАКИХ СТИЛЕЙ ЕСТЬ ПЕТЛЯ ДВИЖЕНИЯ.

  Кроль и спину видеомодель знает уверенно: руки чередуются, вход и пронос
  остаются на месте. Брасс удалось получить только после того, как модель
  перестала сама придумывать технику: старт и конец зафиксированы фазой
  скольжения, а гребок и подготовка толчка заданы отдельными проверенными
  ключевыми позами. Так колено не уходит вперёд-вниз, пятки поднимаются к
  тазу, а толчок следует после возврата рук.

  Баттерфляй потребовал ещё более жёсткого контроля. Цельный text-to-video
  и переход только между началом и концом давали чрезмерную волну корпусом
  и сгибали ноги. Поэтому сначала собрали девять чистых фаз в одном листе,
  убрали повторный захват, выровняли оставшиеся кадры по воде и передали
  модели уже готовую временную дорожку. В video-edit она только добавила
  промежуточное движение, не меняя порядок: захват, толчок, одновременный
  пронос, вход и скольжение.

  НА САЙТЕ ШКОЛЫ ПЛАВАНИЯ НЕВЕРНАЯ ТЕХНИКА ХУЖЕ ОТСУТСТВИЯ АНИМАЦИИ: тренер
  видит её за секунду, а родитель, которому показали неправильный гребок,
  теряет к школе ровно то доверие, ради которого весь сайт и сделан.
  Отклонённые ролики лежат в
  media-source/brand/strokes/motion/rejected/, чтобы к ним не возвращались
  по второму разу.

  Появится верная петля — достаточно положить файлы и добавить стиль сюда.
*/
const HAS_MOTION = new Set([
  'freestyle',
  'backstroke',
  'breaststroke',
  'butterfly',
]);

/*
  ПЕТЛЯ ГРЕБКА.

  У стиля есть короткий ролик: тот же плоский силуэт, но руки идут полный
  цикл. Ролик подставляется вместо картинки, когда движение разрешено.

  ПОЧЕМУ НЕ ПОКАДРОВАЯ АНИМАЦИЯ. Пробовали первой: четыре положения рук,
  снятые по отдельности, и смена по opacity. Не сложилось по двум причинам
  сразу. Каждый кадр — отдельная генерация, поэтому вторая рука от кадра к
  кадру не менялась (гребок читался одноруким), а фигура смещалась и
  «прыгала» при перелистывании. И четыре кадра на полуторасекундный цикл —
  это меньше трёх кадров в секунду, плавным такое не бывает. Разбор —
  в scripts/make-stroke-motion.mjs.

  ПОЧЕМУ ВЫБОР ДЕЛАЕТСЯ В JAVASCRIPT, А НЕ В CSS. Спрятать ролик правилом
  `prefers-reduced-motion` можно, но он всё равно скачается: около ста
  килобайт тому, кто попросил у системы поменьше движения. Поэтому на
  сервере рисуется картинка, а ролик подставляется уже в браузере и только
  если движение разрешено. Заодно нет расхождения разметки при гидратации.
*/
function useMotionAllowed() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const apply = () => setAllowed(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return allowed;
}

export function Strokes() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = strokes.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const stroke = strokes[active];
  const motionAllowed = useMotionAllowed() && HAS_MOTION.has(stroke.id);

  return (
    <section
      id="strokes"
      aria-labelledby="strokes-title"
      className="bg-surface px-4 py-14 sm:px-6 sm:py-16 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal max-w-3xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Техника
          </p>
          <h2
            id="strokes-title"
            className="text-3xl leading-[1.08] font-extralight tracking-[-0.02em] text-ink sm:text-4xl md:text-[44px]"
          >
            Четыре стиля, а не один
          </h2>
          <p className="mt-5 max-w-[62ch] leading-relaxed text-ink-soft">
            Ребёнок осваивает весь спортивный набор. Каждый стиль ставится
            отдельно и в своём порядке — от самого естественного к самому
            силовому.
          </p>
        </div>

        <div className="reveal mt-12" style={{ ['--reveal-delay' as string]: '80ms' }}>
          <div
            role="tablist"
            aria-label="Стили плавания"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2"
          >
            {strokes.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`${uid}-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls={`${uid}-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`min-h-11 rounded-[10px] px-4 text-sm font-medium transition-colors duration-200 ${
                  i === active
                    ? 'bg-abyss-900 text-white'
                    : 'border border-hairline bg-surface-alt text-ink-soft hover:border-brand-300 hover:text-ink'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${uid}-panel-${stroke.id}`}
            aria-labelledby={`${uid}-tab-${stroke.id}`}
            className="mt-6 grid gap-8 rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-brand-600 uppercase">
                {stroke.short}
              </p>
              <h3 className="mt-4 text-2xl font-light text-ink sm:text-3xl">
                {stroke.name}
              </h3>
              <p className="mt-4 leading-relaxed text-ink-soft">
                {stroke.description}
              </p>

              <p className="mt-7 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
                Что осваивает ребёнок
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {stroke.learns.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/*
              Петля гребка. Схемы траектории здесь больше нет: пока силуэт
              был неподвижен, лаймовая кривая заменяла движение — показывала
              путь руки над водой и под ней. Движущийся пловец показывает то
              же самое прямо, и держать рядом две вещи об одном незачем.
              Данные траектории (`stroke.path`) остались в content/method.ts:
              они верные и могут пригодиться, а мёртвого кода в разметке нет.

              Лайма в секции теперь нет вовсе, и это правильно по системе:
              акцент принадлежит действию, а здесь объяснение, а не действие.
            */}
            <div className="relative overflow-hidden rounded-[16px] bg-abyss-900">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand-600/25 via-transparent to-lime-500/18"
              />

              <div className="relative aspect-900/740">
                {/*
                  Линия воды — единственный лайм в секции, и он здесь не для
                  красоты. Убрав траекторию гребка, панель осталась вовсе без
                  акцента: одна фиолетовая фигура на фиолетовой подложке.
                  Возвращать кривую нельзя — она и была тем, что резало
                  силуэт, — а линия воды лежит ровно там, где фигура её и так
                  пересекает по смыслу, и потому ничего не портит.

                  ВОЛНОЙ, А НЕ ПРЯМОЙ. Прямая читалась чертёжной осью, а не
                  поверхностью воды. Волна нарисована двумя периодами на
                  ширину блока и медленно сносится вбок ровно на один период —
                  поэтому петля сходится без скачка и заметить её повтор
                  нечем. Снос очень медленный: вода должна дышать, а не течь.

                  Стоит поверх ролика и совпадает с его собственной линией:
                  и та и другая проходят по центру блока (выравнивание —
                  в scripts/make-stroke-art.mjs).
                */}
                <span
                  aria-hidden="true"
                  className="stroke-waterline pointer-events-none absolute inset-x-0 top-1/2 z-10 h-2 -translate-y-1/2"
                />
                {/*
                  Силуэт декоративен: что за стиль, уже сказано заголовком
                  вкладки и списком рядом, и второе объявление той же вещи
                  программе чтения только мешает.

                  Линия воды в самом рисунке выведена ровно на его середину
                  (scripts/make-stroke-art.mjs), поэтому схема ниже ставится
                  по центру того же блока — и две линии воды совпадают.

                  ТРАЕКТОРИЯ ЛЕЖИТ ПОД ФИГУРОЙ, А НЕ ПОВЕРХ. Сверху она
                  разрезала силуэт пополам: два главных объекта панели
                  спорили, и не читался ни один. Уменьшать фигуру пробовали
                  — она теряла присутствие, а кривая всё равно шла по
                  корпусу. Снизу кривая выходит из-за тела с обеих сторон и
                  скрывается за ним — так и должно быть: часть гребка правда
                  проходит под пловцом.
                */}

                <div
                  key={`${stroke.id}-art`}
                  className="absolute inset-0"
                >
                  {motionAllowed ? (
                    /*
                      Ролик беззвучный, зациклен и играет сам: это не контент,
                      а иллюстрация движения, и кнопка воспроизведения тут была
                      бы лишним действием. playsInline обязателен — без него
                      iOS открывает видео на весь экран по первому касанию.
                    */
                    <video
                      key={`${stroke.id}-video`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={imageLoader({
                        src: `/media/strokes/${stroke.id}.webp`,
                      })}
                      width={840}
                      height={549}
                      aria-hidden="true"
                      className="size-full object-cover"
                    >
                      <source
                        type="video/webm"
                        src={imageLoader({
                          src: `/media/strokes/${stroke.id}.webm`,
                        })}
                      />
                      <source
                        type="video/mp4"
                        src={imageLoader({
                          src: `/media/strokes/${stroke.id}.mp4`,
                        })}
                      />
                    </video>
                  ) : (
                    <picture className="absolute inset-0 block size-full">
                      <source
                        type="image/avif"
                        srcSet={imageLoader({
                          src: `/media/strokes/${stroke.id}.avif`,
                        })}
                      />
                      <img
                        src={imageLoader({
                          src: `/media/strokes/${stroke.id}.webp`,
                        })}
                        alt=""
                        aria-hidden="true"
                        width={900}
                        height={740}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-contain p-[5%]"
                      />
                    </picture>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stroke-draw { to { stroke-dashoffset: 0; } }
        @keyframes stroke-travel {
          0%   { offset-distance: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
