/**
 * Манифест страниц для IndexNow: адрес -> хэш того, что видит поисковик.
 *
 * ЗАЧЕМ. Раньше после каждой публикации в IndexNow уходили все адреса из
 * sitemap, даже если изменилась одна статья. Теперь воркфлоу сравнивает
 * манифест новой сборки с манифестом, который уже лежит на живом сайте
 * (scripts/indexnow-diff.mjs), и отправляет только изменённое.
 *
 * ЧТО ВХОДИТ В ХЭШ — только то, что видит поисковик: <title>, meta
 * description, meta robots, canonical, содержимое JSON-LD и видимый текст
 * основного содержимого <main> (шапка и подвал общие для всех страниц и в
 * хэш не входят). Обычные <script> (в том числе RSC-данные self.__next_f), <style>,
 * <noscript>, комментарии, атрибуты и имена чанков выкинуты: идентификатор
 * сборки и хэши чанков меняются от сборки к сборке и не должны считаться
 * правкой страницы.
 *
 * Запуск (после npm run build): node scripts/indexnow-manifest.mjs [out]
 * Читает out/sitemap.xml, пишет out/indexnow-manifest.json. Манифест
 * публичный, и это нормально: в нём только адреса и хэши.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const num = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(num) ? String.fromCodePoint(num) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

const collapse = (text) => text.replace(/\s+/g, ' ').trim();

function attr(tag, name) {
  const match = new RegExp('\\s' + name + '\\s*=\\s*("([^"]*)"|\'([^\']*)\')', 'i').exec(tag);
  return match ? decode(match[2] ?? match[3] ?? '') : null;
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if ((attr(tag, 'name') ?? '').toLowerCase() === name) return collapse(attr(tag, 'content') ?? '');
  }
  return '';
}

/** Строка, из которой считается хэш страницы. Экспортируется для тестов. */
export function normalizeHtml(html) {
  const title = collapse(decode((/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '').replace(/<[^>]+>/g, '')));
  const description = metaContent(html, 'description');
  const robots = metaContent(html, 'robots');
  let canonical = '';
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if ((attr(tag, 'rel') ?? '').toLowerCase() === 'canonical') canonical = attr(tag, 'href') ?? '';
  }

  const jsonLd = [];
  const withoutLd = html.replace(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    (_, body) => {
      jsonLd.push(collapse(body));
      return '';
    },
  );

  // Только основное содержимое (<main>): шапка и подвал одинаковы на всех
  // страницах, и новая ссылка в подвале не должна отправлять весь сайт.
  // Нет <main> — берём body целиком.
  const body =
    /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(withoutLd)?.[1] ??
    /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(withoutLd)?.[1] ??
    '';
  const text = collapse(decode(
    body
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ));

  return JSON.stringify({ title, description, robots, canonical, jsonLd, text });
}

export const hashHtml = (html) => createHash('sha256').update(normalizeHtml(html)).digest('hex');

/** /x/ -> out/x/index.html или out/x.html; / -> out/index.html. */
export function pageFile(outDir, url) {
  const path = decodeURIComponent(new URL(url).pathname);
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  const candidates = trimmed === ''
    ? [join(outDir, 'index.html')]
    : [join(outDir, trimmed, 'index.html'), join(outDir, trimmed + '.html')];
  return candidates.find((file) => existsSync(file)) ?? null;
}

export function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1].trim()));
}

export function buildManifest(outDir) {
  const urls = sitemapUrls(readFileSync(join(outDir, 'sitemap.xml'), 'utf8'));
  if (urls.length === 0) throw new Error('В sitemap.xml нет адресов');
  const pages = {};
  for (const url of urls) {
    const file = pageFile(outDir, url);
    if (!file) throw new Error('Для адреса из sitemap нет HTML в сборке: ' + url);
    pages[url] = hashHtml(readFileSync(file, 'utf8'));
  }
  return { version: 1, pages };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outDir = process.argv[2] || 'out';
  const manifest = buildManifest(outDir);
  writeFileSync(join(outDir, 'indexnow-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log('indexnow-manifest.json: ' + Object.keys(manifest.pages).length + ' страниц');
}
