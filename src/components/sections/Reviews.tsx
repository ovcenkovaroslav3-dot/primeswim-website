import { Section, SectionHeading } from '../ui';
import { reviews, reviewsSource } from '@/content/reviews';

/*
  Отзывы.

  Шесть равных карточек читались как таблица, поэтому первый отзыв идёт
  крупной цитатой, а остальные — компактной сеткой вокруг. На широком
  экране выделенная цитата занимает две колонки и две строки, и девять
  ячеек сетки заполняются без дыр.

  Источник назывался дважды — в подзаголовке и в сноске. Оставлена сноска:
  там же ссылка на карточку школы, куда можно пойти и проверить.

  Тексты не редактируются и не сокращаются: это публичные отзывы
  с Яндекс Карт, они должны совпадать с оригиналом дословно.

  `limit` обрезает количество карточек, но не сами отзывы. Нужен для
  главной: шесть отзывов занимали там 1 700 px на телефоне и вставали
  длинной паузой между фотографиями и бассейном. Урезать чужой текст
  нельзя, а показать часть карточек и увести к первоисточнику — можно;
  ссылка на карточку школы стоит под блоком в любом случае.
*/
export function Reviews({ limit }: { limit?: number } = {}) {
  const shown = limit ? reviews.slice(0, limit) : reviews;

  /*
    Пустой список — не ошибка, а рабочее состояние: настоящих отзывов пока
    нет, и секции на сайте быть не должно. Без этой проверки страница
    падала бы на деструктуризации ниже.

    Секция с заголовком «Что говорят родители» и пустотой под ним была бы
    хуже её отсутствия: она обещает доказательство и не даёт его.
  */
  if (shown.length === 0) return null;

  const [featured, ...rest] = shown;

  return (
    <Section id="reviews" labelledBy="reviews-title" className="bg-surface">
      <SectionHeading
        id="reviews-title"
        eyebrow="Отзывы"
        title="Что говорят родители"
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li
          className="reveal relative flex flex-col overflow-clip rounded-[20px] bg-abyss-900 p-8 text-white md:col-span-2 lg:row-span-2 lg:p-10"
        >
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-brand-300/16 blur-3xl"
          />
          <div className="relative flex flex-1 flex-col">
            {/* кавычка набрана основным шрифтом: в Unbounded она геометрическая
                и читается как иконка, а не как знак цитаты */}
            <span
              aria-hidden="true"
              className="text-5xl leading-none font-light text-lime-300/45"
            >
              «
            </span>
            <blockquote className="mt-4 flex-1 text-xl leading-relaxed font-light sm:text-2xl">
              {featured.text}
            </blockquote>
            <footer className="mt-8 border-t border-white/15 pt-5">
              <p className="font-medium text-white">{featured.author}</p>
              <p className="mt-1 text-sm text-white/60">{featured.context}</p>
            </footer>
          </div>
        </li>

        {rest.map((review, i) => (
          <li
            key={review.id}
            className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-6"
            style={{ ['--reveal-delay' as string]: `${60 + i * 60}ms` }}
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
              «{review.text}»
            </blockquote>
            <footer className="mt-5 border-t border-hairline pt-4">
              <p className="text-sm font-medium text-ink">{review.author}</p>
              <p className="mt-1 text-xs text-ink-muted">{review.context}</p>
            </footer>
          </li>
        ))}
      </ul>

      <p className="reveal mt-8 text-sm text-ink-muted">
        {shown.length < reviews.length
          ? 'Здесь показана часть отзывов. Все они опубликованы пользователями на Яндекс Картах.'
          : 'Отзывы опубликованы пользователями на Яндекс Картах.'}{' '}
        <a
          href={reviewsSource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          Открыть карточку школы
        </a>
        .
      </p>
    </Section>
  );
}
