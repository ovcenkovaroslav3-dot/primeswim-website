'use client';

import { useEffect } from 'react';

/**
 * Один наблюдатель на весь документ.
 *
 * Секции остаются серверными компонентами: чтобы элемент проявился, ему
 * достаточно класса `reveal` или `reveal-mask` — клиентская обёртка вокруг
 * каждой секции не нужна, и лишний JavaScript в браузер не уезжает.
 *
 * Элементы наблюдаются один раз: после появления наблюдение снимается,
 * поэтому при обратной прокрутке контент не мигает.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-mask',
    );

    // при отключённой анимации просто показываем всё сразу
    if (reduced) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      },
      // запускаем чуть раньше нижней кромки экрана, чтобы движение
      // успело завершиться к моменту, когда блок окажется в поле зрения
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    targets.forEach((el) => {
      // то, что уже видно при загрузке, показываем без задержки на наблюдение
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-in');
      else io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
