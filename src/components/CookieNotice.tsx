'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useConsent, useHydrated, writeConsent } from '@/lib/consent';

/*
  Вопрос появляется после половины экрана прокрутки или через восемь секунд.
  До согласия аналитика не подключается. На узких экранах текст короче,
  а обе кнопки имеют одинаковую ширину и зону нажатия не менее 44 px.
  Высота панели передаётся липкой кнопке через ResizeObserver.
*/
export function CookieNotice() {
  const consent = useConsent();
  const hydrated = useHydrated();
  const ref = useRef<HTMLDivElement>(null);
  const [asked, setAsked] = useState(false);
  const visible = hydrated && consent === null && asked;

  /*
    Момент вопроса: половина экрана прокрутки или восемь секунд.

    Порог считается от высоты окна, а не в пикселях: половина телефона и
    половина ноутбука — это разные числа, а смысл один, «первый экран
    прочитан».

    Первый вызов onScroll до подписки — на случай перезагрузки посреди
    страницы: там прокрутка уже случилась и события больше не будет.
  */
  useEffect(() => {
    if (consent !== null || asked) return;

    const show = () => setAsked(true);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) show();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = window.setTimeout(show, 8000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, [consent, asked]);

  /*
    Панель сообщает свою высоту всей странице через CSS-переменную.

    Нужна она кнопке записи: раньше кнопка просто пряталась, пока висит
    этот вопрос, и в комментарии ниже стояло «перекрыть кнопку на
    несколько секунд лучше, чем показать две полосы разом». На деле
    секунды кончались не у всех: кто не отвечал на вопрос вовсе — а таких
    большинство, — проходил весь сайт с телефона без кнопки записи.
    Проверено на боевом сайте 7 сентября 2026.

    Переменная, а не прямая связь между компонентами: кнопка ничего не
    знает про эту панель, а панель — про кнопку. Высота меняется вместе с
    переносами текста, поэтому ResizeObserver, а не разовый замер.
  */
  useEffect(() => {
    const element = ref.current;
    if (!visible || !element) return;

    const root = document.documentElement;
    const apply = () =>
      root.style.setProperty(
        '--cookie-notice-h',
        `${Math.round(element.getBoundingClientRect().height)}px`,
      );

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(element);

    return () => {
      observer.disconnect();
      root.style.removeProperty('--cookie-notice-h');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Использование cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
        <p className="max-w-[68ch] text-sm leading-snug text-ink-soft sm:leading-relaxed">
          <span className="lg:hidden">
            Яндекс Метрика: cookie и IP-адрес — только с согласия. Подробнее — в{' '}
          </span>
          <span className="hidden lg:inline">
            Мы используем Яндекс Метрику, чтобы понимать, как посетители
            пользуются сайтом. Она сохраняет cookie и обрабатывает IP-адрес.
            Без вашего согласия счётчик не подключается. Подробнее — в{' '}
          </span>
          {/*
            prefetch={false}: баннер стоит на каждой странице, и без этого
            Next тянул страницу политики целиком всем подряд — 51 КБ до
            первого касания. По ссылке в баннере согласия переходят единицы,
            и им лишняя доля секунды не помешает.
          */}
          <Link
            href="/policy/"
            prefetch={false}
            className="font-medium text-brand-600 dark:text-brand-200 underline underline-offset-4"
          >
            политике
            <span className="hidden lg:inline"> обработки персональных данных</span>
          </Link>
          .
        </p>

        {/* кнопки делят ширину поровну: ни одна не выглядит основной по размеру */}
        <div className="grid shrink-0 grid-cols-2 gap-3 lg:flex">
          <button
            type="button"
            onClick={() => writeConsent('denied')}
            className="lift inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-control border border-hairline px-3 py-2 text-center text-sm leading-snug font-semibold [overflow-wrap:anywhere] text-ink-soft transition-colors hover:bg-surface-alt sm:flex-none sm:px-5"
          >
            Без аналитики
          </button>
          <button
            type="button"
            onClick={() => writeConsent('granted')}
            className="lift inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-control bg-lime-400 px-4 py-2 text-center text-sm leading-snug font-semibold [overflow-wrap:anywhere] text-abyss-950 transition-colors hover:bg-lime-300 sm:flex-none sm:px-5"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
