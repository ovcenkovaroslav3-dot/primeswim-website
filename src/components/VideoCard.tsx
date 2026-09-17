'use client';

import { useRef, useState } from 'react';

import { Picture } from './Picture';

/*
  Ролик с постером и своей кнопкой воспроизведения.

  ЗАЧЕМ. Нативный <video controls> показывает постер вместе с панелью
  управления браузера: снизу кадра ложится серая полоса с ползунком,
  громкостью, «картинка в картинке» и тремя точками. На странице, где всё
  остальное собрано по одной сетке и одной палитре, это чужой элемент —
  и единственное место на сайте, которое выглядит как вставка с видеохостинга.

  До первого нажатия панели нет вообще: видно только кадр и круглая кнопка.
  По нажатию элемент получает controls и начинает играть — дальше управление
  нужно настоящее, своё рисовать незачем.

  ВЕС НЕ ВЫРОС. preload="none" остаётся: пока не нажали, из ролика не
  скачивается ни байта.

  ПОСТЕР — КАРТИНКОЙ, А НЕ АТРИБУТОМ, и это не стилистика. Атрибут `poster`
  не уважает ленивую загрузку: браузер тянет его сразу, как только разобрал
  элемент, даже если ролик стоит на четвёртом экране и даже при
  preload="none". Замер на боевом сайте: главная тянула 84 КБ постера до
  всякой прокрутки, галерея — 260 КБ тремя файлами.

  Через общий Picture, а не голым <img>: он даёт и ленивую загрузку, и AVIF
  вместо JPEG — постеры от этого похудели ещё на треть, с 84 до 59 КБ.

  ДОСТУПНОСТЬ. Кнопка настоящая, с именем, и до неё доходит табуляция; сам
  <video> до нажатия из обхода убран — иначе в порядке обхода оказывались два
  элемента, делающие одно и то же, причём у первого не было видимого
  управления.
*/
export function VideoCard({
  src,
  poster,
  label,
  width,
  height,
  className = '',
}: {
  src: string;
  poster: string;
  /** Что в ролике — уходит и в кнопку, и в имя самого <video>. */
  label: string;
  width: number;
  height: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    /*
      play() возвращает промис, и он отклоняется, если браузер счёл жест
      недостаточным. Ловим молча: элемент уже с controls, человек нажмёт
      ещё раз сам — показывать ему ошибку не за что.
    */
    void ref.current?.play().catch(() => {});
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[16px] bg-abyss-800 ${className}`.trim()}
    >
      {/*
        Постер лежит поверх ролика картинкой и снимается по нажатию. У <video>
        атрибута poster нет намеренно — иначе браузер скачал бы его сразу, и
        весь смысл ленивой загрузки пропал бы.
      */}
      {started ? null : (
        <div aria-hidden="true" className="absolute inset-0">
          <Picture
            src={poster}
            alt=""
            width={width}
            height={height}
            className="block h-full w-full object-cover"
          />
        </div>
      )}

      <video
        ref={ref}
        src={src}
        aria-label={label}
        width={width}
        height={height}
        controls={started}
        playsInline
        preload="none"
        tabIndex={started ? undefined : -1}
        className="block h-auto w-full"
      />

      {started ? null : (
        <button
          type="button"
          onClick={start}
          data-goal="play_coach_video"
          className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-abyss-950/15 transition-colors duration-200 hover:bg-abyss-950/30"
        >
          <span className="sr-only">Смотреть: {label}</span>
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full bg-white/92 shadow-[0_18px_44px_-16px_rgba(0,0,0,0.9)] backdrop-blur transition-transform duration-200 group-hover:scale-105"
          >
            {/* треугольник слегка сдвинут вправо: оптический центр круга
                не совпадает с геометрическим, если фигура несимметрична */}
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              aria-hidden="true"
              className="ml-1 fill-abyss-950"
            >
              <path d="M21 10.3a2 2 0 0 1 0 3.4L3 23.7A2 2 0 0 1 0 22V2A2 2 0 0 1 3 .3Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
