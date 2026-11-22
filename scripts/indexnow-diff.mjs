/**
 * Какие адреса отправлять в IndexNow.
 *
 * Чистая функция без обращений к сети и диску: берёт манифест, который лежит
 * на живом сайте до публикации (старый), и манифест новой сборки. Манифест —
 * это { version: 1, pages: { "<абсолютный url>": "<hash>" } }, его строит
 * scripts/indexnow-manifest.mjs.
 *
 * Результат:
 *   - массив адресов: новые, с изменённым хэшем и удалённые (IndexNow принимает
 *     и их, поисковик увидит 404). Пустой массив означает «изменений нет»;
 *   - null — старого манифеста нет или он битый, различить нельзя, и вызывающий
 *     отправляет всё (так же, как раньше).
 *
 * CLI (для воркфлоу): node scripts/indexnow-diff.mjs old.json new.json
 * Печатает адреса по одному в строке; если надо отправить всё — единственную
 * строку ALL; если изменений нет — ничего. Код выхода 0, кроме случая, когда
 * не читается новый манифест.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

function validPages(manifest) {
  if (!manifest || typeof manifest !== 'object' || manifest.version !== 1) return null;
  const pages = manifest.pages;
  if (!pages || typeof pages !== 'object' || Array.isArray(pages)) return null;
  for (const hash of Object.values(pages)) if (typeof hash !== 'string' || hash === '') return null;
  return pages;
}

export function changedUrls(oldManifest, newManifest) {
  const before = validPages(oldManifest);
  const after = validPages(newManifest);
  if (!before || !after) return null;
  const changed = [];
  for (const [url, hash] of Object.entries(after)) {
    if (before[url] !== hash) changed.push(url);
  }
  for (const url of Object.keys(before)) {
    if (!(url in after)) changed.push(url);
  }
  return changed;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [oldPath, newPath] = process.argv.slice(2);
  const newManifest = readJson(newPath);
  if (!validPages(newManifest)) {
    console.error('Новый манифест не читается: ' + newPath);
    process.exit(1);
  }
  const result = changedUrls(readJson(oldPath), newManifest);
  if (result === null) console.log('ALL');
  else for (const url of result) console.log(url);
}
