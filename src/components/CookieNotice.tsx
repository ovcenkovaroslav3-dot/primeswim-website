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

  НА ТЕЛЕФОНЕ ПАНЕЛЬ КОРОТКАЯ. Она занимала 207 px из 844 — почти четверть
  первого экрана, то есть съедала место, отведённое под само предложение.
  Текст на узком экране сокращён до сути: что подключается и что без согласия
  этого не происходит. Подробности не потеряны — полный разбор в политике,
  ссылка рядом. На широком экране остался прежний развёрнутый текст: там
  высота ничего не стоит.

  Обе кнопки при этом равнозначны и одинакового размера. Спрятать отказ в
  ссылку значило бы сделать согласие безальтернативным — тогда информирование
  теряет смысл, а счётчик подключался бы фактически без выбора.
*/
export function CookieNotice() {
  const consent = useConsent();
  const hydrated = useHydrated();

  if (!hydrated || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Использование cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-white/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <p className="max-w-[68ch] text-[13px] leading-snug text-ink-soft sm:text-sm sm:leading-relaxed">
          {/*
            Короткая версия — до 640 px, развёрнутая — дальше. Обе описывают
            одно и то же: без согласия счётчик не подключается.
          */}
          <span className="sm:hidden">
            Метрика подключается только с вашего согласия: она ставит cookie и
            обрабатывает IP-адрес. Подробнее — в{' '}
          </span>
          <span className="hidden sm:inline">
            Мы используем Яндекс Метрику, чтобы понимать, как посетители
            пользуются сайтом. Она сохраняет cookie и обрабатывает IP-адрес.
            Без вашего согласия счётчик не подключается. Подробнее — в{' '}
          </span>
          <Link
            href="/policy"
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            политике
            <span className="hidden sm:inline"> обработки персональных данных</span>
          </Link>
          .
        </p>

        {/* кнопки делят ширину поровну: ни одна не выглядит основной по размеру */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent('denied')}
            className="lift inline-flex min-h-11 flex-1 items-center justify-center rounded-[10px] border border-hairline px-4 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-alt sm:flex-none sm:px-5"
          >
            Только необходимые
          </button>
          <button
            type="button"
            onClick={() => writeConsent('granted')}
            className="lift inline-flex min-h-11 flex-1 items-center justify-center rounded-[10px] bg-lime-400 px-4 text-sm font-semibold text-abyss-950 transition-colors hover:bg-lime-300 sm:flex-none sm:px-5"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
