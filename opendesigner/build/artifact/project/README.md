**Shantung** is a WeChat Mini Program for the clients of Shantung, a Shandong luxury maison (silk scarves, ties, Laoshan green tea), plus the iPad tools its boutiques use: the advisors portal and an entrance kiosk.

- **For:** people who use it now and then, often on a phone
- **Screens:** mini program (something people explore and enjoy); advisor portal (screens where people get work done); entrance kiosk (something people explore and enjoy)
- **Runs on:** ios, android, web
- **Feel:** premium, heritage, calm, minimal (premium, heritage, deferential, minimal; picked for you)
- **Brand color:** Picked for you, not chosen by you: a deep red (#932B1E) on buttons, links and focus, with white text that reads clearly on it. In dark mode, buttons use a lighter shade of it (#D5604E), so their dark text reads clearly.
- **Decided:** 3 answers you gave, 9 picked for you; everything else uses sourced defaults
- **Standards:** 450 house standards followed (locked, house standards v4); see the Standards section
- **Next:** zoom into Layout, Elevation & Depth, Shapes, or stop here: each level works
- **Licence risks:** Photography and art direction: check the terms of the set you use. Stock: Unsplash (free, irrevocable, commercial; no competing service) or Pexels (no implied endorsement, no use as a trademark).

> Generated from `opendesigner/state.json` and `opendesigner/decisions.md`. Made with OpenDesigner 0.3.1. `opendesigner/tokens/` is the source of truth. Change the system with `engine.py set ...` and `engine.py build`, not by editing this file (notes inside `<!-- od:keep -->` blocks survive). Each section opens with one plain sentence; open **More** for the designer and engineer detail.

## Overview

> Zoom: broad (1 of 3), 6 decisions in this area. To zoom in, answer Q-scope-02, Q-scope-05, Q-brand-02.
<!-- od:zoom area=overview level=1 -->

**Shantung feels premium, heritage, deferential and minimal. Screens are roomy, in a flat style.**
Designers: visual style: flat, tonal, glass · Code: `preset in state.json`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Which overall look fits: flat, tonal, glass, neo-brutalist, soft, or bold and busy? **Flat 2.0** (delegated; tokens; Q-dir-01)
- What are these screens mostly for: selling, getting work done, reading, or enjoying an experience? **mini program (Experience), advisor portal (Operate), entrance kiosk (Experience)** (chosen; tokens; Q-scope-06)
- Where is the project now: an idea, being built, close to launch, or live with real users? **Being built** (assumed; owner input; Q-scope-07)

**Intent.** a WeChat Mini Program for the clients of Shantung, a Shandong luxury maison (silk scarves, ties, Laoshan green tea), plus the iPad tools its boutiques use: the advisors portal and an entrance kiosk

- Audience: people who use it now and then, often on a phone
- The memorable thing: not recorded yet (Q-brand-02)
- Surfaces: mini program (Experience: density spacious; hero moments and big imagery allowed; display styles welcome); advisor portal (Operate: density spacious; no hero; cards only to group related data); entrance kiosk (Experience: density spacious; hero moments and big imagery allowed; display styles welcome)
- Platforms: ios, android, web; inputs: pointer, touch
- Direction: preset flat2; feel premium, heritage, deferential, minimal (words picked for you: premium, heritage, calm, minimal)

**Principles (ranked).**
No principles recorded yet (Q-brand-07). Until they are, the dials act as the tie-breakers below.

**Dial positions.** Three posture dials set the overall stance. Five character dials fine-tune it.

- **Expression 15/100** (productive to expressive: productive): type ratio 1.25, hero moments: significant-moments, expressive motion: none, brand color role: accent+signature-surface, containment: whitespace.
- **Brand presence 20/100** (native to brand-led: native): typeface suggestion: system-font-per-platform, brand color placement: accent-only+content-layer, native component share about 92%, voice guidance: none.
- **Density 15/100** (spacious to compact: spacious): body 17px on the web, default control 48px, density mode spacious, icons 24px; hit areas never shrink.
- **Energy 20/100** (calm to energetic: calm): standard easing [0.77, 0, 0.175, 1], duration multiplier 0.88, spring damping 1.0, heading weight 600, navigation: neutral.
- **Roundness 6/100** (sharp to soft: sharp): control radius 0px, icon corners sharp, caps square.
- **Depth 8/100** (flat to deep: flat): depth model: borders.
- **Colorfulness 45/100** (monochrome to vivid: balanced): scheme tonalSpot, accent chroma 59.5 (HCT), 1 accent(s), surfaces: tinted-containers.
- **Warmth 50/100** (cool/formal to warm/friendly: balanced): neutral tint chroma 0.0 at hue 264, borders: default, sentence-case, contractions allowed.

**Zoom by area** (sketch, broad, defined, detailed). You can stop at any level; each one works.

| Area | Zoom | Next questions |
|---|---|---|
| Colors | broad | Q-color-03, Q-color-04, Q-color-06 |
| Typography | broad | Q-type-02, Q-type-03, Q-type-04 |
| Layout | sketch | Q-space-01, Q-space-02, Q-space-03 |
| Elevation & Depth | sketch | Q-depth-01 |
| Shapes | sketch | Q-shape-01 |
| Components | sketch | Q-comp-01, Q-comp-02, Q-state-01 |
| Motion | broad | Q-motion-07, Q-motion-08 |
| Modes and Themes | sketch | Q-theme-03 |
| Iconography and Imagery | sketch | Q-icon-01, Q-icon-02, Q-icon-06 |
| Content and Voice | sketch | Q-voice-01, Q-voice-02, Q-voice-03 |
| Accessibility | sketch | Q-aud-02, Q-aud-03, Q-aud-04 |
| Platforms and Devices | sketch | Q-plat-05, Q-plat-10, Q-plat-08 |

The tokens in `opendesigner/tokens/` (DTCG 2025.10 with `opendesigner.resolver.json`) are the source of truth. This file is a generated view.

Decisions: D-0008 (dials.density), D-0016 (answers.Q-scope-07), D-0020 (answers.Q-aud-01), D-0024 (macros), D-0028 (answers.Q-scope-06), D-0030 (answers.Q-dir-01).

</details>

**Taste card.** How it looks and feels, in five lines for you, your team and any AI that builds with it. Nothing on it is invented: each line says where it comes from.
Designers: style brief, mood in words · Code: `taste.brief, taste.never`

| Line | What it says | From |
|---|---|---|
| In your words | "dark red, black and white, with sunny clear-blue-sky Chinese architecture" | your words |
| Color | One accent color: a deep red picked for you (`#932b1e`) marks buttons, links and focus. Everything else stays neutral. Keep the accent to small areas, about 15% of a screen at most (a rule of thumb, DC-L15-03). | brand color; colorfulness 45/100 |
| Shape | Buttons and fields have 0px corners; cards have 0px corners. Surfaces are separated by thin borders, with no shadows. | roundness 6/100, depth 8/100 |
| Motion | Calm. Most movements take 200ms. They turn into fades when a person asks for less motion. | energy 20/100 |
| Never | Nothing yet. Say what it should never look like, or rate real screens in the taste poll. | not asked yet |

<!-- od:keep -->
### Shantung house rules

These are hand-written rules that every Shantung screen follows. Token names are given in brackets.

**Look.** Pages are white with black text. One lacquer red (`color.bg.accent.bold`) is used rarely, and only in three places: page titles, the selected item, and full-width red bands for salons and limited releases. Thin 1 px rules separate parts of a page. Nothing floats, and every corner is square (`radius.control` 0).

**Type.**
- Titles and labels: Cormorant Garamond in capitals, with wide letter-spacing (`font.family.display`). Chinese titles fall back to the phone's own Song serif.
- Running text: the device's sans (`font.family.text`).
- Never letter-space Chinese text, and never put it in capitals styling.

**Layouts.**
- Opening screen: one full-bleed photo, with the title over it.
- Staggered gallery: one wide photo, then two smaller ones pushed to opposite sides, with generous blank space between them.
- Featured content (a salon, a limited release): a red band alternating with a photo, like a chessboard.
- Reading pages: the title in red capitals, with a smaller red subtitle under it. Long text runs in one column.
- Forms: fields with only an underline.
- Buttons: on reading pages the main action is red text in capitals with an arrow (`RESERVE →`). Use a filled red button only when that action is the whole point of the screen (book a seat, reserve a piece).

**Photography.** Daylight, clear blue skies and Chinese architecture. Textile and tea close-ups in natural light. No people, no brands and no text in the frame. Every photo and its licence is listed in `apps/cms/seed/photos/CREDITS.md`.

**Membership cards.** The cards are the one signature element. Each card shows the client's chosen WeChat avatar and nickname, the tier in English and Chinese, and the member number.

| Tier | Card |
|---|---|
| Thread 丝 | White, with one fine red thread line running across it |
| Satin 缎 | Black, with a slow band of light that glides across it once when it appears |
| Brocade 锦 | Red, with a fine woven lattice pattern |
| Kesi 缂丝 (by invitation) | Black, with red and white blocks separated by hairline vertical slits, the mark of kesi weaving |

**Motion.** Calm.
- Entrances fade and rise 12 px (`motion.distance.reveal`) over `motion.duration.reveal`, with `motion.easing.enter`.
- Photos open from a 16 px inset frame (`motion.distance.photo-zoom`) as they enter.
- Nothing bounces.
- The card reveal and the satin sheen are the only showpiece moments.
- With reduced motion turned on, everything only fades.
- In WeChat, animate only transform and opacity, with CSS transitions started when an element scrolls into view.

**Words.** Never use "cheap", "deal", "hurry", "selling fast" or countdown pressure. Say "reserve", "invitation" and "by appointment".
<!-- /od:keep -->

## Colors

> Zoom: broad (1 of 3), 5 decisions in this area. To zoom in, answer Q-color-03, Q-color-04, Q-color-06.
<!-- od:zoom area=color level=1 -->

**One accent color: a deep red picked for you (`#932b1e`) marks buttons, links and focus.** Everything else stays neutral.
Designers: primary or brand accent · Code: `color.bg.accent`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Where should your brand color show: only on key actions, in one standout area, or on the bars and... **One standout area carries the brand** (delegated; tokens; Q-color-02)

**Intent.** Brand color `#932b1e` drives the accent ramp's hue; the Colorfulness dial (45) sets its chroma (scheme tonalSpot, peak HCT chroma 59.47). The brand's role is **accent+signature-surface** and it sits closest to accent step 9. Picked for you, not chosen by you: a deep red (#932B1E) on buttons, links and focus, with white text that reads clearly on it. In dark mode, buttons use #D5604E, a lighter shade of it, because the dark text on dark-mode buttons would read at only 2.27:1 on the exact color.

**How ramps are built.** Each hue gets twelve steps in OKLCH, placed by contrast. Step 8 reaches at least 3:1 (edges and focus). Steps 10 and 11 reach the text minimum on backgrounds 1-4. Step 12 reaches at least 7:1. Steps 2-6 are spaced evenly in lightness between step 1 and step 7. Light and dark ramps are solved separately. Dark solids are lighter and carry dark text (dark mode is a separate mapping, never an inversion). Text minimum: 4.5:1 (WCAG 2.2 AA).

| Ramp | Light steps 1-12 | Solid carries |
|---|---|---|
| `accent` | `#fffcfc` `#fdf2f0` `#fee7e2` `#ffdbd4` `#ffd0c7` `#ffc4b9` `#ffb8ab` `#c56e5f` `#932b1e` `#871c10` `#791d12` `#532720` | light |
| `danger` | `#fffcfc` `#fff1ef` `#ffe6e3` `#ffdbd6` `#ffcfc9` `#ffc4bc` `#ffb8af` `#d1665c` `#d3413a` `#c13833` `#a22b27` `#59221e` | light |
| `info` | `#fbfdff` `#eaf6ff` `#d9efff` `#c7e7ff` `#b5e0ff` `#a3d8ff` `#8fd1ff` `#008ed0` `#007cb7` `#0070a6` `#005c8a` `#003755` | light |
| `neutral` | `#fdfdfd` `#f4f4f4` `#ebebeb` `#e3e3e3` `#dadada` `#d2d2d2` `#c9c9c9` `#868686` `#757575` `#646464` `#575757` `#242424` | light |
| `success` | `#f9fefa` `#ecf6ee` `#dbf1de` `#c9ebcf` `#b6e6bf` `#a3e0af` `#8fda9f` `#2a994f` `#00883d` `#007b36` `#00652c` `#003d17` | light |
| `warning` | `#fffcf8` `#f8f4ec` `#f5eada` `#f1e1c6` `#eed8b3` `#eacea0` `#e7c58c` `#a97f2e` `#efb23c` `#dca334` `#845d00` `#463002` | dark |

**Step-distance guarantee** (neutral, light; WCAG contrast of a foreground step on background steps 1-5):

| Foreground | on 1 | on 2 | on 3 | on 4 | on 5 |
|---|---|---|---|---|---|
| neutral 8 | 3.58 | 3.31 | 3.05 | 2.84 | 2.60 |
| neutral 9 | 4.53 | 4.19 | 3.86 | 3.59 | 3.30 |
| neutral 10 | 5.82 | 5.38 | 4.96 | 4.61 | 4.23 |
| neutral 11 | 7.10 | 6.57 | 6.06 | 5.63 | 5.17 |
| neutral 12 | 15.26 | 14.11 | 13.02 | 12.10 | 11.10 |

**States.** Hover is at least 1.15:1 from its fill and pressed at least 1.3:1, as shade steps (DC-L01-17). Where a color is unknown at design time, use the state opacities in `opacity.state.*`.

| Fill | Base | Hover | Pressed |
|---|---|---|---|
| `color.bg.action.primary` | `#932b1e` | `#871c10` (1.18:1) | `#7d0f05` (1.34:1) |
| `color.bg.accent.bold` | `#932b1e` | `#871c10` (1.18:1) | `#7d0f05` (1.34:1) |

**Semantic roles** (use these, never the ramps):

| Token | Light | Dark | Use |
|---|---|---|---|
| `color.bg.accent.bold` | `#932b1e` | `#d5604e` | Solid accent fill. |
| `color.bg.accent.bold-hover` | `#871c10` | `#e46d5b` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.accent.bold-pressed` | `#7d0f05` | `#ef7764` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.accent.subtle` | `#fee7e2` | `#38221e` | Selected rows, accent badges. |
| `color.bg.accent.subtle-hover` | `#ffdbd4` | `#472721` | Hover on accent subtle fills. |
| `color.bg.accent.subtle-pressed` | `#ffd0c7` | `#562b24` | Pressed accent subtle fills. |
| `color.bg.action.primary` | `#932b1e` | `#d5604e` | Primary action. One per view (DC-L15-03, L15 P08). |
| `color.bg.action.primary-hover` | `#871c10` | `#e46d5b` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.action.primary-pressed` | `#7d0f05` | `#ef7764` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.brand` | `#932b1e` | `#d5604e` | Brand fill for signature surfaces; carries text.on-brand (brandAnchor rule, DC-L01-09). |
| `color.bg.danger.bold` | `#d3413a` | `#d46056` | Danger solid fill. |
| `color.bg.danger.bold-hover` | `#c13833` | `#e36d63` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.danger.bold-pressed` | `#b72e2a` | `#ee776c` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.danger.subtle` | `#ffe6e3` | `#38221f` | Danger banner and badge background. |
| `color.bg.disabled` | `#ebebeb` | `#2d2d2d` | Disabled control fill. |
| `color.bg.field` | `#ffffff` | `#252525` | Text field fill: outlined fields sit on the raised surface (Q-form-01). |
| `color.bg.info.bold` | `#007cb7` | `#008bcd` | Info solid fill. |
| `color.bg.info.bold-hover` | `#0070a6` | `#0099e0` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.info.bold-pressed` | `#006799` | `#00a3ee` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.info.subtle` | `#d9efff` | `#0e2a3c` | Info banner and badge background. |
| `color.bg.inverse` | `#242424` | `#e9e9e9` | Tooltips and toasts: the inverted surface. |
| `color.bg.neutral.subtle` | `#ebebeb` | `#363636` | Secondary buttons, chips, hovered rows. |
| `color.bg.neutral.subtle-hover` | `#e3e3e3` | `#3f3f3f` | Hover: +1 step (DC-L01-17). |
| `color.bg.neutral.subtle-pressed` | `#dadada` | `#484848` | Pressed or selected: +2 steps (DC-L01-17). |
| `color.bg.success.bold` | `#00883d` | `#0f9847` | Success solid fill. |
| `color.bg.success.bold-hover` | `#007b36` | `#29a554` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.success.bold-pressed` | `#007132` | `#37b05d` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.success.subtle` | `#dbf1de` | `#192b1d` | Success banner and badge background. |
| `color.bg.warning.bold` | `#efb23c` | `#e6b55f` | Warning solid fill. |
| `color.bg.warning.bold-hover` | `#dca334` | `#f7c56f` | Hover: one step, at least 1.15:1 from the solid (DC-L01-17). |
| `color.bg.warning.bold-pressed` | `#d19925` | `#ffd388` | Pressed: at least 1.3:1 from the solid. |
| `color.bg.warning.subtle` | `#f5eada` | `#2f2618` | Warning banner and badge background. |
| `color.border.accent` | `#c56e5f` | `#c96454` | Selected card or accent outline. |
| `color.border.danger` | `#d1665c` | `#c8645a` | Danger boundary, for example an invalid field (3:1). |
| `color.border.default` | `#c9c9c9` | `#484848` | Outline buttons and table grids (decorative; the label carries meaning). |
| `color.border.focus` | `#932b1e` | `#fe8c7a` | Focus ring (3:1 against every surface, DC-L04-09). |
| `color.border.info` | `#008ed0` | `#0089c9` | Info boundary, for example an invalid field (3:1). |
| `color.border.input` | `#868686` | `#808080` | Text field and select borders (3:1, DC-L01-16). |
| `color.border.separator` | `#e3e3e3` | `#363636` | Hairlines between table rows and list items, lighter than border.subtle; decorative, so never the only cue (DC-L23-05). |
| `color.border.strong` | `#868686` | `#808080` | Boundaries that are the only cue: inputs, checkboxes, switches (3:1, WCAG 1.4.11). |
| `color.border.subtle` | `#d2d2d2` | `#3f3f3f` | Dividers and card edges (decorative). |
| `color.border.success` | `#2a994f` | `#2f934e` | Success boundary, for example an invalid field (3:1). |
| `color.border.warning` | `#a97f2e` | `#a37b31` | Warning boundary, for example an invalid field (3:1). |
| `color.icon.accent` | `#791d12` | `#fe8c7a` | Selected and interactive icons. |
| `color.icon.default` | `#575757` | `#ababab` | Icons beside text; same color as secondary text (DC-L05-08). |
| `color.icon.on-accent` | `#ffffff` | `#151515` | Icons on solid accent fills. |
| `color.icon.subtle` | `#646464` | `#959595` | Decorative icons. |
| `color.overlay.scrim` | `#242424 @0.45` | `#000000` | Modal backdrop (DC-L04-18; Q-depth-06). |
| `color.surface.base` | `#fdfdfd` | `#1d1d1d` | The page background. |
| `color.surface.nav` | `#fdfdfd` | `#1d1d1d` | Navigation on the page background. |
| `color.surface.overlay` | `#ffffff` | `#2d2d2d` | Menus, popovers, dialogs; always with elevation.floating or elevation.overlay. |
| `color.surface.raised` | `#ffffff` | `#252525` | Cards and panels on the page. |
| `color.surface.sunken` | `#f4f4f4` | `#151515` | Wells, code blocks, page gutters. |
| `color.surface.tinted` | `#fdf2f0` | `#281d1b` | Tinted container (Colorfulness 50+, L09 X rubric; Q-color-05). |
| `color.text.accent` | `#791d12` | `#fe8c7a` | Accent text and selected labels. |
| `color.text.danger` | `#a22b27` | `#fd8d81` | Danger text and icons; pair with an icon or label (DC-L01-15). |
| `color.text.disabled` | `#868686` | `#808080` | Disabled labels; exempt from contrast minimums (WCAG 1.4.3 exception). |
| `color.text.info` | `#005c8a` | `#3ab6ff` | Info text and icons; pair with an icon or label (DC-L01-15). |
| `color.text.inverse` | `#ffffff` | `#151515` | Text on color.bg.inverse (tooltips, toasts). |
| `color.text.link` | `#791d12` | `#fe8c7a` | Links. Underline them in running text so color is not the only cue. |
| `color.text.on-accent` | `#ffffff` | `#151515` | Text and icons on color.bg.accent.bold* (auto-picked light or dark, S-L06-094). |
| `color.text.on-action` | `#ffffff` | `#151515` | Text on the primary action fill. |
| `color.text.on-brand` | `#ffffff` | `#151515` | Text on color.bg.brand. |
| `color.text.on-danger` | `#ffffff` | `#151515` | Text on bg.danger.bold. |
| `color.text.on-info` | `#ffffff` | `#151515` | Text on bg.info.bold. |
| `color.text.on-success` | `#ffffff` | `#151515` | Text on bg.success.bold. |
| `color.text.on-warning` | `#242424` | `#151515` | Text on bg.warning.bold. |
| `color.text.primary` | `#242424` | `#e9e9e9` | Body copy, headings, labels (guaranteed >= 7:1 on steps 1-5). |
| `color.text.secondary` | `#575757` | `#ababab` | Supporting text (guaranteed >= the text minimum on surfaces and neutral fills 1-4). |
| `color.text.success` | `#00652c` | `#57c073` | Success text and icons; pair with an icon or label (DC-L01-15). |
| `color.text.tertiary` | `#575757` | `#ababab` | Captions and placeholders: the same grey as secondary, so text keeps three greys (primary, secondary, disabled; owner, 2026-11-05). |
| `color.text.warning` | `#845d00` | `#fecf80` | Warning text and icons; pair with an icon or label (DC-L01-15). |

**Use / avoid.**
- Use one solid accent fill per view for the primary action; spend chroma on small, meaningful elements.
- Avoid gray text on colored fills; use the matching `text.on-*` role.
- Avoid color as the only signal: pair status colors with an icon or label.
- Charts: no chart palette yet (Q-color-19). Take chart colors from the status and accent hues, and check them separately.

**Tailwind classes:** `bg-action-primary`, `hover:bg-action-primary-hover`, `active:bg-action-primary-pressed`, `text-on-action`, `bg-surface-base`, `bg-surface-raised`, `text-fg-primary`, `text-fg-secondary`, `text-fg-link`, `border-line-subtle`, `border-line-input`, `outline-line-focus`, `bg-danger-bold`.

Decisions: D-0010 (dials.colorfulness), D-0011 (dials.warmth), D-0022 (raw.brandColor), D-0027 (answers.Q-theme-01), D-0031 (answers.Q-color-02).

</details>

## Typography

> Zoom: broad (1 of 3), 1 decision in this area. To zoom in, answer Q-type-02, Q-type-03, Q-type-04.
<!-- od:zoom area=typography level=1 -->

**Body text is 17px, and each larger size is about 1.25 times the one below.**
Designers: type scale: base size and ratio · Code: `font.size.14`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Should it use the device's built-in font, a free plain font like Inter, or your brand font? **Brand font for headlines, system font for body (Apple's advice)** (delegated; tokens; Q-type-01)

**Intent.** Body text is 17px; sizes follow `round(17 x 1.25^n)` for n from -2 to 4, reaching about 2.5x body (marketing surfaces in scope). Sizes: 14, 17, 21, 27, 33, 42px.

- Text face: -apple-system, PingFang SC, Hiragino Sans GB, Noto Sans SC, Microsoft YaHei, Roboto, Helvetica Neue, Arial, sans-serif. Licence status (hook H-type): **pending**. A system font needs no licence; it must not be embedded in apps.
- Licence by platform: text: system (open licence or system font: web, apps and self-hosting); display: system (open licence or system font: web, apps and self-hosting).
- On iOS the Swift file uses Dynamic Type text styles (body 17 pt), so text follows the person's text size setting. Compose uses sp, which follows the Android font scale.
- Weights: body 400, label 400, heading 600 (two or three distinct weights per view).
- Emphasized variants: off (they turn on at Expression 67 and up, DC-L02-11).
- Line heights snap to a 4px grid: 1.5 up to 17px, 1.4 to 26px, 1.25 to 44px, 1.12 above.
- Letter spacing, one value per job (`font.tracking.*`): +0.02em at 11-12px, 0 for body, -0.01em from 32px, -0.02em from 48px.
- Capitals never get negative tracking: small capital labels +0.06em, capital headings 0 to +0.02em. Set `font` and `letter-spacing` together, or use the `.ds-text-*` classes: the `font` shorthand alone drops tracking.
- Text scaling: CSS sizes are rem, line heights unitless, so text scales to 200% (WCAG 1.4.4); containers must grow with it.
- Scripts: Latin only; add scripts in raw.scripts to get per-script line heights (DC-L02-25).
- Display scale (marketing surfaces): its own fluid sizes, `text.display.md` 32px on a phone to 48px at 1280px; `text.display.lg` 40px on a phone to 96px at 1280px. The hero takes at most two lines; section titles use `text.display.md`.
- Per page: at most 8 sizes, 3 weights (400, 600) and 2 families, whole px only (`limits` in `tokens/opendesigner.meta.json`).

| Style | Size/line (px) | Weight | Tracking | Use |
|---|---|---|---|---|
| `text.body.lg` | 21/28 | 400 | 0em | Long-form reading, onboarding copy. |
| `text.body.md` | 17/24 | 400 | 0em | Default UI text: forms, tables, descriptions. |
| `text.body.sm` | 14/20 | 400 | 0em | Helper text, timestamps, captions. |
| `text.code.md` | 17/24 | 400 | 0em | Code blocks, token names. |
| `text.code.sm` | 14/20 | 400 | 0em | Inline values, dense code rows. |
| `text.display.lg` | 96/108 | 600 | -0.02em | The hero line: one per page, at most two lines. |
| `text.display.md` | 48/52 | 600 | -0.02em | Section titles on marketing pages; one per section. |
| `text.headline.md` | 42/52 | 600 | -0.01em | Page and section titles. |
| `text.headline.sm` | 33/40 | 600 | -0.01em | Page and section titles. |
| `text.label.lg` | 17/24 | 400 | 0em | Button and control labels. |
| `text.label.md` | 14/20 | 400 | 0em | Small control labels, badges, dense tabs. |
| `text.label.sm` | 14/20 | 400 | 0.06em caps | Overlines in capitals with wide tracking (DC-L02-18). |
| `text.numeric.lg` | 27/32 | 600 | 0em | Key numbers: balances, KPIs. |
| `text.numeric.md` | 17/24 | 400 | 0em | Amounts and table figures: tabular digits line up in columns; right-align numeric columns. |
| `text.title.lg` | 27/32 | 600 | 0em | Card, panel and group titles. |
| `text.title.md` | 21/28 | 600 | 0em | Card, panel and group titles. |
| `text.title.sm` | 17/24 | 600 | 0em | Table headers, field-group titles. |

**Use / avoid.**
- Use at most three sizes and two weights in one view; let color and weight carry hierarchy before size.
- Avoid all caps for sentences and in scripts without case; use weight for emphasis there.

**Tailwind classes:** `text-body-md`, `text-label-lg`, `text-title-md`, `text-headline-md`.

Decisions: D-0032 (answers.Q-type-01).

</details>

## Layout

> Zoom: sketch (0 of 3), 1 decision in this area. To zoom in, answer Q-space-01, Q-space-02, Q-space-03.
<!-- od:zoom area=layout level=0 -->

**Spacing comes in steps of 4px, and screens use spacious spacing by default.**
Designers: spacing scale, 0 to 96 · Code: `space.0 to space.96`

<details><summary>More</summary>

**Intent.** Everything sits on a 4px unit: ladder 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Density is a mode on the semantic layer (default **spacious**). Primitives and minimum tap areas never change.

| Density | inset xs/sm/md/lg/xl | section sm/md/lg | control sm/md/lg | row sm/md/lg/two-line | outer:inner |
|---|---|---|---|---|---|
| spacious (default) | 6 / 12 / 16 / 20 / 32 | 64 / 80 / 96 | 40 / 48 / 56 | 52 / 56 / 64 / 80 | 3.5 |
| comfortable | 4 / 8 / 12 / 16 / 24 | 32 / 40 / 64 | 32 / 40 / 48 | 44 / 48 / 56 / 72 | 2.5 |
| compact | 2 / 6 / 8 / 12 / 20 | 16 / 24 / 40 | 24 / 32 / 40 | 36 / 40 / 48 / 64 | 2.0 |

- Target sizes: pointer 24px, touch 48px; `size.target.min` is the floor for the primary input, and `space.target.gap` separates adjacent targets.
- Inner gaps stay below outer gaps (at least half), so grouping reads without borders (L15 P16).
- One container for the whole site: `layout.container.max` (1280px). Columns 4 / 8 / 12 (`layout.columns.*`), gutters 16 / 24px, margins 16 / 24px; paragraphs at most 65ch (`layout.measure.prose`), leads 52ch (DC-L03-15, DC-L03-16, DC-L02-17).
- Alignment: A centred hero is fine; within a section the heading and its content share one alignment.

**Use / avoid.**
- Parents own spacing (padding and gap); children never set outer margins.
- Avoid values off the ladder; if one is needed, add it as a decision.

Decisions: D-0008 (dials.density).

</details>

## Elevation & Depth

> Zoom: sketch (0 of 3), 1 decision in this area. To zoom in, answer Q-depth-01.
<!-- od:zoom area=elevation level=0 -->

**Surfaces are separated by thin borders, with no shadows.**
Designers: flat, shadowed, tonal or glass · Code: `$extensions.opendesigner.model`

<details><summary>More</summary>

**Intent.** Depth 8/100 selects the **borders** model. Shadow alpha in light mode is 0.0; dark mode doubles it and lifts surfaces by lightness instead (sunken, base, raised, overlay).

| Token | Layers (x y blur spread) | Use |
|---|---|---|
| `elevation.raised` | none | Cards that lift on hover, sticky headers, dragged rows. |
| `elevation.floating` | none | Menus, popovers, dropdowns. |
| `elevation.overlay` | none | Dialogs and sheets (with color.overlay.scrim). |

- Borders: 1px default, 2px selected and focus, 4px emphasis; width changes use an inset shadow so layout does not jump.
- Stacking: page < raised < floating (menus) < overlay (dialogs with `color.overlay.scrim`).
- No materials or glass in this system.

Decisions: D-0009 (dials.depth).

</details>

## Shapes

> Zoom: sketch (0 of 3), 2 decisions in this area. To zoom in, answer Q-shape-01.
<!-- od:zoom area=shape level=0 -->

**Buttons and fields have 0px corners; cards have 0px corners.**
Designers: corner radius, sharp to pill · Code: `radius.control, CSS border-radius`

<details><summary>More</summary>

**Intent.** Roundness 6/100 gives controls a **0** radius; details 0px, containers 0px, overlays 0px, people full. Controls under 32px tall use `radius.control-sm` (0).
Buttons are **square**; square and pill corners are a choice (Q-shape-01), never a default.

- One corner per kind of thing: `radius.control` for buttons and CTAs, inputs, selects, chips, toggles, tabs, carousel arrows; `radius.container` for cards, panels, photos and media; `radius.overlay` for dialogs, sheets, popovers; `radius.detail` for checkboxes, tags, small badges; `radius.person` for avatars, dots and status pips only.
- Nested radius: inner = max(outer - padding, smallest step). Here it is 0px inside a container with `space.inset.lg` padding. Equal radii on nested shapes look uneven (DC-L04-05).
- Focus ring: 2px, 2px offset, radius = control radius + offset (0).
- Icons: sharp corners, square caps.
- Corners (Q-shape-04, DC-L04-04): the radii are the same everywhere; iOS draws them continuous (`DS.Radius.shape(...)`, `.continuous`), Android circular (`RoundedCornerShape`), the web and Figma circular.
- Signature shapes: none generated; a brand shape library is a designer asset (hook H-motif).

Decisions: D-0007 (dials.roundness), D-0045 (overrides.radius.panel).

</details>

## Components

> Zoom: sketch (0 of 3), 0 decisions in this area. To zoom in, answer Q-comp-01, Q-comp-02, Q-state-01.
<!-- od:zoom area=components level=0 -->

**Version 1 plans 25 components, all built from these tokens.**
Designers: core set of about 25 components · Code: `button.* (proposed), APG pattern`

<details><summary>More</summary>

**Intent.** v1 components use the semantic tokens only. Base: not chosen yet (Q-comp-01). Buttons are 48px tall (spacious), 0 radius, `text.label.lg`; one primary action per view. Calls to action on marketing pages: `size.control.cta` (56px), `text.label.lg` in sentence case, one filled per view; the others outline or text.

| Component | Status |
|---|---|
| button | planned (tokens ready) |
| text-field | planned (tokens ready) |
| textarea | planned (tokens ready) |
| select | planned (tokens ready) |
| checkbox | planned (tokens ready) |
| radio | planned (tokens ready) |
| switch | planned (tokens ready) |
| slider | planned (tokens ready) |
| tabs | planned (tokens ready) |
| tooltip | planned (tokens ready) |
| popover | planned (tokens ready) |
| dialog | planned (tokens ready) |
| menu | planned (tokens ready) |
| progress-bar | planned (tokens ready) |
| spinner | planned (tokens ready) |
| banner | planned (tokens ready) |
| badge | planned (tokens ready) |
| avatar | planned (tokens ready) |
| card | planned (tokens ready) |
| list | planned (tokens ready) |
| table | planned (tokens ready) |
| link | planned (tokens ready) |
| breadcrumbs | planned (tokens ready) |
| side-navigation | planned (tokens ready) |
| accordion | planned (tokens ready) |

**Contested policies:** Validation timing and disabled submit: pending; Field style: pending; Toasts: pending; Undo versus confirm: pending; Danger actions: pending; Button emphasis levels: pending.

**Tables** (defaults; Q-pattern-07 changes them):
- Rows: a 1px `color.border.subtle` line between rows, none around the table (Carbon's default).
- Row heights: `size.row.sm` (dense), `size.row.md` (default), `size.row.lg` (roomy) and `size.row.two-line`; the header row matches the body rows (Carbon, S-L08-092).
- Header: stays in view while the rows scroll (`position: sticky`), with a scroll-edge fade where rows pass under it, never a 1px line (STD-visual-details-15).
- Numbers: right-aligned in `text.numeric.*` (tabular digits), and their column headers right-aligned too, so digits line up and compare at a glance (DC-L19-121, DC-L02-26).
- Text, status chips, row checkboxes and targets follow the same tokens as the rest of the system; a chip carries a word, never color alone (WCAG 1.4.1).

**Use / avoid.**
- Every interactive component shows hover, pressed, focus-visible and disabled states from the tokens.
- Inputs keep a 3:1 boundary (`color.border.input`); signifier strength: minimal-allowed.
- Component docs belong in `opendesigner/components/<name>.md` (spec 7.8).

Decisions: none recorded yet; values are defaults from references/levers.json.

</details>

## States

**Every screen says what is happening while it loads, when it is empty, and when something goes wrong.** The overview draws each one with these tokens.

- **Waiting** (Q-state-08, not decided yet: the default is shown): Nothing under 1 second; a looping sign from 1 to 10 seconds; percent done over 10 seconds. No tokens until it is answered: `engine.py pick Q-state-08 <option>`.
- **Empty screens** (Q-pattern-04, not decided yet: the default is shown): Each empty screen says which kind it is (first use, cleared, no results, no permission, error), why it is empty, and one next step. No tokens until it is answered: `engine.py pick Q-pattern-04 <option>`.
- **Errors** (Q-form-03, not decided yet: the default is shown): Each error sits next to the field it is about. No tokens until it is answered: `engine.py pick Q-form-03 <option>`.
- **Not found (404) and offline**: a page that says what happened in one line and offers a way on (home, search or retry), in the page's own layout, never a dead end.
- **Every screen that shows data** has its loading, empty and error state before it ships; skeletons take the final layout's shape, so nothing jumps when the content arrives. Reduced motion stops the skeleton shimmer.

## Do's and Don'ts

**These rules keep screens clear and easy to read.** The engine checks the ones it can.
Designers: guardrails and design linting · Code: `engine.py validate, engine.py review`

<details><summary>More</summary>

**Enforced by construction.** The generator cannot break these:
- text contrast 4.5:1, and 3:1 for edges, in every mode
- text on colored fills picked automatically
- tap areas pointer 24px, touch 48px
- a 2px focus ring with a 2px offset
- a reduced-motion mode
- inner spacing smaller than outer spacing, three text colors, and nested radii

**Do**
- Use semantic tokens; never raw hex, px or ms values in components.
- Keep one primary action per view and at most three type sizes per view.
- Pair every status color with an icon or label; underline links in running text.

**Don't**
- Don't shrink hit areas in dense layouts; shrink visuals and extend the hit area.
- Don't use motion as the only signal, or flash more than three times a second.
- Don't copy another brand's identity from a reference (colors, typeface, logo, imagery, copy).

**Current validation findings:** none (errors 0, warnings 0).

**Waivers:** none.

</details>

## Standards

**Follow these rules when you build.** They come from sources marked non-negotiable, their values are locked, and `engine.py review` checks the ones it can.

House standards v4: 450 rules followed in this project.

**Don't break these:**
- No motion on 100+ times-a-day actions (STD-when-to-animate-05).
- Never use ease-in on UI (STD-easing-duration-03).
- Never enter from scale(0) (STD-enter-exit-origin-01).
- Never use transition: all (STD-performance-properties-06).
- Never disable pinch zoom (STD-accessibility-motion-27).

<details><summary>Every theme (288 rules)</summary>

- **When to animate** (15 rules, 13 must): Decide whether to animate first; Name a valid purpose for every animation; Scale motion down as frequency rises; No motion on 100+ times-a-day actions; Never animate keyboard-initiated actions; Remove or shrink motion seen tens-of-times daily; Spend delight only on rare moments; Explanatory motion only in marketing, onboarding; and 5 more must rules. Locks `motion.duration.instant` 0ms.
- **Easing and duration** (12 rules, 10 must): Pick easing by the motion's job; Strong custom curves, not built-in keywords; Never use ease-in on UI; UI motion under 300ms unless justified; Duration budget for each element; Nothing over 1s unless illustrative; Duration grows with size and distance; Slow deliberate phase, snappy response; and 2 more must rules. Locks `motion.easing.linear` [0, 0, 1, 1], `motion.easing.hover` [0.25, 0.1, 0.25, 1], `motion.easing.enter` [0.23, 1, 0.32, 1], `motion.easing.exit` [0.23, 1, 0.32, 1], `motion.easing.standard` [0.77, 0, 0.175, 1], `motion.duration.micro` 100ms, `motion.duration.short` 150ms, `motion.duration.medium` 200ms, `motion.duration.long` 250ms.
- **Enter, exit and origin** (31 rules, 18 must): Never enter from scale(0); No opacity-only fade entrances; Scale popovers from their trigger; Keep modals scaling from center; Exit the way it entered; Dropdowns and popovers: scale 0.95, 200ms; Tooltips: scale 0.97, 125ms; Delay only the first tooltip; and 10 more must rules. Locks `motion.scale.enter` 0.95, `motion.duration.medium` 200ms (STD-easing-duration-07 wins), `motion.duration.tooltip` 125ms, `motion.scale.enter-tooltip` 0.97, `motion.duration.instant` 0ms (STD-when-to-animate-05 wins), `motion.duration.modal` 250ms, `motion.scale.enter-modal` 0.96, `motion.duration.stagger` 50ms, `motion.duration.reveal` 600ms, `motion.blur.crossfade` 2px, `motion.easing.drawer` [0.32, 0.72, 0, 1], `motion.duration.drawer` 500ms.
- **Springs and gestures** (33 rules, 21 must): Springs for anything a finger drives; Default springs are critically damped; Bounce only after a momentum gesture; Keep bounce subtle, 0.1 to 0.3; Sheet and drawer spring values; Every animation can be grabbed mid-flight; Never block input during transitions; Start from the on-screen value; and 13 more must rules. Locks `motion.spring.spatial.dampingRatio` 1.0, `motion.spring.spatial.stiffness` 246.7, `motion.spring.momentum` a composite value (see standards.md), `motion.spring.sheet` a composite value (see standards.md), `motion.spring.rotation` a composite value (see standards.md), `motion.gesture.deceleration-rate` 0.998, `motion.gesture.dismiss-velocity` 0.11, `motion.gesture.rubberband-constant` 0.55, `motion.gesture.direction-threshold` 10px.
- **Performance and properties** (17 rules, 11 must): Animate only transform and opacity; Only clip-path, accordion height, childless width; Never use transition: all; Motion: animate the full transform string; Keep per-frame values out of React state; Set drag transforms on the moving element; Pick the cheapest animation tool; Treat dropped frames as a regression; and 3 more must rules.
- **Accessibility in motion** (20 rules, 12 must): Ship reduced motion with the animation; Reduced motion is gentler, never zero; Check reduced motion by toggling it; Reduced transparency makes surfaces solid; Increased contrast gets solid, bordered surfaces; Scale layout with the user's text size; Gate hover motion to fine pointers; Build overlays on accessible primitives; and 4 more must rules. Locks `raw.reducedMotion` "replace", `motion.duration.reduced-fade` 200ms, `reduced:motion.transition.enter` a composite value (see standards.md), `reduced:motion.transition.exit` a composite value (see standards.md), `reduced:motion.transition.expand` a composite value (see standards.md).
- **Toasts, drawers and overlays** (41 rules, 14 must): Fill gaps between toasts for hover; Pause toast timers in a hidden tab; Toast classNames need !important; Copy Sonner styles into shadow DOM; Drawer curve: cubic-bezier(0.32, 0.72, 0, 1); Feedback on press, commit on release; Hold to confirm: slow press, fast release; React Native toasts: 300ms in, 250ms out; and 6 more must rules. Locks `motion.duration.toast` 400ms, `motion.easing.toast` [0.25, 0.1, 0.25, 1], `component.toast.gap` 14px, `component.toast.visible` 3, `component.toast.duration` 4000ms, `component.toast.offset.desktop` 32px, `component.toast.offset.mobile` 16px, `motion.easing.drawer` [0.32, 0.72, 0, 1] (STD-enter-exit-origin-41 wins), `motion.gesture.drag-lock-after-scroll` 100ms.
- **Mobile and touch** (37 rules, 30 must): Detect touch by capability, never by device; Remove the tap highlight flash globally; Press feedback scales to 0.97, briefly; Remove the tap delay on tappables; Touch targets 44pt on iOS, 48dp on Android; Size full-height layouts with dvh and svh; Form inputs at 16px or larger; Contain overscroll in app layouts; and 22 more must rules. Locks `motion.scale.press` 0.97, `motion.duration.micro` 100ms (STD-easing-duration-07 wins), `size.target.min` 44px, `font.size.input` 16px, `motion.spring.spatial.dampingRatio` 1.0 (STD-springs-gestures-04 wins).
- **Visual details** (53 rules, 23 must): Cap body text near 65ch; Tabular digits for changing numbers; Use the ellipsis character; Loosen tracking on uppercase labels; Make letter-spacing specific to size; Reserve underlines for links; Metric-matched fallback font stack; Never stack light translucent surfaces; and 15 more must rules.
- **Process, review and taste** (14 rules, 8 must): Motion that merely runs is not done; Self-check motion before finishing; Report review findings as one table; Close every motion review with Block or Approve; Make the motion call yourself; Keep the motion note to a few lines; Say when feel can't be judged from code; Judge feel on real hardware.
- **Swift** (15 rules, 11 must): Check the Swift toolchain first; Simplest, most static thing first; Value types by default; Make invalid states unrepresentable; Main actor first, then step down; Enable Approachable Concurrency everywhere; MainActor default isolation for app modules; Libraries ship nonisolated APIs; and 3 more must rules.

</details>

Every rule, with its values, reasons and sources: `opendesigner/standards.md` (it also has the 162 rules this file leaves out). Read the themes you touch before you build.

## Motion

> Zoom: broad (1 of 3), 5 decisions in this area. To zoom in, answer Q-motion-07, Q-motion-08.
<!-- od:zoom area=motion level=1 -->

**Most movements take 200ms.** They turn into fades when a person asks for less motion.
Designers: motion system: duration, easing, springs · Code: `motion.duration.*, motion.easing.*`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Should motion be quick and barely seen, calm with a few bold moments, or physical and bouncy? **Plain for most actions, bold for 1-3 key moments per flow (Carbon expressive; Material standard vs expressive schemes)** (delegated; tokens; Q-motion-01)

**Intent.** Energy 20/100: the duration multiplier x0.88 scales the extra step (standards fix medium, long). Standard easing `cubic-bezier(0.77, 0, 0.175, 1)`, enter `cubic-bezier(0.23, 1, 0.32, 1)`, exit `cubic-bezier(0.23, 1, 0.32, 1)`. Spatial spring: damping 1.0, stiffness 246.7 (Apple duration 0.4s, bounce 0.0; web `linear()` sample over 590ms).

| Token | Value | Note |
|---|---|---|
| `motion.duration.instant` | 0ms | set by house standard STD-when-to-animate-05 |
| `motion.duration.micro` | 100ms | set by house standard STD-easing-duration-07 |
| `motion.duration.short` | 150ms | set by house standard STD-easing-duration-07 |
| `motion.duration.medium` | 200ms | set by house standard STD-easing-duration-07 |
| `motion.duration.long` | 250ms | set by house standard STD-easing-duration-07 |
| `motion.duration.extra` | 620ms | illustrative and marketing motion only, never UI (STD-easing-duration-06) |
| `motion.duration.medium-exit` | 160ms | derived: about 0.8 x medium |
| `motion.duration.long-exit` | 200ms | derived: about 0.8 x long |
| `motion.duration.drawer` | 500ms | set by house standard STD-enter-exit-origin-41 |
| `motion.duration.modal` | 250ms | set by house standard STD-enter-exit-origin-11 |
| `motion.duration.page` | 320ms | your value |
| `motion.duration.reduced-fade` | 200ms | set by house standard STD-accessibility-motion-02 |
| `motion.duration.reveal` | 600ms | set by house standard STD-enter-exit-origin-26 |
| `motion.duration.stagger` | 50ms | set by house standard STD-enter-exit-origin-13 |
| `motion.duration.toast` | 400ms | set by house standard STD-components-toasts-drawers-07 |
| `motion.duration.tooltip` | 125ms | set by house standard STD-enter-exit-origin-09 |

- Exits are derived, not set on their own: each is about 20% shorter than the entrance in force (medium-exit 160ms from medium 200ms, long-exit 200ms from long 250ms; STD-easing-duration-11). Change an entrance and its exit follows. Linear easing only for spinners and progress.
- Reduced motion (`prefers-reduced-motion` or `data-motion="reduced"`): travel becomes opacity, feedback stays, `motion.transition.move` is 0ms.
- Springs are stored as damping and stiffness in `$extensions.opendesigner.spring` because DTCG 2025.10 has no spring type.
- Haptics: light intensity where the platform has them; sound: hook H-sound is pending.

Decisions: D-0006 (34 values, standards), D-0033 (answers.Q-motion-01), D-0037 (dials.energy), D-0041 (overrides.motion.distance.reveal), D-0043 (overrides.motion.distance.photo-zoom), D-0044 (overrides.motion.duration.page).

</details>

## Modes and Themes

> Zoom: sketch (0 of 3), 1 decision in this area. To zoom in, answer Q-theme-03.
<!-- od:zoom area=modes level=0 -->

**The system has light and dark color modes, three spacing densities and a reduced-motion mode.**
Designers: modes: light, dark, density, motion · Code: `resolver modifiers, Figma collection modes`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Should the app have light and dark modes that follow the device, or just one mode? **Light and dark, matching the device setting** (delegated; tokens; Q-theme-01)

**Intent.** Modes live in the DTCG resolver (`opendesigner/tokens/opendesigner.resolver.json`); modifiers are orthogonal, so no two set the same token.

| Modifier | Contexts | Default |
|---|---|---|
| theme | light, dark | light |
| density | spacious, comfortable, compact | spacious |
| motion | standard, reduced | standard |

- Web: `prefers-color-scheme` with a `[data-theme]` override; `[data-density]`; `prefers-reduced-motion` with `[data-motion]` (see `opendesigner/build/css/tokens.css`).
- High-contrast themes are not generated; set `raw.contrastTarget` to AAA for 7:1 text everywhere.
- A second brand or a client re-skin may override the color primitives and `color.bg.brand`; semantic names never change.

Decisions: D-0027 (answers.Q-theme-01).

</details>

## Iconography and Imagery

> Zoom: sketch (0 of 3), 1 decision in this area. To zoom in, answer Q-icon-01, Q-icon-02, Q-icon-06.
<!-- od:zoom area=iconography level=0 -->

**Icons are 24px by default.** The logo, photos and custom icons come from a person, not from the engine.
Designers: icon system: style, sizes, color · Code: `size.icon.*, icon.stroke.*, color.icon.*`

<details><summary>More</summary>

**Intent.** Default icon size 24px; sizes 16/20/24 pair with 14/16/20px text. Stroke follows the label weight: 1.5px at 16, 1.5px at 20, 2.0px at 24. Rest style: outline.

| Asset | Hook | Status |
|---|---|---|
| Logo and marks | H-logo | pending |
| Favicon set | H-favicon | pending |
| App icon | H-appicon | pending |
| Custom icons | H-icons | pending |
| Illustration | H-illus | pending |
| Photography | H-photo | open-library |
| Motifs and brand shapes | H-motif | pending |

- Placeholders are labelled as placeholders. A generated stand-in is never shown as a finished brand asset.
- Icon-only buttons need an accessible name and a hit area of `size.target.min`.

Decisions: D-0040 (hooks.H-photo.status).

</details>

## Content and Voice

> Zoom: sketch (0 of 3), 0 decisions in this area. To zoom in, answer Q-voice-01, Q-voice-02, Q-voice-03.
<!-- od:zoom area=content level=0 -->

**Words stay plain and short, and every button says what it does.**
Designers: content: voice, tone, microcopy · Code: `DESIGN.md Content and Voice section`

<details><summary>More</summary>

**Intent.** Draft: voice guidance level **none** (Brand presence 20); **sentence-case**; contractions **allowed** (Warmth 50). Voice guide hook H-voice: pending.

- Buttons say what they do in two to four words; errors say what happened and how to fix it.
- Reading level: plain language; avoid jargon in UI copy.
- Word list: not recorded yet (Q-voice-03).

Decisions: none recorded yet; values are defaults from references/levers.json.

</details>

## Accessibility

> Zoom: sketch (0 of 3), 0 decisions in this area. To zoom in, answer Q-aud-02, Q-aud-03, Q-aud-04.
<!-- od:zoom area=accessibility level=0 -->

**Text passes WCAG 2.2 AA contrast in every mode, and focus is always visible.**
Designers: WCAG 2.2 AA target · Code: `raw.contrastTarget`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Who uses it, and how often: all day for work, often, or now and then on the go? **Now and then, on a phone or in public** (chosen; tokens; Q-aud-01)

**Intent.** Standard: WCAG 2.2 AA. APCA is reported as advice only.

**The system guarantees:**
- text and edge contrast in every mode
- visible focus (2px ring, 2px offset, 3:1)
- minimum target sizes for each kind of input
- a reduced-motion mode
- rem-based type, so text scales to 200%
- text on colored fills chosen automatically

**Product teams own:** accessible names and labels, alt text, reading and focus order, and never using color alone. Also: clear error messages, dialogs that can be closed, no pre-checked consent boxes, and captions for media.

**Test on each platform:**
- keyboard only
- a screen reader (VoiceOver, NVDA or TalkBack)
- 200% zoom
- forced colors (Windows High Contrast)
- reduced motion
- touch on a phone, for every surface that allows touch

Decisions: none recorded yet; values are defaults from references/levers.json.

</details>

## Platforms and Devices

> Zoom: sketch (0 of 3), 1 decision in this area. To zoom in, answer Q-plat-05, Q-plat-10, Q-plat-08.
<!-- od:zoom area=platforms level=0 -->

**It runs on ios, android, web, and each platform keeps its own navigation.**
Designers: target platforms · Code: `raw.platforms; size.target.min`

<details><summary>More</summary>

**Your answers here** (each one either sets tokens or is a rule for this section):
- Where will it run first: web, iOS, Android or desktop? **iOS/iPadOS, Android, Web** (chosen; tokens; Q-plat-01)

**Intent.** Platforms: ios, android, web. Inputs: pointer, touch. Brand presence 20: each platform keeps its own shapes and materials: yes; each platform keeps its own body text size: yes.

- Navigation, back, sheets and pickers stay native on every platform (DC-L10-02).
- Code files in `opendesigner/build/`: css, tailwind, swift, compose (each uses the same token names, and Figma code syntax matches them).
- Fonts by platform: text: system (open licence or system font: web, apps and self-hosting); display: system (open licence or system font: web, apps and self-hosting).

Decisions: D-0023 (answers.Q-plat-01).

</details>

## Decisions

**46 decisions so far.** Each one says who set it and why.
Designers: decision history with reasons · Code: `opendesigner/decisions.md`

<details><summary>More</summary>

Your own decisions first (the newest value per path), then your changes to standards, then one row per standards batch. Full log: `opendesigner/decisions.md`.

| Id | Path | Value | Set by | Reason |
|---|---|---|---|---|
| D-0007 | `dials.roundness` | 6 | reference | from reference lacquer-gallery (medium confidence): most common control radius 0.0 -> A5 band |
| D-0008 | `dials.density` | 27 | reference | from reference lacquer-gallery (medium confidence): body 17.0px, 32% of the height blank -> A3 bands |
| D-0009 | `dials.depth` | 8 | reference | from reference lacquer-gallery (medium confidence): borders -> A6 bands |
| D-0010 | `dials.colorfulness` | 45 | reference | from reference lacquer-gallery (high confidence): top accent HCT chroma 62.1, 3.9% of the page in colour -> A7 anchors |
| D-0011 | `dials.warmth` | 50 | reference | from reference lacquer-gallery (high confidence): neutral tint chroma 0.0 at hue 90.0 -> A8 anchors |
| D-0012 | `context.product` | "a WeChat Mini Program for the clients of Shantung, a Shandong luxury maison (silk scarves, ties, Laoshan green tea), plus the iPad tools its boutiques use: the advisors portal and an entrance kiosk" | assumed | from the owner's description of the product |
| D-0016 | `answers.Q-scope-07` | "building" | assumed | the repo is a running skeleton with no screens yet; the Dockerfile is for local dev, not a launch |
| D-0018 | `raw.stack` | ["react"] | assumed | Taro (React) for the Mini Program and Vite + React for the iPad screens, from apps/*/package.json |
| D-0020 | `answers.Q-aud-01` | "large" | chosen | sketch: Level 0 answer |
| D-0021 | `context.audience` | "people who use it now and then, often on a phone" | assumed | sketch: plain words for Q-aud-01 |
| D-0022 | `raw.brandColor` | "#932b1e" | delegated | sketch: picked for them |
| D-0023 | `answers.Q-plat-01` | ["ios", "android", "web"] | chosen | sketch: Level 0 answer |
| D-0024 | `macros` | ["premium", "heritage", "deferential", "minimal"] | delegated | sketch: picked for them (feel words: premium, heritage, calm, minimal) |
| D-0025 | `taste.feelWords` | ["premium", "heritage", "calm", "minimal"] | delegated | sketch: feel words picked for them |
| D-0026 | `taste.brief` | "dark red, black and white, with sunny clear-blue-sky Chinese architecture" | chosen | sketch: the person's picture of the look |
| D-0027 | `answers.Q-theme-01` | "system-light-dark" | delegated | sketch: picked for them |
| D-0028 | `answers.Q-scope-06` | ["mini program:experience", "advisor portal:operate", "entrance kiosk:experience"] | chosen | sketch: Level 0 answer |
| D-0030 | `answers.Q-dir-01` | "flat2" | delegated | delegated: flat surfaces with thin rules over tonal or glass, matching the measured reference (no shadows, 1px lines); to undo, pick Q-dir-01 again |
| D-0031 | `answers.Q-color-02` | "signature-surface" | delegated | delegated: red stays rare (about 4% of the page) but owns full-width bands (salons, limited releases, the Brocade card) over accent-only; to undo, pick... |
| D-0032 | `answers.Q-type-01` | "brand-display" | delegated | delegated: a free luxury serif for titles and labels, the device font for running text (PingFang/Songti keep Chinese fast, nothing heavy to load in WeChat)... |
| D-0033 | `answers.Q-motion-01` | "two-mode" | delegated | delegated: plain, calm motion for most actions and slow, polished moments for a few (tier card reveal, gallery entrances) over springs; owner asked for... |
| D-0036 | `raw.fontLicence` | {"web": true, "app": true, "selfHost": true} | delegated | Cormorant Garamond is SIL Open Font License 1.1: web, app and self-hosting allowed |
| D-0037 | `dials.energy` | 20 | delegated | delegated: calm and slow (owner: smooth, premium); no bounce |
| D-0038 | `font.family.display` | ["Cormorant Garamond", "Songti SC", "Noto Serif SC", "Noto Serif CJK SC", "serif"] | delegated | delegated: Cormorant Garamond (SIL OFL) is an open old-style serif of the same class as the measured reference display face; Chinese titles fall back to the... |
| D-0039 | `font.family.text` | ["-apple-system", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", "Roboto", "Helvetica Neue", "Arial", "sans-serif"] | delegated | delegated: the device's own sans for running text, with Chinese system faces early so zh-Hans never falls back to a Japanese face |
| D-0040 | `hooks.H-photo.status` | "open-library" | delegated | 27 open-licence photos from Wikimedia Commons (CC0, PD, CC BY, CC BY-SA), reviewed for brands and people, credits in apps/cms/seed/photos/CREDITS.md; a real... |
| D-0041 | `motion.distance.reveal` | {"value": 12, "unit": "px"} | delegated | house rule: entrances rise 12px while fading in |
| D-0042 | `font.tracking.caps-display` | 0.04 | delegated | delegated: serif capitals in titles and navigation read luxurious with air between letters (measured reference); 0.01em was too tight for Cormorant caps |
| D-0043 | `motion.distance.photo-zoom` | {"value": 16, "unit": "px"} | delegated | house rule: photos settle into place as they enter; expressed as a 16px zoom inset (scale 1.04 on a ~400px photo) because the token set has no scale type |
| D-0044 | `motion.duration.page` | {"value": 320, "unit": "ms"} | chosen | owner: page changes need a quick but visible entrance |
| D-0045 | `radius.panel` | "{radius.16}" | chosen | A panel floating over a full-bleed photo (the kiosk card) is rounded so it reads as an object, not a flat white plane; other containers stay square |
| D-0046 | `font.size.tag` | {"value": 12, "unit": "px"} | chosen | Tags on small photos (grid cards): 12px caps, a size down from label.sm |
| D-0006 | standards | House standards v4: 291 applied | standard (locked) | OpenDesigner's house standards (sources marked non-negotiable) are applied without asking and locked. Change one only when the person asks: engine.py... |
| D-0014 | standards | House standards v4 for android, compose, css, ios, swift, web: 138 now apply, 0 no longer apply | standard (locked) | The platforms or the stack changed, so the house standards were re-scoped: the ones that now apply are applied and locked; the ones that no longer apply are... |
| D-0015 | standards | House standards: 1 value back to the engine's own for these platforms | standard | The platforms changed, so a value a standard held no longer passes a check the engine enforces (accessibility floors outrank every standard, KNOWLEDGE.md... |
| D-0019 | standards | House standards v4 for android, compose, css, ios, react, swift, web: 21 now apply, 0 no longer apply | standard (locked) | The platforms or the stack changed, so the house standards were re-scoped: the ones that now apply are applied and locked; the ones that no longer apply are... |

</details>

## Open Items

**These parts are still defaults, guesses, or waiting for a person.**

- Still defaults (zoom 0, sketch): Layout, Elevation & Depth, Shapes, Components, Modes and Themes, Iconography and Imagery, Content and Voice, Accessibility, Platforms and Devices
- Assets not final: Logo, wordmark, symbol, lockups (H-logo): pending; App icon (H-appicon): pending; Favicon set (H-favicon): pending; Custom icons, pictograms, spot icons (H-icons): pending; Illustration, characters, empty-state art (H-illus): pending; Brand typeface files (H-type): pending; Fixed brand colors (H-color): pending; Motion signature and rich media (H-motion): pending; Graphic devices, patterns, textures, brand gradients, signature shape (H-motif): pending; UI sounds and sonic logo (H-sound): pending; Custom haptic patterns (H-haptic): pending; Voice and tone guide (H-voice): pending; Brand guidelines PDF (H-brandbook): pending
- Answers taken on assumption or delegated: context.product (assumed), answers.Q-scope-07 (assumed), raw.stack (assumed), context.audience (assumed), raw.brandColor (delegated), macros (delegated), taste.feelWords (delegated), answers.Q-theme-01 (delegated), defaults.persuade (auto_default), answers.Q-dir-01 (delegated), answers.Q-color-02 (delegated), answers.Q-type-01 (delegated), answers.Q-motion-01 (delegated), overrides.font.family.display (delegated), overrides.font.family.text (delegated), raw.fontLicence (delegated), dials.energy (delegated), hooks.H-photo.status (delegated), overrides.motion.distance.reveal (delegated), overrides.font.tracking.caps-display (delegated), overrides.motion.distance.photo-zoom (delegated)
- Waivers: none.
- Licence risks: Photography and art direction: check the terms of the set you use. Stock: Unsplash (free, irrevocable, commercial; no competing service) or Pexels (no implied endorsement, no use as a trademark).
- Validation: 0 errors, 0 warnings.

## For Agents

**AI agents: read this file and the tokens before you change any screen.**

1. Before any visual work, read this file, PRODUCT.md and `opendesigner/tokens/` (start at `opendesigner/tokens/opendesigner.resolver.json`).
2. Use tokens, never raw values: CSS `var(--ds-...)`, Tailwind classes from `opendesigner/build/tailwind/theme.css`, `DS.*` in Swift. In Compose: colors from `LocalDsColors.current` (provide `DsLightColors` or `DsDarkColors`), then `DsSpace`, `DsType` and `DsMotion`.
3. Do not change a locked decision without asking the owner. Keep new screens inside the taste card at the top of the Overview, and never add anything on its Never list without asking.
4. To change the system: `engine.py set <path> <value> --why "..."`, then `engine.py generate`, `engine.py validate`, `engine.py design-md`.
5. To extend: add a decision (never hand-edit tokens or this file). Keep semantic names the same across modes. Deprecate instead of deleting.
6. Every build: open a round (`engine.py ledger start "<what>" --items ...`), build from the tokens, run `engine.py review`, check the rendered page with opendesigner-review and show screenshots at phone and desktop width, mark each ledger item done or waived (with the owner's words), then re-read this file.
7. Follow the Standards section. Change a standard only when the person explicitly asks: `engine.py standard override <id> --why "<their words>"`.

**Tailwind v4 classes** (one import: `@import "tailwindcss"; @import "<path>/opendesigner/build/tailwind/theme.css";`; Tailwind's default colors, text sizes, radii and shadows are switched off, so only these exist). They need a Tailwind build that imports that file. In plain HTML with no build step, use the CSS name beside each class from `opendesigner/build/css/tokens.css`; never load Tailwind from a CDN script. Each row is one token under its two names:

| Area | Tailwind class | Plain CSS (no build step) |
|---|---|---|
| Color | `bg-action-primary` | `var(--ds-color-bg-action-primary)` |
| Color | `hover:bg-action-primary-hover` | `var(--ds-color-bg-action-primary-hover)` |
| Color | `active:bg-action-primary-pressed` | `var(--ds-color-bg-action-primary-pressed)` |
| Color | `text-on-action` | `var(--ds-color-text-on-action)` |
| Color | `bg-surface-base` | `var(--ds-color-surface-base)` |
| Color | `bg-surface-raised` | `var(--ds-color-surface-raised)` |
| Color | `text-fg-primary` | `var(--ds-color-text-primary)` |
| Color | `text-fg-secondary` | `var(--ds-color-text-secondary)` |
| Color | `text-fg-link` | `var(--ds-color-text-link)` |
| Color | `border-line-subtle` | `var(--ds-color-border-subtle)` |
| Color | `border-line-input` | `var(--ds-color-border-input)` |
| Color | `outline-line-focus` | `var(--ds-color-border-focus)` |
| Color | `bg-danger-bold` | `var(--ds-color-bg-danger-bold)` |
| Layout | `p-inset-md` | `var(--ds-space-inset-md)` |
| Layout | `gap-stack-md` | `var(--ds-space-stack-md)` |
| Layout | `gap-inline-sm` | `var(--ds-space-inline-sm)` |
| Layout | `h-control-md` | `var(--ds-size-control-md)` |
| Layout | `size-icon-md` | `var(--ds-size-icon-md)` |
| Layout | `min-h-target-min` | `var(--ds-size-target-min)` |
| Shape | `rounded-control` | `var(--ds-radius-control)` |
| Shape | `rounded-container` | `var(--ds-radius-container)` |
| Shape | `rounded-overlay` | `var(--ds-radius-overlay)` |
| Shape | `rounded-full` | `var(--ds-radius-full)` |
| Elevation | `shadow-raised` | `var(--ds-elevation-raised)` |
| Elevation | `shadow-floating` | `var(--ds-elevation-floating)` |
| Elevation | `shadow-overlay` | `var(--ds-elevation-overlay)` |
| Type | `text-body-md` | `.ds-text-body-md` (a text style class) |
| Type | `text-label-lg` | `.ds-text-label-lg` (a text style class) |
| Type | `text-title-md` | `.ds-text-title-md` (a text style class) |
| Type | `text-headline-md` | `.ds-text-headline-md` (a text style class) |
| Motion | `transition-feedback` | `var(--ds-motion-transition-feedback-duration)` and `var(--ds-motion-transition-feedback-easing)` |
| Motion | `ease-enter` | `var(--ds-motion-easing-enter)` |
| Motion | `ease-exit` | `var(--ds-motion-easing-exit)` |
| Motion | `ease-hover` | `var(--ds-motion-easing-hover)` |
