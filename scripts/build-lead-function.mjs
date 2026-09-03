/**
 * Сборка функции приёма заявок в один файл для облака.
 *
 * Зачем сборка вообще. Обработчик написан на TypeScript и берёт правила
 * проверки и списки направлений прямо из кода сайта — это единственный
 * способ не заводить вторую копию правил, которая однажды разойдётся с
 * формой. Ни один облачный runtime такое сам не соберёт: TypeScript он не
 * понимает, а импорты из ../../src за пределами папки функции не увидит.
 *
 * На выходе — CommonJS: entrypoint в Yandex Cloud Functions указывается как
 * `index.handler`, и это самый предсказуемый формат для нодовых runtime.
 * Внешних зависимостей у функции нет, поэтому node_modules в архив не идёт.
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
  entryPoints: [path.join(root, 'server', 'lead', 'index.ts')],
  outfile: path.join(outDir, 'index.js'),
  bundle: true,
  platform: 'node',
  // Yandex Cloud Functions предлагает nodejs18/20/22 — берём нижнюю из
  // тех, что точно есть, чтобы сборка не зависела от выбора рантайма.
  target: 'node18',
  format: 'cjs',
  // tsconfig нужен ради строгости; путей @/ в коде функции нет намеренно —
  // импорты относительные, чтобы тесты запускались обычным `node --test`.
  tsconfig: path.join(root, 'tsconfig.json'),
  legalComments: 'none',
  metafile: true,
});

// package.json в архиве нужен облаку, чтобы понять формат модуля.
await writeFile(
  path.join(outDir, 'package.json'),
  `${JSON.stringify({ name: 'primeswim-lead', private: true, main: 'index.js' }, null, 2)}\n`,
);

const bytes = Object.values(result.metafile.outputs)[0]?.bytes ?? 0;
console.log(`Собрано: server/lead/dist/index.js (${(bytes / 1024).toFixed(1)} КБ)`);
console.log('Загрузить в облако: содержимое папки dist, entrypoint index.handler');

// zip делаем только если в системе есть чем: на Windows это встроенный
// Compress-Archive, в CI — обычный zip. Без него архив соберёт сам человек.
const zipPath = path.join(outDir, '..', 'lead-function.zip');
const isWindows = process.platform === 'win32';
const command = isWindows
  ? ['powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipPath}' -Force`]]
  : ['zip', ['-j', '-r', zipPath, outDir]];

execFile(command[0], command[1], (error) => {
  if (error) {
    console.log('Архив не собран автоматически — упакуйте папку dist вручную.');
    return;
  }
  console.log(`Архив: ${path.relative(root, zipPath)}`);
});

