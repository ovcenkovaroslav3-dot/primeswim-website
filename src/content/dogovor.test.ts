import { test } from 'node:test';
import assert from 'node:assert/strict';

import { dogovorValidUntilISO, dogovorValidUntil } from './dogovor.ts';

/*
  Договор не должен протухнуть на виду.

  Он опубликован по адресу /dogovor/ и действует по конкретную дату — п. 7.1.
  Дата эта наступит, и сама о себе не напомнит: страница продолжит показывать
  документ, срок которого вышел. Для родителя, который пришёл почитать условия
  перед записью, это худший из возможных сигналов — не «условий нет», а «за
  сайтом никто не следит».

  Поэтому напоминание живёт не в календаре и не в чьей-то памяти, а здесь:
  за два месяца до конца срока тест начинает падать на каждой сборке и пишет,
  что делать. Два месяца — чтобы успеть подписать новую редакцию без спешки,
  а не чтобы узнать об этом первого июня.

  Тест намеренно один и намеренно громкий. Мягкое предупреждение в консоль
  пролистывают.
*/

/** За сколько дней до конца срока начинать беспокоить. */
const WARN_DAYS = 60;

const DAY = 24 * 60 * 60 * 1000;

test('договор действует ещё не меньше двух месяцев', () => {
  const until = new Date(`${dogovorValidUntilISO}T23:59:59+03:00`);
  assert.ok(
    !Number.isNaN(until.getTime()),
    `dogovorValidUntilISO = «${dogovorValidUntilISO}» — не дата. Нужен формат ГГГГ-ММ-ДД.`,
  );

  const daysLeft = Math.floor((until.getTime() - Date.now()) / DAY);

  assert.ok(
    daysLeft > WARN_DAYS,
    daysLeft < 0
      ? `Договор на сайте просрочен: срок вышел ${dogovorValidUntil}, ${-daysLeft} дн. назад. ` +
          'Страница /dogovor/ показывает недействующий документ. Подпишите новую ' +
          'редакцию и поменяйте dogovorValidUntilISO в src/content/dogovor.ts.'
      : `До конца действия договора ${daysLeft} дн. (${dogovorValidUntil}). ` +
          'Пора готовить новую редакцию: подписать и поменять dogovorValidUntilISO ' +
          'в src/content/dogovor.ts. Этот тест будет падать, пока дата не обновится.',
  );
});

test('дата словами собрана из той же даты, что и машинная', () => {
  const [year, , day] = dogovorValidUntilISO.split('-').map(Number);
  assert.ok(
    dogovorValidUntil.startsWith(`${day} `) &&
      dogovorValidUntil.endsWith(`${year} года`),
    `«${dogovorValidUntil}» не сходится с ${dogovorValidUntilISO} — проверьте formatRu.`,
  );
});
