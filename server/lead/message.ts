/**
 * Текст заявки, который приходит школе в MAX.
 *
 * Живёт отдельно от формы и от обработчика намеренно: собирает сообщение
 * сервер (форма передаёт только поля), но покрыть текст тестами проще
 * здесь, рядом с остальной общей логикой заявки.
 *
 * Формат намеренно плоский — без Markdown и HTML. Имя и комментарий пишет
 * посторонний человек, и любая разметка означала бы, что чужой текст может
 * поменять вид сообщения. MAX отправляет такой текст как есть: в запросе
 * не передаётся `format`.
 */

import { ageOptions, programOptions } from '../../src/content/programs.ts';
import type { LeadValues } from '../../src/lib/lead-schema.ts';

export type LeadContext = {
  /** Номер заявки — его же видит родитель на экране «спасибо». */
  ticket: string;
  /** Страница, с которой отправлена форма. Только путь, без домена. */
  page?: string;
  /** Рекламная метка: utm_source и подобные, одной строкой. */
  source?: string;
};

/** Подпись варианта из списка. Если значения нет в списке — покажем как есть. */
function labelOf(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string,
  fallback: string,
): string {
  if (!value) return fallback;
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * Схлопывает строку в одну: убирает управляющие символы и переносы.
 * Нужно только для служебных полей (страница, метка) — их значение
 * приходит из браузера, и доверять его форме нельзя.
 */
function flatten(value: string, limit: number): string {
  return value
    .replace(/\p{C}+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

export function buildLeadMessage(
  values: LeadValues,
  context?: LeadContext,
): string {
  const lines = [
    context?.ticket
      ? `Заявка с сайта PRIME SWIM № ${context.ticket}`
      : 'Заявка с сайта PRIME SWIM',
    '',
    `Имя: ${values.name.trim()}`,
    `Телефон: ${values.phone.trim()}`,
    `Возраст ребёнка: ${labelOf(ageOptions, values.age, 'не указан')}`,
    `Направление: ${labelOf(programOptions, values.program, 'не выбрано')}`,
  ];

  const comment = values.comment.trim();
  if (comment) lines.push(`Комментарий: ${comment}`);

  const page = context?.page ? flatten(context.page, 200) : '';
  if (page) lines.push('', `Страница: ${page}`);

  const source = context?.source ? flatten(context.source, 300) : '';
  if (source) lines.push(`Источник: ${source}`);

  return lines.join('\n');
}
