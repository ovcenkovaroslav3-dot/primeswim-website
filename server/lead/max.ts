/**
 * Доставка заявки в MAX через Bot API.
 *
 * Проверено по официальному клиенту MAX (max-messenger/max-bot-api-client-ts):
 *
 * - база — `https://platform-api2.max.ru`; прежний `platform-api.max.ru`
 *   помечен там как deprecated. Домен уже менялся один раз, поэтому он
 *   вынесен в переменную окружения, а не зашит в код;
 * - токен идёт заголовком `Authorization` целиком, без префикса `Bearer`;
 * - получатель передаётся в query (`chat_id` или `user_id`), текст — в теле;
 * - `format` не передаётся: сообщение уходит простым текстом. Это осознанно,
 *   см. комментарий в lib/lead-message.ts.
 *
 * Токен бота живёт только здесь, в переменных окружения функции. В репозиторий,
 * в клиентский бандл и в любую переменную `NEXT_PUBLIC_*` он не попадает.
 */

export type MaxConfig = {
  token: string;
  /** Чат, куда падают заявки. Указывается либо он, либо userId. */
  chatId?: string;
  /** Личка сотрудника — запасной вариант, если отдельный чат не заводили. */
  userId?: string;
  baseUrl: string;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: 'config' | 'rejected' | 'unavailable'; detail: string };

/** Сколько ждём MAX целиком, со всеми повторами. */
const TOTAL_TIMEOUT_MS = 9_000;
/** Сколько ждём один запрос. */
const ATTEMPT_TIMEOUT_MS = 4_000;
const ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 400;

export function readMaxConfig(env: Record<string, string | undefined>): MaxConfig | null {
  const token = env.MAX_BOT_TOKEN?.trim();
  if (!token) return null;

  const chatId = env.MAX_CHAT_ID?.trim();
  const userId = env.MAX_USER_ID?.trim();
  if (!chatId && !userId) return null;

  return {
    token,
    chatId: chatId || undefined,
    userId: userId || undefined,
    baseUrl: env.MAX_API_BASE?.trim() || 'https://platform-api2.max.ru',
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Отправляет текст в MAX. Повторяет только то, что имеет смысл повторять:
 * сетевую ошибку, таймаут и 5xx. На 4xx повтор бессмысленен — так отвечают
 * на неверный токен или несуществующий чат, и три одинаковых запроса лишь
 * задержат ответ родителю.
 */
export async function deliverToMax(
  config: MaxConfig,
  text: string,
): Promise<DeliveryResult> {
  const url = new URL('/messages', config.baseUrl);
  if (config.chatId) url.searchParams.set('chat_id', config.chatId);
  else if (config.userId) url.searchParams.set('user_id', config.userId);
  url.searchParams.set('disable_link_preview', 'true');

  const deadline = Date.now() + TOTAL_TIMEOUT_MS;
  let lastDetail = 'нет ответа';

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (Date.now() >= deadline) break;

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      Math.min(ATTEMPT_TIMEOUT_MS, deadline - Date.now()),
    );

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: config.token,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ text, notify: true }),
        signal: controller.signal,
      });

      if (response.ok) return { ok: true };

      // Тело ответа читаем ради кода ошибки MAX — он попадёт в лог функции,
      // и без него причину отказа не понять. Персональных данных в нём нет.
      const detail = `HTTP ${response.status} ${(await response.text()).slice(0, 300)}`;
      if (response.status < 500) {
        return { ok: false, reason: 'rejected', detail };
      }
      lastDetail = detail;
    } catch (error) {
      lastDetail = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timer);
    }

    const delay = RETRY_BASE_DELAY_MS * 2 ** attempt;
    if (Date.now() + delay < deadline) await sleep(delay);
  }

  return { ok: false, reason: 'unavailable', detail: lastDetail };
}
