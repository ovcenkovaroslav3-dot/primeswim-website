'use client';

import { useEffect, useState } from 'react';

import { contacts } from '@/content/contacts';

/*
  Липкая кнопка записи на телефоне.

  Появляется, когда первый экран уже прокручен, и прячется на финальном
  экране и в блоке записи — там своя кнопка, и дублировать её поверх
  контента незачем.

  Панель учитывает безопасную зону снизу, иначе на телефонах с жестовой
  навигацией кнопка попадает под системную полосу.
*/
export function MobileCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('section');
    // финальный экран: там свои кнопки записи, дублировать поверх незачем
    const quiet = ['#booking'].map((s) => document.querySelector(s));

    let pastHero = false;
    let inQuiet = false;
    const apply = () => setShown(pastHero && !inQuiet);

    const heroIo = new IntersectionObserver(
      ([e]) => {
        pastHero = !e.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    if (hero) heroIo.observe(hero);

    // держим набор видимых тихих зон: наблюдатель присылает только изменения,
    // поэтому судить по одному вызову о всех зонах нельзя
    const visibleQuiet = new Set<Element>();
    const quietIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visibleQuiet.add(e.target);
          else visibleQuiet.delete(e.target);
        });
        inQuiet = visibleQuiet.size > 0;
        apply();
      },
      { threshold: 0 },
    );
    quiet.forEach((el) => el && quietIo.observe(el));

    return () => {
      heroIo.disconnect();
      quietIo.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/92 px-4 pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      // пока панель спрятана, её содержимое не должно попадать в обход с клавиатуры
      inert={!shown || undefined}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <a
          href="#booking"
          data-goal="cta_booking"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[10px] bg-lime-400 px-5 text-sm font-semibold text-abyss-950"
        >
          Записаться
        </a>
        <a
          href={contacts.phone.href}
          data-goal="click_phone"
          aria-label={`Позвонить: ${contacts.phone.display}`}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] border border-hairline text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M6.2 3.5 8 7l-1.6 1.4a11 11 0 0 0 5.2 5.2L13 12l3.5 1.8v3a1 1 0 0 1-1.1 1A14.4 14.4 0 0 1 2.2 4.6a1 1 0 0 1 1-1.1h3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
