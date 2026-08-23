'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import {
  GOAL_ATTRIBUTE,
  metrikaId,
  trackGoal,
  type AnalyticsGoal,
} from '@/lib/analytics';

/**
 * Подключение Яндекс Метрики и отслеживание кликов.
 *
 * Если номер счётчика не задан, компонент не рендерит ничего и не вешает
 * обработчиков — сторонний скрипт на страницу не попадает.
 *
 * Клики отслеживаются одним обработчиком на весь документ: так остальные
 * компоненты остаются серверными и в браузер не уезжает лишний JavaScript.
 */
export function Analytics() {
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

  if (!metrikaId) return null;

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
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${metrikaId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
