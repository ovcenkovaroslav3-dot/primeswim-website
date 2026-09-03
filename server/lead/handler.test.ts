/**
 * Тесты приёмника заявок. Запуск: npm test
 *
 * Доставка в MAX подменяется: в тестах ни одного сетевого запроса нет.
 * Проверяется поведение, за которое отвечает именно endpoint, — что он
 * пропускает, что отклоняет и что при этом попадает в лог.
 */

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { createLeadHandler, resetHandlerState, type HandlerRequest } from './handler.ts';
import type { DeliveryResult } from './max.ts';

const ORIGIN = 'https://www.primeswim.ru';

const env = {
  MAX_BOT_TOKEN: 'test-token',
  MAX_CHAT_ID: '-100500',
};

function lead(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Мария',
    phone: '+7 991 229-99-77',
    age: '7-8',
    program: 'beginners',
    comment: '',
    consent: true,
    hpx7: '',
    requestId: 'req-1',
    ...overrides,
  };
}

function post(body: unknown, extra: Partial<HandlerRequest> = {}): HandlerRequest {
  return {
    method: 'POST',
    origin: ORIGIN,
    ip: '203.0.113.7',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...extra,
  };
}

/** Всё, что endpoint может вернуть в теле ответа. */
type Payload = {
  ok?: boolean;
  ticket?: string;
  duplicate?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

type Harness = {
  handle: (request: HandlerRequest) => Promise<{
    status: number;
    payload: Payload;
    headers: Record<string, string>;
  }>;
  sent: string[];
  logs: string[];
};

function harness(options: {
  result?: DeliveryResult;
  env?: Record<string, string | undefined>;
} = {}): Harness {
  const sent: string[] = [];
  const logs: string[] = [];
  const handler = createLeadHandler({
    env: options.env ?? env,
    log: (message) => logs.push(message),
    deliver: async (text) => {
      sent.push(text);
      return options.result ?? { ok: true };
    },
  });

  return {
    sent,
    logs,
    handle: async (request) => {
      const response = await handler(request);
      return {
        status: response.status,
        headers: response.headers,
        payload: (response.body ? JSON.parse(response.body) : {}) as Payload,
      };
    },
  };
}

beforeEach(() => resetHandlerState());

test('preflight с сайта школы разрешён', async () => {
  const { handle } = harness();
  const response = await handle({ method: 'OPTIONS', origin: ORIGIN, ip: null, body: null });

  assert.equal(response.status, 204);
  assert.equal(response.headers['access-control-allow-origin'], ORIGIN);
});

test('запрос с чужого адреса отклоняется без заголовков CORS', async () => {
  const { handle, sent } = harness();
  const response = await handle(post(lead(), { origin: 'https://example.com' }));

  assert.equal(response.status, 403);
  assert.equal(response.headers['access-control-allow-origin'], undefined);
  assert.equal(sent.length, 0);
});

test('GET не принимается: заявка приходит только POST', async () => {
  const { handle } = harness();
  const response = await handle({ method: 'GET', origin: ORIGIN, ip: null, body: null });

  assert.equal(response.status, 405);
});

test('битый JSON отклоняется, а не роняет функцию', async () => {
  const { handle } = harness();
  const response = await handle(post('{не json'));

  assert.equal(response.status, 400);
  assert.equal(response.payload.ok, false);
});

test('тело не той формы отклоняется до проверки полей', async () => {
  const { handle } = harness();
  // consent числом — форма такого не пришлёт, а curl пришлёт
  const response = await handle(post(lead({ consent: 1 })));

  assert.equal(response.status, 400);
  assert.equal(response.payload.errors, undefined);
});

test('слишком большое тело отклоняется', async () => {
  const { handle, sent } = harness();
  const response = await handle(post(lead({ comment: 'а'.repeat(20_000) })));

  assert.equal(response.status, 413);
  assert.equal(sent.length, 0);
});

test('ошибки полей возвращаются теми же сообщениями, что показывает форма', async () => {
  const { handle, sent } = harness();
  const response = await handle(post(lead({ phone: '123', consent: false })));

  assert.equal(response.status, 400);
  assert.ok(response.payload.errors?.phone);
  assert.ok(response.payload.errors?.consent);
  assert.equal(sent.length, 0, 'при ошибке в полях в MAX ничего не уходит');
});

test('ловушка для ботов: ответ как при успехе, но заявка не уходит', async () => {
  const { handle, sent } = harness();
  const response = await handle(post(lead({ hpx7: 'https://spam' })));

  assert.equal(response.status, 200);
  assert.equal(response.payload.ok, true, 'бот не должен понять, что его отсеяли');
  assert.equal(sent.length, 0);
});

test('заявка доходит до MAX и возвращает номер', async () => {
  const { handle, sent } = harness();
  const response = await handle(post(lead({ comment: 'Занимались год назад' })));

  assert.equal(response.status, 200);
  assert.equal(response.payload.ok, true);
  const ticket = response.payload.ticket ?? '';
  assert.match(ticket, /^\d{4}-\d{4}$/);

  assert.equal(sent.length, 1);
  assert.match(sent[0], /Мария/);
  assert.match(sent[0], /\+7 991 229-99-77/);
  assert.match(sent[0], /7–8 лет/);
  assert.match(sent[0], /Обучение с нуля/);
  assert.match(sent[0], /Занимались год назад/);
  assert.match(sent[0], new RegExp(ticket));
});

test('повтор с тем же ключом не создаёт вторую заявку', async () => {
  const { handle, sent } = harness();
  const first = await handle(post(lead()));
  const second = await handle(post(lead()));

  assert.equal(second.status, 200);
  assert.equal(second.payload.ticket, first.payload.ticket);
  assert.equal(second.payload.duplicate, true);
  assert.equal(sent.length, 1, 'в MAX уходит одно сообщение, а не два');
});

test('поток заявок с одного адреса упирается в лимит', async () => {
  const { handle } = harness();

  const codes: number[] = [];
  for (let i = 0; i < 7; i += 1) {
    const response = await handle(
      post(lead({ requestId: `req-${i}`, phone: `+7 900 000-00-0${i}` })),
    );
    codes.push(response.status);
  }

  assert.ok(codes.includes(429), 'лимит должен сработать');
  assert.equal(codes[0], 200, 'первая заявка проходит');
});

test('без настроенного MAX форма получает честный отказ, а не «спасибо»', async () => {
  const { handle } = harness({ env: {} });
  const response = await handle(post(lead()));

  assert.equal(response.status, 503);
  assert.equal(response.payload.ok, false);
});

test('отказ MAX превращается в ошибку для родителя', async () => {
  const { handle } = harness({
    result: { ok: false, reason: 'unavailable', detail: 'timeout' },
  });
  const response = await handle(post(lead()));

  assert.equal(response.status, 502);
  assert.equal(response.payload.ok, false);
  assert.ok((response.payload.message ?? '').length > 0);
});

test('в лог не попадают персональные данные', async () => {
  const { handle, logs } = harness();
  await handle(post(lead({ comment: 'ребёнок боится воды' })));

  const joined = logs.join('\n');
  assert.ok(joined.length > 0, 'что-то в лог писаться должно');
  for (const secret of ['Мария', '9912299977', '229-99-77', 'боится воды']) {
    assert.ok(!joined.includes(secret), `в логе не должно быть «${secret}»`);
  }
});
