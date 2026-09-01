import { Picture } from '../Picture';
import { Section, SectionHeading } from '../ui';
import { galleryGridImages, galleryVideos } from '@/content/media';

/*
  Галерея.

  С тремя снимками работала раскладка «крупный слева + два справа
  столбцом» — она держалась на точном количестве плиток и рассыпалась бы
  на большем наборе: лишние фото просто вставали бы в один нескончаемый
  столбец. Список вырос до двух десятков кадров с разных событий (будни в
  бассейне МГИК, выезд на соревнования в Тольятти, каток), и раскладке
  нужно было выдержать любое количество без переделки.

  Фотографии идут колоночным мазонри: каждая карточка сохраняет свои
  пропорции (next/image здесь без fill, с натуральными width/height),
  колонка сама подбирает следующую по высоте — щелей не остаётся, а новое
  фото можно дописать в конец массива, не трогая разметку.

  ВИДЕО НАМЕРЕННО СТОЯТ ОТДЕЛЬНОЙ СЕТКОЙ, А НЕ В ОБЩЕМ ПОТОКЕ ПЛИТОК.
  Сначала они были вперемешку с фото, внутри `columns`, и на iPhone это
  давало настоящую поломку: элемент <video> заводит собственный слой
  отрисовки, а внутри многоколоночной вёрстки браузер считает его позицию
  неверно. Клип уезжал из галереи и рисовался белым прямоугольником поверх
  чужой секции — накрывал шаги в «Как проходит первое занятие». Ширина и
  высота прямоугольника в точности совпадали с плиткой видео: 171 px —
  ширина колонки на телефоне, 304 px — её высота при кадре 720x1280.

  Обычная grid-сетка не фрагментируется по колонкам, и слой видео остаётся
  на своём месте. Поэтому здесь именно grid — менять его на columns нельзя,
  даже если захочется вписать видео обратно в мазонри.

  ФОТОГРАФИИ БЕРУТСЯ ИЗ media/preview/grid, а не из архивных оригиналов.
  Колонка занимает максимум 357 px на десктопе и 171 px на телефоне, а
  файлы были шириной 1280–1500 px: страница отдавала 4 871 KB, чтобы
  показать снимки размером с почтовую марку. Копии шириной 720 — это
  двойная плотность для самой широкой колонки, на экране разницы нет,
  вес 2 323 KB. Увеличить кадр по клику здесь нельзя, лайтбокса нет,
  поэтому и полное разрешение показывать некуда.
*/
export function Gallery({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' } = {}) {
  return (
    <Section id="gallery" labelledBy="gallery-title" className="bg-surface-alt">
      <SectionHeading
        as={headingAs}
        id="gallery-title"
        eyebrow="Галерея"
        title="Фото и видео с тренировок в Химках"
        lead="Тренировки, соревнования и первые награды наших учеников."
      />

      <ul
        className="reveal mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3"
        style={{ ['--reveal-delay' as string]: '80ms' }}
      >
        {galleryVideos.map((video) => (
          <li
            key={video.src}
            className="relative overflow-hidden rounded-[20px] bg-surface"
          >
            <video
              src={video.src}
              poster={video.poster}
              aria-label={video.alt}
              controls
              playsInline
              preload="none"
              className="block h-auto w-full"
            />
          </li>
        ))}
      </ul>

      <ul
        className="reveal mt-4 columns-2 gap-4 lg:columns-3"
        style={{ ['--reveal-delay' as string]: '120ms' }}
      >
        {galleryGridImages.map((photo) => (
          <li
            key={photo.src}
            className="zoom-frame relative mb-4 overflow-hidden rounded-[20px] bg-surface break-inside-avoid"
          >
            <Picture
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              className="block h-auto w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
