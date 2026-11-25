'use client';

import { useEffect } from 'react';

/*
  Глубокие ссылки на ответы FAQ. id стоит на абзаце внутри закрытого
  <details>, и браузер сам такой блок не раскрывает: ссылка вроде
  #faq-missed вела в никуда. Компонент ничего не рисует и разметку не
  меняет — только после гидрации раскрывает нужный <details> и прокручивает
  к ответу, при загрузке страницы и при каждой смене хэша.
*/
function openTarget(): void {
  const raw = window.location.hash.slice(1);
  if (!raw) return;

  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    // оставляем как есть
  }

  const target = document.getElementById(id);
  const details = target?.closest('details');
  if (!target || !details) return;

  // ответ нужен сразу, а не через 320 мс анимации: иначе прокрутка промахнётся
  details.setAttribute('data-instant', '');
  details.open = true;
  target.scrollIntoView({ block: 'center' });
  details.removeAttribute('data-instant');
}

export function OpenDetailsOnHash() {
  useEffect(() => {
    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, []);

  return null;
}
