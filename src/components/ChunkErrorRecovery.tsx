'use client';

import { useEffect } from 'react';

/*
  Восстановление после устаревшего бандла на момент деплоя.

  Файлы, на которые ссылается уже загруженный в браузере JS (чанки,
  RSC-пейлоады страниц), при следующей публикации сайта перезаписываются
  под новыми именами — старые исчезают с сервера. Если вкладка была открыта
  до деплоя, переход по любой ссылке на сайте начинает молча ничего не
  делать: роутер Next.js пытается подгрузить файл, которого больше нет,
  запрос падает — и страница остаётся на месте, будто ссылка не работает.
  До сих пор это лечилось только вручную: обновить страницу, получить
  свежий бандл, и все ссылки снова рабочие — до следующего деплоя.

  Здесь то же самое делается само: при ошибке загрузки чанка или RSC
  вкладка перезагружается сама. Ограничение в 10 секунд между попытками —
  чтобы при настоящей недоступности сервера не уйти в цикл перезагрузок.
*/
function isStaleBuildFailure(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === 'string'
        ? reason
        : '';

  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|failed to fetch|NetworkError when attempting to fetch resource/i.test(
    message,
  );
}

export function ChunkErrorRecovery() {
  useEffect(() => {
    const reload = () => {
      const key = 'primeswim:stale-build-reload-at';
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last < 10_000) return;
      sessionStorage.setItem(key, String(Date.now()));
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => {
      if (isStaleBuildFailure(e.error ?? e.message)) reload();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isStaleBuildFailure(e.reason)) reload();
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
