import assert from 'node:assert/strict';
import { test } from 'node:test';

import { seo } from './seo.ts';

/*
  Инварианты сниппета.

  Проверка появилась 13 сентября 2026 после замера: шесть описаний из десяти
  были длиннее предела — от 163 до 218 символов. Отдельно обидно, что главную
  уже чинили ровно по этой причине, и в файле стоял комментарий с разбором,
  но на остальные страницы правило не распространили. Комментарий такое не
  удерживает — удерживает падающий тест.

  ГРАНИЦА 158. Поиск обрезает описание примерно на 155–160 символах и ставит
  многоточие. Точное число зависит от ширины букв и устройства, поэтому предел
  взят с запасом снизу: описание, которое не влезло, обрывается на полуслове —
  а обрывается всегда самый конец, то есть та часть, которую автор дописывал
  последней и считал важной.

  ЗАЧЕМ НИЖНЯЯ ГРАНИЦА. Слишком короткое описание поиск заменяет своим
  куском текста со страницы, и контроль над сниппетом теряется целиком.
*/
const LIMIT = 158;
const MIN = 70;

test('описание страницы влезает в сниппет целиком', () => {
  for (const [key, page] of Object.entries(seo)) {
    assert.ok(
      page.description.length <= LIMIT,
      `${key}: описание ${page.description.length} символов, предел ${LIMIT} — поиск обрежет конец`,
    );
    assert.ok(
      page.description.length >= MIN,
      `${key}: описание ${page.description.length} символов, это слишком коротко — поиск подставит свой текст`,
    );
  }
});

test('заголовок влезает в сниппет вместе с названием школы', () => {
  /*
    К заголовку внутренней страницы шаблон в layout.tsx дописывает
    « — PRIME SWIM». Предел считается по итоговой строке, а не по той, что
    лежит в файле, — иначе проверка пропустит ровно тот случай, ради которого
    написана.
  */
  const suffix = ' — PRIME SWIM';
  for (const [key, page] of Object.entries(seo)) {
    const full = page.title.endsWith('PRIME SWIM')
      ? page.title
      : page.title + suffix;
    assert.ok(
      full.length <= 65,
      `${key}: заголовок «${full}» — ${full.length} символов, предел 65`,
    );
  }
});

test('у каждой страницы свой заголовок и своё описание', () => {
  const titles = Object.values(seo).map((p) => p.title);
  const descriptions = Object.values(seo).map((p) => p.description);
  assert.equal(
    new Set(titles).size,
    titles.length,
    'два заголовка совпали — страницы будут конкурировать друг с другом в выдаче',
  );
  assert.equal(
    new Set(descriptions).size,
    descriptions.length,
    'два описания совпали',
  );
});

test('путь страницы начинается со слеша и не кончается им', () => {
  /*
    Сборка настроена на trailingSlash, и слеш приклеивается в pageUrl().
    Путь со слешем на конце дал бы в canonical и og:url двойной — адрес
    разошёлся бы сам с собой.
  */
  for (const [key, page] of Object.entries(seo)) {
    assert.ok(page.path.startsWith('/'), `${key}: путь без ведущего слеша`);
    assert.ok(
      page.path === '/' || !page.path.endsWith('/'),
      `${key}: путь со слешем на конце — pageUrl добавит второй`,
    );
  }
});
