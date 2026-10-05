/**
 * Точка входа для бессерверных площадок — Yandex Cloud Functions и подобных.
 *
 * НЕ ОСНОВНОЙ ПУТЬ. Приёмник развёрнут на Timeweb Cloud обычным процессом,
 * и его вход — http.ts. Этот файл оставлен как запасной: если однажды
 * окажется, что держать процесс ради нескольких заявок в день дорого,
 * переезд будет стоить смены команды запуска, а не переписывания.
 *
 * Здесь только перевод формата: событие площадки → HandlerRequest и обратно.
 * Вся логика заявки в handler.ts и от площадки не зависит.
 *
 * Любая площадка, на которую это попадёт, должна быть в российской
 * юрисдикции: заявка содержит персональные данные, а ч. 5 ст. 18 152-ФЗ
 * требует обрабатывать данные граждан России на серверах в России.
 * Cloudflare Workers, куда такое кладут по привычке, не подходят.
 */

import { createLeadHandler } from './handler.ts';

type CloudEvent = {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext?: { identity?: { sourceIp?: string } };
};

type CloudResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

/** Заголовки приходят в исходном регистре — ищем без учёта регистра. */
function header(event: CloudEvent, name: string): string | null {
  const headers = event.headers ?? {};
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? (headers[key] ?? null) : null;
}

const handle = createLeadHandler({
  env: process.env,
  // console.log площадки — единственное место, куда что-то пишется.
  // Обработчик передаёт сюда статус и номер заявки, но не её содержимое.
  log: (message) => console.log(message),
});

export const handler = async (event: CloudEvent): Promise<CloudResponse> => {
  const body = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : (event.body ?? null);

  const response = await handle({
    method: event.httpMethod ?? 'GET',
    origin: header(event, 'origin'),
    ip: event.requestContext?.identity?.sourceIp ?? null,
    body,
  });

  return {
    statusCode: response.status,
    headers: response.headers,
    body: response.body,
  };
};
