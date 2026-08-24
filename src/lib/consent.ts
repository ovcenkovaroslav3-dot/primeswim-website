/**
 * Согласие на аналитические cookie.
 *
 * Яндекс Метрика ставит cookie и передаёт IP-адрес посетителя. Роскомнадзор
 * относит эту связку к персональным данным, поэтому счётчик не должен
 * подключаться до того, как посетитель согласился: до выбора на страницу
 * не попадает ни одного стороннего скрипта.
 *
 * Выбор хранится в localStorage, а не в cookie: своей серверной части у
 * сайта нет, читать значение нужно только в браузере, и лишний заголовок в
 * каждом запросе ни к чему.
 *
 * Об изменении сообщаем событием на window — так баннер и подключение
 * счётчика остаются независимыми компонентами и не тянут общий стор.
 */

import { useSyncExternalStore } from 'react';

export type ConsentValue = 'granted' | 'denied';

const STORAGE_KEY = 'primeswim:analytics-consent';

export const CONSENT_EVENT = 'primeswim:analytics-consent-change';

/** null — выбор ещё не сделан. */
export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'granted' || stored === 'denied' ? stored : null;
  } catch {
    // приватный режим может запрещать хранилище — тогда спросим ещё раз
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // не смогли запомнить — счётчик всё равно включим на эту сессию
  }

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Подписка на изменение выбора. Событие `storage` добавлено, чтобы ответ,
 * данный в одной вкладке, подхватывался в остальных открытых.
 */
export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onChange);

  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** На сервере выбора нет: localStorage там недоступен. */
function serverConsent(): ConsentValue | null {
  return null;
}

/**
 * Текущий выбор посетителя.
 *
 * useSyncExternalStore, а не useState с useEffect: хранилище тут внешнее по
 * отношению к React, и подписка на него — ровно то, для чего этот хук
 * сделан. Побочно снимается проблема гидратации — при первом рендере в
 * браузере значение берётся тем же способом, что и в разметке.
 */
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
}

/*
  Подписка-заглушка: снапшот никогда не меняется, поэтому и уведомлять не о
  чем. Ссылка на функцию должна быть постоянной, иначе хук пересоздавал бы
  подписку на каждом рендере.
*/
const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Отработала ли гидратация. Нужно, чтобы не печатать баннер в статической
 * разметке: она собирается один раз на сборке и одинакова для всех, а
 * вернувшийся посетитель на свой ответ уже ответил — он увидел бы, как
 * баннер мигает и исчезает.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, onClient, onServer);
}
