'use client';

import Link from 'next/link';

import { useConsent, useHydrated, writeConsent } from '@/lib/consent';

/*
  Уведомление об аналитических cookie.

  Показывается, пока посетитель не выбрал. Отказ — равноправная кнопка, а не
  ссылка в углу: без реальной возможности отказаться информирование не имеет
  смысла, счётчик всё равно подключился бы.

  До первого рендера в браузере состояние неизвестно (localStorage на сервере
  нет), поэтому баннера нет и в разметке — иначе он мигал бы у тех, кто уже
  ответил, и ломал гидратацию.

  z-50 держит панель над липкой кнопкой записи (z-40): вопрос разовый, и
  перекрыть кнопку на несколько секунд лучше, чем показать две полосы разом.
*/
export function CookieNotice() {
  const consent = useConsent();
  const hydrated = useHydrated();

  if (!hydrated || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Использование cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-white/95 px-4 py-4 backdrop-blur sm:px-6"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-[68ch] text-sm leading-relaxed text-ink-soft">
          Мы используем Яндекс Метрику, чтобы понимать, как посетители
          пользуются сайтом. Она сохраняет cookie и обрабатывает IP-адрес.
          Без вашего согласия счётчик не подключается. Подробнее — в{' '}
          <Link
            href="/policy"
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            политике обработки персональных данных
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent('denied')}
            className="lift inline-flex min-h-11 items-center justify-center rounded-[10px] border border-hairline px-5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-alt"
          >
            Только необходимые
          </button>
          <button
            type="button"
            onClick={() => writeConsent('granted')}
            className="lift inline-flex min-h-11 items-center justify-center rounded-[10px] bg-lime-400 px-5 text-sm font-semibold text-abyss-950 transition-colors hover:bg-lime-300"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
