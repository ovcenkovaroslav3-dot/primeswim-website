import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
  Файлы Прайми существуют на диске.

  Талисман — единственная картинка сайта, которая не проходит через Picture и
  не описана в content/media.ts: у неё два размера на два формата плюс маска,
  и в MediaItem с одним `src` это не укладывается (разбор — в media.ts).
  Значит, и тест про AVIF рядом её не сторожит.

  А сломаться тут есть чему, причём тихо. Пропал один из размеров — <picture>
  на ненайденный файл к запасному варианту не откатится, выйдет дыра. Пропала
  маска блика — mask-image считается пустым, и светлый градиент ложится
  ПРЯМОУГОЛЬНИКОМ поверх первого экрана: не «эффекта нет», а явный брак.

  Поэтому список берётся из самого компонента разбором: он остаётся
  единственным местом, где перечислены файлы талисмана, а тест лишь проверяет,
  что каждое имя оттуда лежит на диске. Переименовали файл и забыли
  пересобрать — тест падает раньше сборки.
*/
const source = readFileSync(
  join(process.cwd(), 'src/components/MascotOrca.tsx'),
  'utf8',
);

const names = [...source.matchAll(/src\('([^']+)'\)/g)].map((m) => m[1]);

test('MascotOrca: компонент вообще ссылается на файлы', () => {
  assert.ok(
    names.length >= 5,
    `в MascotOrca.tsx найдено ${names.length} имён файлов — разбор сломался, тест ничего не проверяет`,
  );
});

test('MascotOrca: каждый файл лежит в public/media/mascot', () => {
  const missing = names.filter(
    (name) => !existsSync(join(process.cwd(), 'public/media/mascot', name)),
  );

  assert.deepEqual(
    missing,
    [],
    `нет файлов: ${missing.join(', ')} — пересоберите: node scripts/make-mascot-web.mjs`,
  );
});
