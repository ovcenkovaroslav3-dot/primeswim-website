'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import {
  GOAL_ATTRIBUTE,
  metrikaId,
  trackGoal,
  type AnalyticsGoal,
} from '@/lib/analytics';
import { useConsent } from '@/lib/consent';

/**
 * Подключение Яндекс Метрики и отслеживание кликов.
 *
 * Если номер счётчика не задан, компонент не рендерит ничего и не вешает
 * обработчиков — сторонний скрипт на страницу не попадает.
 *
 * Счётчик подключается только после согласия посетителя: Метрика ставит
 * cookie и обрабатывает IP-адрес, а это персональные данные. Пока выбор не
 * сделан или получен отказ, тега Метрики в разметке нет вовсе — см.
 * lib/consent.ts и components/CookieNotice.tsx.
 *
 * Вебвизор не включается намеренно и включать его не нужно: он записывает
 * поведение на странице с формой, где родитель вводит своё имя, телефон и
 * возраст ребёнка. Такая запись — обработка персональных данных, на
 * которую согласия никто не давал: галочка в форме про заявку, а не про
 * запись сессии. Настройка init ниже перечислена явно, чтобы включение
 * было заметно в диффе, а не появилось молча.
 *
 * Клики отслеживаются одним обработчиком на весь документ: так остальные
 * компоненты остаются серверными и в браузер не уезжает лишний JavaScript.
 * Обработчик висит независимо от согласия — без счётчика trackGoal тихо
 * ничего не делает.
 */
export function Analytics() {
  const consent = useConsent();

  useEffect(() => {
    if (!metrikaId) return;

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>(`[${GOAL_ATTRIBUTE}]`);
      const goal = element?.getAttribute(GOAL_ATTRIBUTE);
      if (goal) trackGoal(goal as AnalyticsGoal);
    }

    document.addEventListener('click', onClick, { passive: true });
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!metrikaId || consent !== 'granted') return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${JSON.stringify(metrikaId)}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true
          });
        `}
      </Script>
    </>
  );
}

/*
  Пиксель в <noscript> убран намеренно. Он отправлял запрос в Метрику сразу
  при загрузке страницы, а спросить согласие без JavaScript невозможно —
  получалось, что у части посетителей данные собирались в обход выбора.
  Терять здесь почти нечего: без JavaScript не работает и сам счётчик.
*/
