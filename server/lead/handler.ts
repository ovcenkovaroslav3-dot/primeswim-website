/**
 * Приём заявки с сайта. Ядро обработчика, не зависящее от площадки.
 *
 * Сайт собран статикой и лежит на GitHub Pages — серверного кода там нет
 * вообще, поэтому форма обращается сюда по HTTPS. Что здесь происходит:
 *
 *   POST → проверка Origin → разбор JSON → те же правила, что в форме →
 *   ловушка для ботов → лимит частоты → доставка в MAX → номер заявки
 *
 * Ответ с номером заявки — единственное, на основании чего сайт имеет право
 * отправить цель `lead_delivered`. Пока MAX не подтвердил приём, родителю
 * показывается ошибка и запасной путь, а не «спасибо»: см. docs/lead-delivery.md.
 *
 * ЧЕГО ЗДЕСЬ НЕТ И БЫТЬ НЕ ДОЛЖНО. Заявка нигде не сохраняется: она уходит
 * в MAX и забывается. Ни имя, ни телефон, ни возраст, ни комментарий не
 * попадают в логи — туда идут только статус доставки и номер заявки. Это не
 * аккуратность, а способ не заводить базу персональных данных там, где она
 * не нужна: нет базы — нечему утечь и нечего локализовать.
 */

import {
  LEAD_REQUEST_MAX_BYTES,
  normalizePhone,
  parseLeadInput,
  validateLead,
  type LeadErrors,
  type LeadInput,
} from '../../src/lib/lead-schema.ts';
import { buildLeadMessage } from './message.ts';
import { validAgeIds, validProgramIds } from '../../src/content/programs.ts';

import { deliverToMax, readMaxConfig, type DeliveryResult } from './max.ts';

export type HandlerRequest = {
  method: string;
  origin: string | null;
  /** IP посетителя, как его видит площадка. Может отсутствовать. */
  ip: string | null;
  body: string | null;
};

export type HandlerResponse = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

export type HandlerDeps = {
  env: Record<string, string | undefined>;
  /** Подменяется в тестах, чтобы не ходить в MAX. */
  deliver?: (text: string) => Promise<DeliveryResult>;
  now?: () => number;
  /** Пишет в лог площадки. Персональных данных сюда не передаём. */
  log?: (message: string) => void;
};

const DEFAULT_ORIGINS = ['https://www.primeswim.ru', 'https://primeswim.ru'];

/*
  Пороги подобраны под масштаб школы, а не взяты из примера: одна площадка,
  один тренер, заявок единицы в день. Пять заявок с адреса за десять минут —
  это уже не семья, которая записывает двоих детей, а перебор. Когда наберётся
  реальная статистика, числа стоит пересмотреть по ней.

  Счётчики живут в памяти экземпляра функции. Холодный старт их обнуляет, а
  при параллельных экземплярах у каждого свой счёт — то есть это заслон от
  случайного дубля и примитивного скрипта, но не от распределённой атаки.
  Настоящий лимит потребовал бы внешнего хранилища; заводить его ради формы,
  в которую приходит несколько заявок в день, дороже, чем терпеть этот предел.
*/
const IP_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const PHONE_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 };
/** Сколько помним номер заявки, чтобы повтор запроса не создал вторую. */
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;

const hits = new Map<string, number[]>();
const tickets = new Map<string, { ticket: string; at: number }>();

function tooOften(key: string, limit: { max: number; windowMs: number }, now: number): boolean {
  const fresh = (hits.get(key) ?? []).filter((at) => now - at < limit.windowMs);
  if (fresh.length >= limit.max) {
    hits.set(key, fresh);
    return true;
  }
  fresh.push(now);
  hits.set(key, fresh);
  return false;
}

/**
 * Номер заявки. Родитель называет его по телефону, поэтому он короткий и
 * читается вслух: день-месяц и четыре цифры.
 *
 * Считается из ключа запроса, а не из счётчика: одинаковый ключ даёт
 * одинаковый номер, и повторная отправка с того же устройства не выглядит
 * как вторая заявка.
 */
function makeTicket(requestId: string, now: number): string {
  let hash = 0;
  for (let i = 0; i < requestId.length; i += 1) {
    hash = (hash * 31 + requestId.charCodeAt(i)) >>> 0;
  }
  const date = new Date(now);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}${month}-${String(hash % 10000).padStart(4, '0')}`;
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function json(
  status: number,
  payload: unknown,
  origin: string | null,
): HandlerResponse {
  return {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(origin ? corsHeaders(origin) : {}),
    },
    body: JSON.stringify(payload),
  };
}

function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? value : '';
}

export function createLeadHandler(deps: HandlerDeps) {
  const now = deps.now ?? Date.now;
  const log = deps.log ?? (() => {});
  const allowed = (deps.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ??
    DEFAULT_ORIGINS);

  return async function handle(request: HandlerRequest): Promise<HandlerResponse> {
    /*
      Origin — не защита, а гигиена: в браузере он подставляется самим
      браузером и подделать его со страницы нельзя, но запрос мимо браузера
      может прислать любой заголовок. Настоящие заслоны ниже — ловушка,
      лимит частоты и проверка полей.
    */
    const origin = request.origin && allowed.includes(request.origin) ? request.origin : null;

    if (request.method === 'OPTIONS') {
      return { status: origin ? 204 : 403, headers: origin ? corsHeaders(origin) : {}, body: '' };
    }
    if (request.method !== 'POST') {
      return json(405, { ok: false, message: 'Метод не поддерживается.' }, origin);
    }
    if (!origin) {
      return json(403, { ok: false, message: 'Запрос не с сайта школы.' }, null);
    }

    const raw = request.body ?? '';
    if (Buffer.byteLength(raw, 'utf8') > LEAD_REQUEST_MAX_BYTES) {
      return json(413, { ok: false, message: 'Слишком большой запрос.' }, origin);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, message: 'Не удалось разобрать запрос.' }, origin);
    }

    const input: LeadInput | null = parseLeadInput(parsed);
    if (!input) {
      return json(400, { ok: false, message: 'Не удалось разобрать запрос.' }, origin);
    }

    const body = parsed as Record<string, unknown>;
    const requestId = readString(body, 'requestId').slice(0, 100);
    const at = now();

    /*
      Ловушка для ботов. Отвечаем как при успехе — иначе скрипт по коду
      ответа поймёт, что поле его выдало, и в следующий раз оставит пустым.
      Заявка при этом никуда не уходит.

      Поле называется hpx7 не для красоты: прежнее `company` заполняло
      автозаполнение браузера, и в ловушку попадали живые родители.
    */
    if (input.hpx7.trim() !== '') {
      log('lead: honeypot');
      return json(200, { ok: true, ticket: makeTicket(requestId || String(at), at) }, origin);
    }

    const errors: LeadErrors = validateLead(input, validProgramIds, validAgeIds);
    if (Object.keys(errors).length > 0) {
      return json(400, { ok: false, errors }, origin);
    }

    if (requestId) {
      const known = tickets.get(requestId);
      if (known && at - known.at < IDEMPOTENCY_TTL_MS) {
        log(`lead: duplicate ${known.ticket}`);
        return json(200, { ok: true, ticket: known.ticket, duplicate: true }, origin);
      }
    }

    const phoneKey = `phone:${normalizePhone(input.phone)}`;
    const ipKey = `ip:${request.ip ?? 'unknown'}`;
    if (tooOften(ipKey, IP_LIMIT, at) || tooOften(phoneKey, PHONE_LIMIT, at)) {
      log('lead: rate limited');
      return json(
        429,
        {
          ok: false,
          message:
            'Слишком много заявок подряд. Мы уже видим предыдущую — позвоните, если это срочно.',
        },
        origin,
      );
    }

    const config = readMaxConfig(deps.env);
    if (!config) {
      log('lead: MAX не настроен (нет MAX_BOT_TOKEN или получателя)');
      return json(
        503,
        { ok: false, message: 'Приём заявок временно не работает.' },
        origin,
      );
    }

    const ticket = makeTicket(requestId || String(at), at);
    const text = buildLeadMessage(
      {
        name: input.name,
        phone: input.phone,
        age: input.age,
        program: input.program,
        comment: input.comment,
        consent: input.consent,
      },
      {
        ticket,
        page: readString(body, 'page'),
        source: readString(body, 'source'),
      },
    );

    const deliver = deps.deliver ?? ((message: string) => deliverToMax(config, message));
    const result = await deliver(text);

    if (!result.ok) {
      log(`lead: доставка не удалась (${result.reason}): ${result.detail}`);
      return json(
        502,
        {
          ok: false,
          message: 'Не удалось передать заявку. Позвоните или напишите нам напрямую.',
        },
        origin,
      );
    }

    if (requestId) tickets.set(requestId, { ticket, at });
    // чистим только по факту записи — отдельный таймер в функции не нужен
    for (const [key, value] of tickets) {
      if (at - value.at > IDEMPOTENCY_TTL_MS) tickets.delete(key);
    }

    log(`lead: доставлена ${ticket}`);
    return json(200, { ok: true, ticket }, origin);
  };
}

/** Сброс счётчиков между тестами — в бою не вызывается. */
export function resetHandlerState(): void {
  hits.clear();
  tickets.clear();
}
