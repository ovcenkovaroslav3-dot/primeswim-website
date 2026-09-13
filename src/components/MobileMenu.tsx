"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { navLinks } from "./Header";
import { contacts } from "@/content/contacts";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { buttonClass } from "./ui";

/*
  Выпадающее меню на телефоне.

  Панель выносится порталом в body, и это не украшательство: компонент
  живёт внутри шапки, у шапки backdrop-blur, а backdrop-filter создаёт
  containing block для фиксированных потомков. Из-за этого `fixed inset-0`
  растягивался не на окно, а на высоту шапки — панель схлопывалась
  в полоску в 68 пикселей.
*/
export function MobileMenu() {
  // Флаг «смонтировано» не нужен: меню открывается только по клику,
  // а клик бывает исключительно на клиенте — document к тому моменту есть.
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Фон не должен прокручиваться, пока открыто меню
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    /*
      Перехват клавиатуры: Escape закрывает, Tab не выпускает.

      ЗАПЕРЕТЬ ФОКУС ОБЯЗАНЫ, раз панель объявлена `aria-modal="true"`. Этот
      атрибут велит программе чтения не видеть ничего за панелью — но Tab он
      не трогает: с последнего пункта меню фокус уходил на страницу позади,
      закрытую затемнением. Человек, идущий с клавиатуры, оказывался в
      содержимом, которого не видит, и обратно в меню возвращался только
      пройдя её насквозь.

      Список собирается на каждое нажатие, а не один раз: панель короткая,
      обход дешёвый, а вот запомнить набор нельзя — ссылки в ней меняются
      вместе с разделами.
    */
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const stops = [
        ...panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.offsetParent !== null);
      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-hairline text-ink lg:hidden"
      >
        <span className="sr-only">Открыть меню</span>
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          aria-hidden="true"
          fill="none"
        >
          <path
            d="M1 1h18M1 7h18M1 13h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-90 lg:hidden">
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="absolute inset-0 h-full w-full bg-ink/50"
              />

              <div
                ref={panelRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Меню сайта"
                className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  {/*
                    Знак, а не слово «Меню». Открытая панель закрывает шапку
                    целиком, и на весь экран не оставалось ни одного упоминания
                    школы — а это единственный экран, который человек на
                    телефоне видит перед выбором раздела. Название панели при
                    этом не потеряно: оно и раньше жило в aria-label="Меню
                    сайта" у самого диалога, слово на экране его лишь дублировало.
                  */}
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Logo />
                    <span className="sr-only"> — на главную страницу</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-hairline text-ink"
                  >
                    <span className="sr-only">Закрыть меню</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      fill="none"
                    >
                      <path
                        d="M2 2l12 12M14 2L2 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <nav aria-label="Меню в мобильной версии">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-12 items-center rounded-xl px-3 text-lg font-medium text-ink transition-colors hover:bg-surface-alt hover:text-brand-600"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-6">
                  <Link
                    href="#booking"
                    onClick={() => setOpen(false)}
                    data-goal="cta_booking"
                    className={buttonClass("primary", "lg", "w-full")}
                  >
                    Записаться на пробное занятие
                  </Link>
                  <a
                    href={contacts.phone.href}
                    data-goal="click_phone"
                    className="text-center text-lg font-light text-ink"
                  >
                    {contacts.phone.display}
                  </a>
                  <SocialLinks align="center" />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
