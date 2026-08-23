/**
 * Адаптер отправки заявок во внешнюю систему.
 *
 * Сейчас CRM не выбрана, поэтому реализован только транспорт на вебхук.
 * Чтобы подключить конкретную CRM — добавьте реализацию ниже и укажите
 * её в getLeadTransport(). Компоненты страницы менять не потребуется.
 *
 * Переменные окружения:
 *   LEAD_WEBHOOK_URL   — адрес приёмника заявок (например, Telegram-бот или CRM)
 *   LEAD_WEBHOOK_TOKEN — токен, уходит в заголовке Authorization
 *   LEAD_TRANSPORT     — 'webhook' | 'mock' (mock разрешён только вне production)
 */

export type Lead = {
  name: string;
  /** Только цифры */
  phone: string;
  program: string;
  comment: string;
  submittedAt: string;
};

export type LeadDeliveryResult =
  | { ok: true; transport: 'webhook' | 'mock' }
  | { ok: false; reason: 'not-configured' | 'transport-error' };

interface LeadTransport {
  name: 'webhook' | 'mock';
  send(lead: Lead): Promise<void>;
}

const webhookTransport: LeadTransport = {
  name: 'webhook',
  async send(lead) {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) throw new Error('LEAD_WEBHOOK_URL is not set');

    const token = process.env.LEAD_WEBHOOK_TOKEN;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }
  },
};

const mockTransport: LeadTransport = {
  name: 'mock',
  async send(lead) {
    // Персональные данные в логи не попадают — только факт заявки.
    console.info(
      `[lead:mock] заявка принята, направление: ${lead.program || 'не выбрано'}`,
    );
  },
};

function getLeadTransport(): LeadTransport | null {
  const isProduction = process.env.NODE_ENV === 'production';
  const configured = process.env.LEAD_TRANSPORT;

  if (configured === 'mock') {
    // В production подделывать успешную доставку нельзя.
    return isProduction ? null : mockTransport;
  }

  if (process.env.LEAD_WEBHOOK_URL) return webhookTransport;

  return isProduction ? null : mockTransport;
}

/**
 * Есть ли куда доставить заявку.
 * Пока канал не настроен, форма на странице не показывается вовсе — запись идёт
 * через мессенджеры, и посетитель не отправляет заявку в никуда.
 *
 * Проверяется только явная настройка, а не запасной mock: иначе форма
 * появлялась бы при разработке и пропадала в production, и мы бы видели
 * локально не то, что уйдёт на боевой сайт.
 */
export function isLeadDeliveryConfigured(): boolean {
  if (process.env.LEAD_WEBHOOK_URL) return true;

  // Разработчик может включить форму вручную, чтобы поработать над ней.
  return (
    process.env.LEAD_TRANSPORT === 'mock' &&
    process.env.NODE_ENV !== 'production'
  );
}

export async function deliverLead(lead: Lead): Promise<LeadDeliveryResult> {
  const transport = getLeadTransport();

  if (!transport) {
    console.error('[lead] транспорт не настроен: заявка не доставлена');
    return { ok: false, reason: 'not-configured' };
  }

  try {
    await transport.send(lead);
    return { ok: true, transport: transport.name };
  } catch (error) {
    // Пишем только тип ошибки, без содержимого заявки.
    console.error(
      '[lead] ошибка доставки:',
      error instanceof Error ? error.message : 'unknown',
    );
    return { ok: false, reason: 'transport-error' };
  }
}
