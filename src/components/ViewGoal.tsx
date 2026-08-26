'use client';

import { useEffect, useRef } from 'react';

import { metrikaId, trackGoal, type AnalyticsGoal } from '@/lib/analytics';

/**
 * Цель «блок дошёл до экрана».
 *
 * Нужна там, где ценное действие — не клик, а сам факт, что посетитель
 * добрался до блока: до контактов на главной так доходит меньше половины,
 * и без этой цифры непонятно, теряется трафик Директа выше по странице или
 * упирается в сам блок.
 *
 * Стоит невидимой меткой в начале секции: наблюдатель следит за ней, а не
 * за всей секцией — секция высокая, и «видна» она была бы почти всегда.
 *
 * Срабатывает один раз за загрузку страницы: наблюдатель отключается сразу
 * после попадания, поэтому прокрутка туда-обратно не накручивает цель.
 * Без счётчика не создаётся вовсе — лишнего наблюдателя на странице не
 * появляется.
 */
export function ViewGoal({ goal }: { goal: AnalyticsGoal }) {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!metrikaId) return;

    const element = marker.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      trackGoal(goal);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [goal]);

  return <span ref={marker} aria-hidden="true" className="block" />;
}
