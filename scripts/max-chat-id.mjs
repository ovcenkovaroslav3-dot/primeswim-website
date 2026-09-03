/**
 * Узнать, куда бот MAX должен слать заявки.
 *
 * Бот не может написать первым — как и в Telegram, разговор начинает человек.
 * Поэтому порядок такой: сначала вы пишете боту (или добавляете его в чат и
 * пишете туда что угодно), потом запускаете этот скрипт — он забирает
 * непрочитанные события и показывает идентификаторы отправителей и чатов.
 *
 * Запуск:
 *   MAX_BOT_TOKEN=... node scripts/max-chat-id.mjs
 * или на Windows PowerShell:
 *   $env:MAX_BOT_TOKEN='...'; node scripts/max-chat-id.mjs
 *
 * Токен нигде не сохраняется: скрипт читает его из переменной окружения и
 * не пишет ни в один файл. В историю команд он всё-таки попадёт — после
 * настройки очистите её или задайте переменную во временной сессии.
 *
 * Long polling используется здесь намеренно и только здесь: это разовая
 * настроечная задача. Постоянная подписка боту не нужна — заявки идут в одну
 * сторону, от сайта в MAX, и события бот не слушает.
 */

const token = process.env.MAX_BOT_TOKEN?.trim();
const base = process.env.MAX_API_BASE?.trim() || 'https://platform-api2.max.ru';

if (!token) {
  console.error('Нет MAX_BOT_TOKEN. Токен выдаёт @MasterBot в MAX.');
  process.exit(1);
}

async function call(path) {
  const response = await fetch(new URL(path, base), {
    headers: { Authorization: token },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(`MAX ответил ${response.status}:`, JSON.stringify(data));
    process.exit(1);
  }
  return data;
}

const me = await call('/me');
console.log(`Бот: ${me.name ?? me.username ?? me.user_id} (user_id ${me.user_id})`);

const updates = await call('/updates?limit=100&timeout=1');
const list = updates.updates ?? [];

if (list.length === 0) {
  console.log('');
  console.log('Событий нет. Напишите боту в MAX (или в чат, куда он добавлен)');
  console.log('и запустите скрипт ещё раз — событие придёт в течение минуты.');
  console.log('');
  console.log('Если подписка на webhook уже настроена, long polling молчит:');
  console.log('её нужно удалить (DELETE /subscriptions) или взять chat_id из webhook.');
  process.exit(0);
}

const seen = new Map();
for (const update of list) {
  const chatId = update.message?.recipient?.chat_id ?? update.chat_id;
  const user = update.message?.sender ?? update.user;
  const key = `${chatId ?? '-'}|${user?.user_id ?? '-'}`;
  if (!seen.has(key)) seen.set(key, { chatId, user, type: update.update_type });
}

console.log('');
console.log('Найдено:');
for (const { chatId, user, type } of seen.values()) {
  console.log(`  событие: ${type}`);
  if (chatId !== undefined && chatId !== null) console.log(`    MAX_CHAT_ID=${chatId}`);
  if (user?.user_id) console.log(`    MAX_USER_ID=${user.user_id}  (${user.name ?? 'без имени'})`);
}
console.log('');
console.log('MAX_CHAT_ID предпочтительнее: отдельный чат переживает смену телефона');
console.log('и в него можно добавить второго человека, не трогая настройки функции.');
