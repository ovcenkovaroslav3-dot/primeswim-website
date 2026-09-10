# PRIME SWIM — дизайн-ориентир

Источник: [WHOOP на styles.refero.design](https://styles.refero.design/style/05053a60-1964-4154-9d58-ebdf6352ed3a) · сайт [whoop.com](https://whoop.com)

## ПОЧЕМУ СМЕНИЛИ ОРИЕНТИР

Здесь лежал Aqua Voice. Его центральный тезис — «авторитет берётся
сдержанностью, а не весом», weight 200 в заголовках, акцент только на кнопке.

10 сентября 2026 владелец отклонил половину этого тезиса. Заголовок первого
экрана пробовали набрать волосяным Inter, тем же, что и все заголовки ниже;
вариант отклонён, Unbounded extrabold остаётся — школе нужен голос громче,
чем у референса.

Ориентир, который спорит с уже принятым решением, вреден: по нему следующий,
кто откроет проект, «починит» то, что чинить не просили. Поэтому Aqua Voice
заменён на WHOOP — он описывает ту же конструкцию без этого противоречия.

Что у WHOOP совпадает с уже собранным сайтом:

- **чередование полноширинных тёмных и светлых секций** — «full-bleed black
  theatrical heroes alternate with clinical white content sections». У нас
  ровно это, и в комментарии к `src/app/page.tsx` есть отдельная оговорка,
  что четыре светлые секции подряд ломают ритм;
- **типографика как главный голос** — «typography is the dominant voice,
  oversized display type carries the brand». Это и есть решение по h1;
- **один насыщенный акцент, только на действиях** — «a single vivid violet
  appears only on primary actions». Лайм приведён к этому же 10 сентября;
- **спортивный бренд, а не SaaS**, и среди их фотографий — плавание.

## ВАЖНО: что мы берём, а что нет

Референс выбран за **конструкцию, ритм и дисциплину акцента**, не за цвет и
не за форму элементов.

**Берём:** чередование тёмных и светлых полос без серых переходов между ними,
крупный заголовок как главный голос страницы, единственный хроматический
акцент на действии, плоскую высоту через цвет вместо теней, фотографию без
дуотонов и градиентных масок, uppercase-метки с трекингом, левое выравнивание
текстовых блоков.

**НЕ БЕРЁМ ПАЛИТРУ.** Цвета PRIME SWIM заданы логотипом и живут в
`src/app/globals.css` (`@theme`). Фиолетовый `#4a53ff` и чёрный `#000000` из
таблиц ниже — цвета WHOOP, **применять их запрещено**.

### Таблица подстановки цветов

| Роль у WHOOP | Цвет WHOOP | Чем заменяем у нас | Токен |
|---|---|---|---|
| Единственный акцент, только на действии | `#4a53ff` | лайм на тёмном | `--color-lime-400` `#c7fe03` |
| — он же на светлых секциях | `#4a53ff` | фиолетовый | `--color-brand-600` `#4f017b` |
| Тёмная секция, театральная | `#000000` | толща | `--color-abyss-950` `#0b0114` |
| Вторая тёмная поверхность | `#191919` | толща светлее | `--color-abyss-900` `#180229` |
| Основной текст на светлом | `#000000` | | `--color-ink` `#16101f` |
| Приглушённый текст | `#808080` | | `--color-ink-soft` `#4a4356` |
| Третичный текст, метки | `#999999` | | `--color-ink-muted` `#6b6377` |
| Холст страницы | `#ffffff` | | `--color-surface` `#ffffff` |
| Светлая карточка (Lab Mist) | `#f3f5f9` | | `--color-surface-alt` `#f8f5fc` |
| Hairline | `#e5e7eb` | | `--color-hairline` `#e6dff0` |

**Одно расхождение осознанное.** У WHOOP акцент один на весь сайт. У нас их
два, и это не небрежность: лайм на белом нечитаем, а притушенный до
оливкового выглядит грязно, поэтому на светлых секциях акцент — фиолетовый.
Правило «один заливной акцент на экран» при этом остаётся в силе: два цвета
никогда не встречаются на одном экране. Подробности — в шапке `globals.css`.

### Шрифты

У WHOOP одно семейство на всё — Proxima Nova от 14px до 120px. У нас два, и
оба остаются: **Unbounded** — логотип и заголовок первого экрана, **Inter** —
всё остальное. Третьего не заводить.

Приём, который переносится: **отрицательный трекинг растёт вместе с кеглем**.
У WHOOP от нуля на body до -0.04em на display. У нас на h1 стоит `-0.02em` —
направление верное, и на крупных h2 (44px и выше) его тоже стоит довести до
`-0.02em`; сейчас там трекинг нулевой.

### Что НЕ переносим

Четыре правила WHOOP, которые для нас неверны. Записаны, чтобы их не
применили механически:

- **«pill 300px на каждой кнопке, форма не обсуждается»** — у нас радиусы
  свои: `--radius-control` 10px и `--radius-card` 20px. Круглые пилюли на
  всех кнопках — это другой бренд, не наш.
- **«display 120px, line-height 0.71, трекинг -4.8px»** — у нас h1 64px при
  1.04. Кириллица выше латиницы по выносным элементам: на 0.71 строки
  столкнутся. Ниже 1.0 не опускаться.
- **«body 19-20px, меньше — теряется уверенный масштаб»** — правило для
  английского маркетингового сайта. Русский текст длиннее, у нас 16px, и это
  верно. Не менять.
- **«никаких градиентов на поверхностях»** — у нас на тёмных сценах живёт
  WebGL-вода и `.glass`. Это сцена, а не заливка компонента, и она остаётся.

А вот **«высота через цвет, а не через тень»** взять стоит, и до конца пока
не взято: `.glass` на тёмных сценах тень оправдывает — панель лежит поверх
движущегося видео и держится кромкой, — но декоративные тени на светлых
карточках нет, там высоту уже даёт `--color-surface-alt`.

Второе, что стоит проверить: **«не центровать абзацы, текст выравнивается
влево при max-width 520px»**. У нас секция записи (`FinalCta`) центрует всё —
надзаголовок, заголовок, лид. Это единственная такая секция на главной.

### Главное правило переноса

То же, что и было, и это единственное, что осталось от Aqua Voice дословно:
**дефицит делает цвет дорогим**. Акцент — на действии, и больше нигде.

---

# Оригинал: WHOOP — Style Reference

> Ниже — исходный документ refero без правок. Цвета в нём читать через
> таблицу подстановки выше.

**Vibe:** Performance laboratory at midnight — clinical white lab benches beneath a black theatrical void, one violet pulse of electricity.

**Theme:** mixed

WHOOP operates on a high-contrast split-canvas system: full-bleed black theatrical heroes alternate with clinical white content sections, creating a rhythm that mimics the alternation between effort and recovery. Typography is the dominant voice — oversized Proxima Nova display type at 120px with aggressive negative tracking carries the brand, while body copy stays compact and neutral. A single vivid violet (#4a53ff) acts as the lone chromatic accent against an otherwise achromatic palette, appearing only on primary actions and the announcement bar. Components are large, confident, and rounded: 24px-radius cards, fully pill-shaped buttons, and photographic overlays with heavy text treatment replace the typical SaaS card grid. The result feels less like a product page and more like a premium performance lab at night — scientific, dramatic, and focused on data over decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pulse Violet | `#4a53ff` | `--color-pulse-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Obsidian | `#000000` | `--color-obsidian` | Primary text on light surfaces, dark hero/section backgrounds, filled neutral buttons, icon strokes |
| Carbon | `#191919` | `--color-carbon` | Secondary dark surface (footer band, alternating black sections), heading text on light surfaces |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page canvas, card surfaces on dark sections, text on dark backgrounds, filled white pill buttons |
| Lab Mist | `#f3f5f9` | `--color-lab-mist` | Soft elevated surface for light cards and feature panels — a cool off-white that distinguishes cards from the page without using shadow |
| Hairline | `#e5e7eb` | `--color-hairline` | Borders, dividers, outlined button strokes, input frames — the most-used neutral in the system (2560 occurrences) |
| Fog Gray | `#808080` | `--color-fog-gray` | Muted body text, secondary descriptions, placeholder copy on light surfaces |
| Ash | `#999999` | `--color-ash` | Tertiary text, inactive button labels, disabled icon strokes — sits one step below Fog Gray for de-emphasized metadata |

## Tokens — Typography

### Proxima Nova

- **Substitute:** Montserrat, Nunito Sans, or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 15, 16, 19, 20, 24, 32, 35, 50, 120
- **Line height:** 0.71 (120px) → 0.80 (50px) → 1.00 (35px) → 1.09 (32px) → 1.13 (24px) → 1.29–1.30 (20–19px) → 1.33 (16px) → 1.50 (15px) → 1.59 (14px)
- **Letter spacing:** Negative tracking tightens with size: 0.1em on 15px uppercase nav, 0 on body (14–16px), -0.03em at 19–24px (-0.48 to -0.72px), -0.04em at 32–120px (-1.05 to -4.8px)
- **Role:** Single-family system covering everything from 14px captions to 120px display headlines. The aggressive letter-spacing compression at display sizes (-4.8px at 120px) is signature — it makes oversized headlines feel carved rather than stacked. Proxima Nova's geometric warmth keeps the clinical data aesthetic from feeling cold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.59 | — | `--text-caption` |
| body-sm | 16px | 1.33 | -0.48px | `--text-body-sm` |
| body-lg | 20px | 1.29 | -0.6px | `--text-body-lg` |
| subheading | 24px | 1.13 | -0.72px | `--text-subheading` |
| heading-sm | 32px | 1.09 | -0.96px | `--text-heading-sm` |
| heading | 35px | 1 | -1.05px | `--text-heading` |
| heading-lg | 50px | 0.8 | -2px | `--text-heading-lg` |
| display | 120px | 0.71 | -4.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 33, 36, 38, 40, 50, 92 (px)

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| pills | 300px |
| images | 24px |
| buttons | 300px |
| mediumRounded | 30px |
| smallElements | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(199, 199, 199, 0.25) 0px 4px 15px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 15-24px

## Components

### Announcement Bar
**Role:** Top-of-page thin promotional strip

Full-width, 40-48px tall, Pulse Violet (#4a53ff) background, white Proxima Nova 14px text centered, with an underlined white text link aligned right. Sits flush above the nav bar with no gap.

### Primary Navigation
**Role:** Top navigation bar on dark hero

Full-bleed black background, 80-100px tall. WHOOP wordmark left in white 24px weight 700. Nav links in white 15px weight 500 with 0.1em tracking, spaced ~32px apart. Right-aligned Pulse Violet pill button (#4a53ff, white text, 300px radius, 12px 24px padding).

### Full-Bleed Dark Hero
**Role:** Opening theatrical section

100% width, 100vh height, pure #000000 background. Display headline at 120px Proxima Nova weight 400, white, line-height 0.71, letter-spacing -4.8px, occupying 2 lines and left-aligned with ~8% page padding. Subtext at 19px weight 400, white or Fog Gray, max-width 520px. White pill CTA centered below (300px radius, 16px 32px padding, black 15px weight 600 uppercase text with 0.1em tracking).

### Pulse Violet Pill Button
**Role:** Primary brand action

#4a53ff background, white text, 300px border-radius, 12px 24px padding, Proxima Nova 15px weight 600 uppercase with 0.1em letter-spacing. Used in nav and promotional contexts. No shadow.

### White Pill Button
**Role:** Secondary action on dark backgrounds

White (#ffffff) background, black (#000000) text, 300px border-radius, 16px 32px padding, 15px weight 600 uppercase with 0.1em tracking. Centered in hero sections and dark bands.

### Outlined Pill Button
**Role:** Tertiary action on light surfaces

Transparent background, 1.5px Hairline (#e5e7eb) border, black text, 300px border-radius, 12px 28px padding, 14px weight 500. Used in feature cards for trial and secondary offers.

### Lab Mist Feature Card
**Role:** Inline promotional card on light sections

Lab Mist (#f3f5f9) background, 24px border-radius, no shadow, 24px padding. Contains a 24px-radius square image left (~200×140px), bold heading and body text middle, outlined pill button right. Total height ~200px, full content-width.

### Carousel Story Card
**Role:** Full-bleed photographic feature card

Tall card (aspect ratio ~3:4 or 4:5), photographic background filling the entire card, 24px border-radius. Overlay heading top-left at 24px weight 600, white. Small white circular expand button (40px, 1px white border) bottom-right. Pagination dots centered below carousel.

### Dark CTA Band
**Role:** Closing full-bleed black section

Full-width #000000 background, 400-600px height, large display heading in white (50px weight 400, -2px tracking), centered or left-aligned with generous padding (80-120px vertical).

### Membership Pricing Card
**Role:** Tier comparison card

White background, 24px border-radius, 1px Hairline (#e5e7eb) border, 32px padding. Black tier name at 24px weight 700, price at 50px weight 400 with -2px tracking, feature list at 16px with 15px row gap. Pulse Violet pill button at bottom for selected tier.

### Metric Overlay Stat
**Role:** Data point on photographic backgrounds

Small white number (32px weight 400) with thin white label (12px weight 500, 0.1em tracking, uppercase). Used as floating data callouts over carousel images — e.g. '98%' '82%' on a forest scene, '45.8%' inside a green radial glow.

## Do's and Don'ts

### Do
- Use 300px border-radius for every button — pill shape is non-negotiable, even on small utility buttons
- Set display headlines at 120px with line-height 0.71 and letter-spacing -4.8px; this tight tracking is the brand's visual signature
- Alternate full-bleed black sections with full-bleed white sections at 80-120px gaps; never blend the two with a gray transition
- Use #4a53ff exclusively for primary actions and the announcement bar — no other element should carry chromatic color
- Render cards at 24px radius with no drop shadow; elevation comes from #f3f5f9 fills, not blur
- Apply 0.1em letter-spacing with uppercase to all 14-15px labels in nav, buttons, and metric captions
- Keep body text at 19-20px with -0.57 to -0.6px tracking; anything smaller loses the brand's confident scale

### Don't
- Don't add drop shadows to cards or buttons — WHOOP uses flat color elevation only; the single rgba(199,199,199,0.25) shadow is reserved for floating overlays
- Don't introduce a second accent color — the system is monochromatic + one violet, anything else breaks the lab aesthetic
- Don't use line-height above 1.0 on display sizes (50px+) — the tight 0.71-0.80 ratio is what makes headlines feel carved
- Don't center body paragraphs — text in feature cards and descriptions left-aligns with max-width 520px
- Don't use square or 8px-radius buttons — every action is a pill, including icon buttons and tags
- Don't place colored gradients on UI surfaces; the three detected gradients are decorative background washes only, not component fills
- Don't set body text below 16px — 14px is reserved for uppercase labels with tracking, never running prose

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default light section background |
| 1 | Lab Mist Card | `#f3f5f9` | Elevated feature card on light sections — flat elevation via color, not shadow |
| 2 | Dark Section | `#000000` | Full-bleed theatrical hero and closing CTA band |
| 3 | Carbon Band | `#191919` | Secondary dark surface for transitional bands between black and white |

## Elevation Philosophy

WHOOP avoids drop shadows almost entirely. The single detected shadow (rgba(199,199,199,0.25) 0px 4px 15px 0px) is used sparingly on floating overlays only. Elevation is communicated through flat color contrast: Lab Mist (#f3f5f9) cards sit on Paper White (#ffffff) canvases; black sections sit on white sections; the Pulse Violet button sits on black. This keeps the system feeling clinical and flat — closer to print editorial than interactive app.

## Imagery

> ⚠️ Здесь мы совпадаем с референсом почти полностью, и это редкость. У WHOOP
> продукт — тренировки, поэтому фотография настоящая, тёплая, при естественном
> свете, без дуотонов и градиентных масок. У PRIME SWIM ровно та же задача:
> бассейн, дети, тренер, никакой обработки. Единственная поправка — у них текст
> кладётся прямо на фото без подложки. У нас так нельзя: кадры сняты при разном
> свете, и белый текст на светлой воде пропадёт.

Оригинал: Photography is the dominant visual asset: tight, full-bleed lifestyle crops of athletes and bodies in motion — swimming, running, sleeping on textured bedding. Images are warm-toned and natural-light, never staged studio shots. Treatment is raw: no duotone, no color grading overlays, no masks. They sit inside 24px-radius carousel cards with white text overlaid directly on the photo (no scrim). UI graphics are minimal — small white circular expand buttons, thin pagination dots, and one green radial-glow metric on the longevity card. No illustrations, no 3D renders, no abstract graphics. Icons (where present) are thin-stroke monoline, white on dark, black on light.

## Layout

Page model alternates between full-bleed edge-to-edge sections (no max-width constraint on the outer container) and a 1200px max-width content well for text and card grids. Hero is a full-viewport black theater with a 120px display headline left-aligned in the first 60% of the screen. Below the hero, content sections stack as white bands containing a single max-width column or a 3-up carousel of photographic cards. Closing section returns to full-bleed black. Navigation is a fixed top bar on the dark hero only; content sections rely on the page scrolling naturally without sticky chrome. Card grids use 3 equal columns with 24px gutters. Density is comfortable: 80-120px between sections, 15-24px between elements. No sidebar, no mega-menu.

## Similar Brands

- **Oura** — Same split-canvas black/white alternation, oversized display headlines with tight tracking, and single-accent restrained palette in the health-wearable space
- **Peloton** — Full-bleed photographic hero cards with 24px radius, pill-shaped CTAs, and a dark theatrical opening that transitions to white content sections
- **Garmin** — Performance-data aesthetic with uppercase tracking labels, flat card elevation, and Proxima-Nova-adjacent geometric sans typography
- **Notion** — Minimalist monochrome palette with a single violet brand accent, tight letter-spacing on large headlines, and pill-shaped primary buttons
- **Apple Fitness+** — Athletic-performance category peers using photographic carousel cards as the primary content unit with direct text overlay
