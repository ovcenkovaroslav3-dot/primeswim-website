# PRIME SWIM — дизайн-ориентир

Источник: [Aqua Voice на styles.refero.design](https://styles.refero.design/style/6734fe92-6a02-45d5-8d72-0c55b37ace82) · сайт [withaqua.com](https://withaqua.com)

## ВАЖНО: что мы берём, а что нет

Референс выбран за **структуру и ритм**, не за цвет.

**Берём:** воздух между секциями, сверхлёгкое начертание заголовков, почти-белый холст, один-единственный насыщенный акцент на экран, тонкие hairline-границы, тени в доли процента, узкую колонку текста, плоские матовые поверхности.

**НЕ берём палитру.** Цвета PRIME SWIM заданы логотипом и живут в `src/app/globals.css` (`@theme`). Голубой `#67beff` и `#4288ff` из таблиц ниже — цвета Aqua Voice, **применять их запрещено**.

### Таблица подстановки цветов

| Роль у Aqua Voice | Цвет Aqua Voice | Чем заменяем у нас | Токен |
|---|---|---|---|
| Filled CTA | `#67beff` | лайм | `--color-lime-brand` `#c7fe03` |
| Ссылки, ghost-обводка, focus ring | `#4288ff` | фиолетовый | `--color-brand-600` `#4f017b` |
| Инвертированная тёмная полоса | `#171719` | фиолетовый глубокий | `--color-brand-900` `#24003a` |
| Основной текст | `#292c3d` | | `--color-ink` `#191524` |
| Текст body | `#3e4150` | | `--color-ink-soft` `#4d4757` |
| Приглушённый текст | `#686a76` | | `--color-ink-muted` `#6f6980` |
| Холст страницы | `#fafbfc` | | `--color-surface` `#ffffff` |
| Фон секции-полосы | `#f3f7fa` | | `--color-surface-alt` `#f7f5fa` |
| Hairline | `#e5e8ec` | | `--color-hairline` `#e6e2ee` |
| Водные оттенки | — | уже есть в проекте | `--color-water-100/300/500/700` |

### Шрифты

У Aqua Voice — PP Neue Montreal weight 200. У нас уже подключены **Unbounded** (display) и **Inter** (sans), менять их не нужно.

Ключевой приём переносится так: Unbounded сейчас стоит жирным в заголовках — именно это создаёт крикливость. Смысл референса в том, что **авторитет берётся сдержанностью, а не весом**. Для Inter это означает weight 200–300 в крупных заголовках вместо 700.

### Главное правило переноса

Лайм — как `#67beff` у Aqua Voice: **один заливной акцент на экран, и только на главное действие**. Сейчас лайм на сайте повсюду, поэтому и читается дёшево. Дефицит делает цвет дорогим.

---

# Оригинал: Aqua Voice — Style Reference

> Ниже — исходный документ refero без правок. Цвета в нём читать через таблицу подстановки выше.

**Vibe:** Whisper on paper — ultra-light type resting on near-white with a single blue drop of color

**Theme:** light

Aqua speaks in a typographic whisper on near-white surfaces. PP Neue Montreal at weight 200 for headlines is the signature — text that feels etched rather than printed, gaining authority through restraint instead of volume. The palette is 99% achromatic: a paper-white canvas, a tight ladder of cool grays for text, and a single vivid sky blue that appears only as functional punctuation for the download CTA, link accents, and the tiny 'now live' dot. Surfaces are flat with hairline borders and almost imperceptible shadows; the only elevation is a millimeter of rgba(0,0,0,0.02) depth. Components are compact and utilitarian — small radii, tight padding, ghost controls — but the page breathes with generous vertical rhythm between sections. Layout centers text in wide single-column blocks rather than fighting for grid space, and a large product screenshot in a soft 20px card anchors the second screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky Signal | `#67beff` | `--color-sky-signal` | Blue action color for filled buttons, selected navigation states, and focused conversion moments |
| Electric Iris | `#4288ff` | `--color-electric-iris` | Outlined/ghost action border, inline link accent, focus rings — cooler and slightly deeper than Sky Signal |
| Paper White | `#fafbfc` | `--color-paper-white` | Page canvas, primary surface, inverted text on dark bars |
| Mist | `#f3f7fa` | `--color-mist` | Subtle band backgrounds, section alternation, elevated surface tint |
| Fog | `#f2f6fa` | `--color-fog` | Card surface, soft fill behind product screenshots |
| Linen | `#e5e8ec` | `--color-linen` | Hairline dividers, faint borders, disabled surfaces |
| Ash | `#efefef` | `--color-ash` | Ghost button background, subtle hover fill |
| Inkstone | `#292c3d` | `--color-inkstone` | Primary text, strongest contrast — carries the 200-weight headlines |
| Slate | `#3e4150` | `--color-slate` | Body text, secondary headings, dense body copy |
| Pewter | `#686a76` | `--color-pewter` | Muted body text, helper text, inactive nav |
| Graphite | `#7d7e7e` | `--color-graphite` | Tertiary text, footer links, faint labels |
| Silver | `#c2c3c8` | `--color-silver` | Placeholder text, very faint borders, decorative strokes |
| Obsidian | `#171719` | `--color-obsidian` | Top announcement bar background, dark surface, inverted text fill |
| Midnight | `#1e1e20` | `--color-midnight` | Dark card surface, secondary dark fill |

## Tokens — Typography

### PP Neue Montreal — Primary typeface
- **Substitute:** Inter (200, 400) or Söhne Buch
- **Weights:** 200, 400
- **Sizes:** 13px, 14px, 15px, 16px, 17px, 20px, 24px, 40px, 56px, 60px, 72px
- **Line height:** 1.00, 1.10, 1.20, 1.40, 1.50, 1.60
- **Letter spacing:** normal across all sizes — no tracking adjustment
- **Role:** weight 200 for display and headlines (anti-convention; most sites use 600-700, this whisper-weight gains authority through restraint), weight 400 for body and subheadings.

### PP Neue Montreal — Medium cut
- **Substitute:** Inter Medium (500)
- **Weights:** 400, 500
- **Role:** UI controls, buttons, nav links, and small labels where the Book weight feels too quiet to anchor interaction

### Inter — System-level fallback and small UI text
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 11px, 12px, 20px
- **Role:** nav micro-labels, metadata, the smallest body sizes

### Geist Mono — Monospaced
- **Substitute:** IBM Plex Mono, JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 14px, 18px
- **Role:** keyboard hints, code, technical micro-labels

### Type Scale

| Role | Size | Line Height | Token |
|------|------|-------------|-------|
| caption | 11px | 1.4 | `--text-caption` |
| body | 16px | 1.5 | `--text-body` |
| subheading | 20px | 1.4 | `--text-subheading` |
| heading-sm | 24px | 1.2 | `--text-heading-sm` |
| heading | 40px | 1.1 | `--text-heading` |
| heading-lg | 56px | 1.1 | `--text-heading-lg` |
| display | 72px | 1 | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

Spacing scale: 4, 6, 8, 10, 12, 15, 16, 20, 24, 28, 30, 32, 40, 48, 80, 124 (px)

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12-20px |
| icons | 4px |
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |
| decorative | 30-70px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 10px

## Components

### Announcement Bar
Full-bleed Obsidian (#171719) bar, ~40px tall, centered white text at 12px Book, contains an inline 'Download' link underlined.

### Primary Navigation
White background, no border or shadow. Left: wordmark at 16px Medium 500, uppercase tracking. Right: nav links at 14px weight 400 in Slate, followed by a filled CTA. Generous horizontal padding ~24px.

### Filled CTA Button
Sky Signal background, white text, 8px radius, padding 10px 16px, Medium 500 at 14px. **The only saturated fill in the system — its rarity makes it the unmistakable action signal.** No border, no shadow.

### Ghost Button
Transparent background, Slate text at 14px weight 500, 8px radius, padding 10px 16px. No border — relies on text weight contrast. Hover: Ash background fill.

### Hero Headline
Book 200, 56-72px, Inkstone, line-height 1.00-1.10. The ultra-light weight is the signature — headline reads as whisper rather than announcement. Left-aligned in wide single-column blocks with generous breathing room.

### Key Hint Chip
White background, Linen 1px border, 4px radius, padding 4px 10px, Geist Mono 13px weight 500 Slate.

### Product Screenshot Card
Screenshot inside a 20px-radius card with Fog or Mist background. Hairline Linen border and a barely-there shadow at rgba(0,0,0,0.02). Centered below text blocks, acting as visual anchor.

### Inline Link
Electric Iris color, Medium 500, underlined. No background fill — color is the only signal. Hover: same color, opacity 0.8.

### Status Dot
8px filled circle in Sky Signal. Used sparingly to indicate live/active state. The only place this color appears outside the filled CTA.

### Feature Section
Centered text block on Paper White or Mist background. Subheading at 40px weight 200, body at 16px weight 400 Slate, max-width ~680px, followed by a Ghost CTA. Vertical rhythm: 80-120px between sections.

### Subtle Background Pattern
Very faint geometric or organic pattern overlaid on hero sections at near-white opacity. Adds texture without competing with the whisper typography.

## Do's and Don'ts

### Do
- Use weight 200 for all display and headline text — the ultra-light cut is the visual signature.
- Use the accent only for the filled primary CTA and the live-status dot; never extend it to backgrounds, illustrations, or decorative fills.
- Set headline line-height to 1.00-1.10 — tight leading is essential and prevents the light weight from looking fragile.
- Keep card padding in the 20-24px range and radii at 12-20px.
- Use Ghost buttons for all secondary actions; reserve the filled button exclusively for the single primary action on each screen.
- Apply the hairline border pattern with rgba(0,0,0,0.02) shadow for elevated surfaces — depth in millimeters.
- Center text blocks at max-width 680px; let negative space carry the page rhythm.

### Don't
- Do not use weights above 500 — Medium 500 is the upper bound; 600+ destroys the whisper character.
- Do not add color to body copy, headings, or backgrounds beyond the neutral scale — chromatic text breaks the monochrome contract.
- Do not apply large or saturated shadows; operate at rgba(0,0,0,0.02) to rgba(0,0,0,0.1) depth only.
- Do not use pill shapes for primary buttons — 8px is the button radius; pills are reserved for tags and status chips.
- Do not introduce gradients, glassmorphism, or heavy blur effects — the language is flat, matte, and paper-like.
- Do not set headline letter-spacing to negative values.
- Do not use the link/outline color as a fill — the filled action color owns that role.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#fafbfc` | Primary background for all pages |
| 2 | Section Band | `#f3f7fa` | Alternating section tint, subtle visual rhythm |
| 3 | Card Surface | `#f2f6fa` | Product screenshot cards, elevated content blocks |
| 4 | Hover/Active Fill | `#efefef` | Ghost button hover, interactive feedback |
| 5 | Inverted Bar | `#171719` | Top announcement bar, dark accent surfaces |

## Elevation

- **Card:** `0px 0px 0px 1px rgba(0,0,0,0.02), 0px 1px 1px 0.5px rgba(0,0,0,0.02), 0px 3px 3px 1.5px rgba(0,0,0,0.02), 0px 6px 6px -3px rgba(0,0,0,0.02), 0px 12px 12px -6px rgba(0,0,0,0.02), 0px 24px 24px -12px rgba(0,0,0,0.02)`
- **Elevated Panel:** same stack at `0.06` alpha, plus `inset 0 1px 0 rgb(255,255,255)`
- **Floating Card:** same stack at `0.1` alpha

## Imagery

> ⚠️ Единственный пункт, который у нас будет иначе. У Aqua Voice продукт — приложение, поэтому вместо фотографий скриншоты интерфейса. У PRIME SWIM продукт — живые занятия, поэтому здесь будут **реальные фотографии бассейна, детей и тренера**, помещённые в ту же карточку: радиус 20px, hairline-граница, тень в 2%.

Оригинал: Visuals are dominated by product UI screenshots displayed in rounded cards against muted backgrounds. No lifestyle photography, no stock imagery, no illustration. The only decorative visuals are very faint geometric patterns on hero sections, rendered in near-white opacity so they read as paper texture. Icons are minimal and line-based, inline with text.

## Layout

Full-bleed sections on a 1200px max-width centered grid. Hero is left-aligned text block at ~680px width with generous left margin, followed by centered cards. Sections alternate between Page Canvas and Section Band for subtle rhythm. Vertical spacing between sections is 80-120px. Navigation is a minimal top bar with no sticky behavior, no shadow, no border.

## Similar Brands

- **Linear** — near-monochrome palette with a single vivid accent, ultra-clean surfaces, hairline borders, whisper-light typography hierarchy
- **Stripe** — typographic confidence with custom display faces, centered hero text blocks on white, minimal decorative chrome
- **Notion** — paper-white canvas aesthetic, restrained color, generous whitespace around compact UI
- **Vercel** — dark/light surface contrast via announcement bars, minimal surfaces
