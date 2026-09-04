@AGENTS.md

# Браузер: только Playwright

Любая визуальная проверка сайта — снимок, проверка вёрстки, поведения, ленивых
картинок, reveal-анимаций — делается через Playwright: `node scripts/shot.mjs`
или собственный скрипт на `playwright` из devDependencies.

Не использовать для этого:

- **панель браузера** (`mcp__Claude_Browser__*`) — не композитит кадры:
  IntersectionObserver молчит, `loading="lazy"` не грузится, прокрутка не
  работает, `getComputedStyle(...).opacity` врёт. Годится только для текста,
  разметки и сети;
- **`browse.exe` из gstack** — снимает страницу без настоящих scroll-событий,
  секции с `data-reveal` выходят пустыми;
- **самописные обвязки на CDP** — заменены `scripts/shot.mjs`.

## scripts/shot.mjs

```bash
node scripts/shot.mjs <url> [файл.png] [--mobile] [--width=N] [--height=N] [--viewport] [--native]
```

Полностраничный снимок собирается из кадров вьюпорта и сшивается по фактическому
`scrollY` — нативный `fullPage: true` в Chrome на длинных страницах склеивает
кадр неверно (внизу оказывается копия шапки вместо подвала); `--native` оставлен
для сравнения. Скрипт заодно печатает счётчик проявленных reveal-блоков, число
битых картинок и ошибки консоли.

Особенности этой машины и сайта, уже учтённые в скрипте:

- сборка Chromium из поставки Playwright не стартует («side-by-side
  configuration is incorrect») — скрипт откатывается на системный Chrome;
- у сайта `scroll-behavior: smooth`, поэтому `window.scrollY` нельзя читать в
  том же `evaluate`, что и `scrollTo`, — вернётся позиция до прокрутки;
- Яндекс Метрика держит соединение, `waitUntil: 'networkidle'` не дожидается
  никогда — используется `'load'`.
