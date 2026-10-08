/**
 * Переход к заявке с уже выбранными параметрами.
 *
 * Подбор группы и кнопки времени в расписании не держат собственных форм:
 * у сайта одна форма записи (LeadForm в FinalCta, якорь #booking), и всё
 * сходится в неё. Так у школы один канал заявок, а не три разных формы,
 * каждую из которых надо проверять отдельно.
 *
 * Как передаётся выбор. Если форма на этой же странице — событием: она его
 * слушает и подставляет поля. Если формы на странице нет — выбор кладётся в
 * sessionStorage и страница уходит на главную к форме; там форма заберёт его
 * при монтировании. Хранилище может быть недоступно (приватный режим) —
 * тогда переход всё равно случится, просто без подстановки.
 *
 * Персональных данных здесь нет: только возраст группой, направление, время
 * и короткое описание ответов подбора.
 */

export type BookingPrefill = {
  age?: string;
  program?: string;
  /** Значение из slotOptions (content/schedule.ts) */
  slot?: string;
  /** Что ответил родитель в подборе — уходит школе вместе с заявкой */
  note?: string;
};

export const BOOKING_EVENT = 'primeswim:booking';
const STORAGE_KEY = 'primeswim:booking-prefill';

export function requestBooking(prefill: BookingPrefill): void {
  if (typeof window === 'undefined') return;

  const form = document.getElementById('booking');
  if (form) {
    window.dispatchEvent(new CustomEvent<BookingPrefill>(BOOKING_EVENT, { detail: prefill }));
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefill));
  } catch {
    // без хранилища просто перейдём к форме
  }
  // Сейчас подбор и кнопки времени стоят только на страницах с формой, так
  // что это запасной путь. Полная загрузка здесь уместна: форма заберёт
  // выбор из хранилища при монтировании.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- нужна полная загрузка, см. выше
  window.location.href = '/#booking';
}

/** Забирает отложенный выбор один раз: после чтения он удаляется. */
export function takePendingBooking(): BookingPrefill | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    const parsed: unknown = JSON.parse(raw);
    return sanitizePrefill(parsed);
  } catch {
    return null;
  }
}

/** Из хранилища может прийти что угодно — берём только строки известных полей. */
export function sanitizePrefill(raw: unknown): BookingPrefill | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const body = raw as Record<string, unknown>;
  const pick = (key: string, max: number) =>
    typeof body[key] === 'string' ? (body[key] as string).slice(0, max) : undefined;
  return {
    age: pick('age', 20),
    program: pick('program', 40),
    slot: pick('slot', 40),
    note: pick('note', 240),
  };
}
