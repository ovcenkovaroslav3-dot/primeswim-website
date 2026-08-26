/**
 * Точки подключения аналитики.
 *
 * Счётчик подключается только если задан NEXT_PUBLIC_YANDEX_METRIKA_ID.
 * Пока номера нет, на страницу не грузится ни одного стороннего скрипта.
 * Выдуманных идентификаторов здесь нет и быть не должно.
 */

/**
 * Название цели в Яндекс Метрике. Сами цели создаются в интерфейсе Метрики —
 * код лишь отправляет событие с этим именем (тип цели — «JavaScript-событие»).
 *
 * Здесь перечислены только те цели, которые без кода не посчитать. Просмотр
 * стоимости и расписания в этот список намеренно не входит: это отдельные
 * адреса (/price/ и /raspisanie/), и в Метрике они заводятся целью типа
 * «Посещение страниц» по условию «url: содержит». Дублировать их событием
 * значило бы считать одно и то же дважды.
 */
export type AnalyticsGoal =
  | 'click_phone'
  | 'click_telegram'
  | 'click_max'
  | 'click_vk'
  | 'click_route'
  | 'cta_booking'
  | 'cta_schedule'
  | 'lead_submitted'
  | 'view_contacts';

export const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() || null;

export function isAnalyticsEnabled(): boolean {
  return Boolean(metrikaId);
}

type YandexMetrika = (
  id: string,
  action: string,
  goal?: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

/**
 * Отправить цель. Если счётчика нет — тихо ничего не делает,
 * поэтому вызывать безопасно из любого места.
 */
export function trackGoal(
  goal: AnalyticsGoal,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  if (!metrikaId || typeof window.ym !== 'function') return;

  try {
    window.ym(metrikaId, 'reachGoal', goal, params);
  } catch {
    // Сбой аналитики не должен ломать страницу для посетителя.
  }
}

/**
 * Имя атрибута, которым размечаются отслеживаемые элементы.
 * Пример: <a data-goal="click_telegram" ...>
 * Обработчик один на всю страницу — см. components/Analytics.tsx.
 */
export const GOAL_ATTRIBUTE = 'data-goal';
