/**
 * Сборка приёмника заявок в один файл.
 *
 * Зачем сборка вообще. Приёмник написан на TypeScript и берёт правила
 * проверки и списки направлений прямо из кода сайта — это единственный
 * способ не заводить вторую копию правил, которая однажды разойдётся с
 * формой. Ни один хостинг такое сам не соберёт: TypeScript он не понимает,
 * а импорты из ../../src за пределами папки приёмника не увидит.
 *
 * Два входа, одна логика:
 *
 *   server.js — обычный HTTP-сервер: Timeweb Cloud Apps, VPS, docker.
 *               Основной вариант.
 *   index.js  — обработчик для бессерверных площадок вроде Yandex Cloud
 *               Functions. Запасной путь: если однажды окажется, что держать
 *               процесс ради нескольких заявок в день дорого, переезд будет
 *               стоить смены команды запуска, а не переписывания.
 *
 * На выходе — CommonJS, без внешних зависимостей: node_modules в сборку
 * не идёт вовсе.
 *
 * Запуск: npm run build:lead
 */

import { build } from 'esbuild';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'server', 'lead', 'dist');

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const result = await build({
  entryPoints: {
    server: path.join(root, 'server', 'lead', 'http.ts'),
    index: path.join(root, 'server', 'lead', 'index.ts'),
  },
  outdir: outDir,
  bundle: true,
  platform: 'node',
  // Нижняя из версий, которые предлагают площадки, — чтобы сборка не зависела
  // от того, какой рантайм выбран при создании приложения.
  target: 'node18',
  format: 'cjs',
  // tsconfig нужен ради строгости; путей @/ в коде приёмника нет намеренно —
  // импорты относительные, чтобы тесты запускались обычным `node --test`.
  tsconfig: path.join(root, 'tsconfig.json'),
  legalComments: 'none',
  metafile: true,
});

/*
  package.json рядом со сборкой обязателен. В корне репозитория стоит
  "type": "module", и без этого файла Node прочитал бы dist/*.js как ESM —
  а собрано в CommonJS. Ближайший package.json без "type" уже означал бы
  CommonJS, но лучше сказать это прямо, чем полагаться на умолчание.
*/
const manifest = {
  name: 'primeswim-lead',
  private: true,
  type: 'commonjs',
  main: 'server.js',
};
await writeFile(path.join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);

for (const [file, meta] of Object.entries(result.metafile.outputs)) {
  const name = path.relative(root, file).split(path.sep).join('/');
  console.log(`Собрано: ${name} (${(meta.bytes / 1024).toFixed(1)} КБ)`);
}

console.log('');
console.log('Обычный хостинг:       node server/lead/dist/server.js');
console.log('Бессерверная площадка: архив lead-function.zip, entrypoint index.handler');

// zip нужен только бессерверному варианту. Собираем, если в системе есть чем:
// на Windows это встроенный Compress-Archive, в CI — обычный zip.
const zipPath = path.join(outDir, '..', 'lead-function.zip');
const command =
  process.platform === 'win32'
    ? ['powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPath}' -Force`]]
    : ['zip', ['-j', '-r', zipPath, outDir]];

execFile(command[0], command[1], (error) => {
  if (error) {
    console.log('Архив не собран автоматически — упакуйте папку dist вручную.');
    return;
  }
  console.log(`Архив: ${path.relative(root, zipPath).split(path.sep).join('/')}`);
});
