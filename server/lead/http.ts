/**
 * Точка входа для обычного хостинга: Timeweb Cloud Apps, VPS, docker —
 * всё, где приложение просто слушает порт.
 *
 * Здесь только перевод формата: запрос Node → HandlerRequest и обратно.
 * Логика заявки в handler.ts и от площадки не зависит.
 *
 * Почему российский хостинг: заявка содержит персональные данные, а ч. 5
 * ст. 18 152-ФЗ требует обрабатывать данные граждан России на серверах в
 * России. Приёмник ничего не хранит, но принимает и передаёт — спорить с
 * РКН о том, считается ли это «накоплением», дороже, чем сразу взять
 * площадку в нужной юрисдикции.
 */

import { createServer } from 'node:http';

import { createLeadHandler } from './handler.ts';
import { LEAD_REQUEST_MAX_BYTES } from '../../src/lib/lead-schema.ts';

const port = Number(process.env.PORT ?? 8080);
const host = process.env.HOST ?? '0.0.0.0';

const handle = createLeadHandler({
  env: process.env,
  // Единственное место, куда что-то пишется. Статус и номер заявки — да,
  // содержимое заявки — нет.
  log: (message) => console.log(message),
});

/**
 * IP посетителя. Приложение стоит за прокси площадки, поэтому адрес сокета
 * всегда её собственный — реальный адрес приходит в X-Forwarded-For, первым
 * в списке. Заголовок подделывается кем угодно, поэтому на нём держится
 * только лимит частоты, а не проверка прав.
 */
function clientIp(forwarded: string | string[] | undefined, socket: string | undefined): string | null {
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = raw?.split(',')[0]?.trim();
  return first || socket || null;
}

const server = createServer((req, res) => {
  // Health-check площадки: она дёргает приложение, чтобы понять, живо ли оно.
  // Отдельный адрес нужен потому, что на всё остальное приёмник отвечает 405
  // или 403 — формально это ответ, но читать такой мониторинг неприятно.
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('ok');
    return;
  }

  const chunks: Buffer[] = [];
  let size = 0;
  let aborted = false;

  req.on('data', (chunk: Buffer) => {
    if (aborted) return;
    size += chunk.length;
    // Обрываем на входе, а не после чтения: складывать в память мегабайты,
    // чтобы потом их отклонить, — работа, за которую платит владелец сервера.
    if (size > LEAD_REQUEST_MAX_BYTES) {
      aborted = true;
      res.writeHead(413, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, message: 'Слишком большой запрос.' }));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', async () => {
    if (aborted) return;
    try {
      const response = await handle({
        method: req.method ?? 'GET',
        origin: (Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin) ?? null,
        ip: clientIp(req.headers['x-forwarded-for'], req.socket.remoteAddress),
        body: Buffer.concat(chunks).toString('utf8') || null,
      });
      res.writeHead(response.status, response.headers);
      res.end(response.body);
    } catch (error) {
      // Сюда попадать не должно: обработчик ловит свои ошибки сам. Но упасть
      // целиком из-за одной заявки нельзя — сервер обслуживает и следующие.
      console.log(`lead: непредвиденная ошибка: ${error instanceof Error ? error.message : error}`);
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, message: 'Внутренняя ошибка.' }));
    }
  });
});

server.listen(port, host, () => {
  console.log(`Приёмник заявок слушает ${host}:${port}`);
});

// Площадка гасит приложение сигналом при передеплое. Без этого соединения
// рвутся посреди запроса, и заявка теряется на ровном месте.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
