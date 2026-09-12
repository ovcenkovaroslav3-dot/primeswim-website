'use client';

import { useEffect, useRef } from 'react';

/**
 * Наклон талисмана вслед за курсором.
 *
 * Компонент ничего не рисует: он находит ближайшую сцену маскота и пишет в
 * неё две переменные, --mascot-px и --mascot-py, в диапазоне от -1 до 1. Всю
 * геометрию из них собирает CSS — так поворот остаётся одним composite-слоем,
 * а JavaScript не трогает раскладку.
 *
 * Слушатель висит на самой сцене, а не на окне: за пределами первого экрана
 * считать нечего, а лишние события на скролле — это работа впустую.
 *
 * Не включается, когда курсора нет (телефон, планшет) или когда человек
 * попросил меньше движения. Оба условия проверяются здесь же, а не только в
 * CSS: смысла держать обработчик, результат которого никто не применит, нет.
 */
export function MascotPointer() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = anchor.current?.closest<HTMLElement>('.mascot-stage');
    if (!stage) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      stage.style.setProperty('--mascot-px', px.toFixed(3));
      stage.style.setProperty('--mascot-py', py.toFixed(3));
    };

    /* Событий от мыши приходит больше, чем кадров, — держим один на кадр. */
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      px = ((event.clientX - box.left) / box.width) * 2 - 1;
      py = ((event.clientY - box.top) / box.height) * 2 - 1;
      schedule();
    };

    /* Уводя курсор, возвращаем фигуру в покой, а не бросаем её в наклоне. */
    const onLeave = () => {
      px = 0;
      py = 0;
      schedule();
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);

    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      stage.style.removeProperty('--mascot-px');
      stage.style.removeProperty('--mascot-py');
    };
  }, []);

  return <span ref={anchor} aria-hidden="true" className="hidden" />;
}
