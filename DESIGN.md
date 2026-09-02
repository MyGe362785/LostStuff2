---
name: LostStuff2 Design System
description: Warm White & Brown Academic Campus Portal Design System
colors:
  primary: "#784D34"
  primary-hover: "#543624"
  accent-caramel: "#A26A4A"
  neutral-paper: "#FAFAF8"
  neutral-cream: "#F5F0EB"
  neutral-sand: "#ECE5DE"
  neutral-tan: "#D8CABF"
  neutral-espresso: "#2D2016"
  status-lost: "#D97706"
  status-lost-bg: "#FEF3C7"
  status-found: "#15803D"
  status-found-bg: "#DCFCE7"
  status-match: "#0284C7"
  status-match-bg: "#E0F2FE"
  status-returned: "#6B7280"
  status-returned-bg: "#F3F4F6"
typography:
  display:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.01em"
  micro:
    fontFamily: "Prompt, Inter, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-paper}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-lost:
    backgroundColor: "{colors.status-lost-bg}"
    textColor: "{colors.status-lost}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.neutral-paper}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: LostStuff2

## Overview

**Creative North Star: "The Warm Campus Sanctuary"**

LostStuff2 adopts a tactile, reassuring, and community-centric aesthetic built upon a **Warm White & Brown** palette. Misplacing an essential personal item (an iPad, dorm keys, student ID, or thesis notes) is an inherently anxious experience. The design system counters that distress with calming, warm alabaster surfaces, rich cocoa typography, earthy caramel accents, and high-trust clarity.

### Key Characteristics:
- **Warmth & Reassurance**: Clean paper white ground (`#FAFAF8`) layered with soft oatmeal cream (`#F5F0EB`) and deep espresso typography (`#2D2016`).
- **High-Contrast Scannability**: Distinct color-coded status badges (Warm Amber for Lost, Emerald for Found/Returned, Cerulean Blue for Auto-Matches).
- **Tactile Soft Geometry**: Generous rounded corners (`24px`), soft warm shadows, and subtle translucent glassmorphic navigation.

---

## Colors

The palette embraces organic, earthy warmth combined with functional university status cues.

### Primary
- **Chestnut Brown** (`#784D34`): Core brand action color for primary buttons, active tabs, and leadership highlights.
- **Mocha Espresso** (`#543624`): Hover state and deep focal surfaces.

### Secondary
- **Warm Caramel** (`#A26A4A`): Accent highlights, focus rings, and spark badges.
- **Warm Latte** (`#B49A85`): Muted secondary text and subtle icons.

### Neutral
- **Paper White** (`#FAFAF8`): Primary background surface.
- **Oatmeal Cream** (`#F5F0EB`): Secondary container background and hero gradient base.
- **Warm Sand** (`#ECE5DE`): Card borders and divider lines.
- **Deep Espresso** (`#2D2016`): High-contrast, readable body and headline text.

### Status Accents
- **Amber Lost** (`#D97706` / bg `#FEF3C7`): Indicates active missing items.
- **Sage Found** (`#15803D` / bg `#DCFCE7`): Indicates found belongings awaiting recovery.
- **Cyan Match** (`#0284C7` / bg `#E0F2FE`): Highlights automatic algorithm matches and confidence scores.

### Named Rules
**The Warm Contrast Rule.** Pure cold blacks (`#000000`) and pure cold grays are forbidden. All dark neutrals must contain a hint of rich roasted coffee/espresso tone (`#2D2016`).

---

## Typography

**Display & Body Font:** Google Fonts **Prompt** (Thai headers, body text, and button labels)  
**Secondary & Numerals:** Google Fonts **Inter** (English metrics, numbers, and badges)

**Character:** Warm, friendly, approachable, yet highly legible across mobile and desktop displays.

### Hierarchy
- **Display** (ExtraBold 800, clamp 2rem-3rem, line-height 1.15): Hero banner headlines.
- **Headline** (Bold 700, 1.5rem, line-height 1.25): Section headers, modal titles.
- **Title** (Bold 700, 1rem, line-height 1.3): Item card titles, notification entries.
- **Body** (Medium 400-500, 0.875rem, line-height 1.5): Item descriptions, helper text, FAQs.
- **Label** (SemiBold 600, 0.75rem, line-height 1.2): Category pills, status badges, timestamps.
- **Caption & Micro** (Bold 700, 0.625rem-0.6875rem / 10px-11px, letter-spacing 0.03em): Micro status indicators, match percentage badges, pill count labels.

---

## Layout

- **Max Container Width**: `1280px` (`max-w-7xl`) centered with responsive gutter padding (`16px` on mobile, `24px` on tablet, `32px` on desktop).
- **Rhythm & Grid**: 12-column responsive grid with `16px` to `24px` gap. Item cards display in a 3-column grid on desktop, 2-column on tablet, and 1-column on mobile.
- **Sticky Glass Navigation**: Fixed top bar (`h-20`) with 92% opacity and 16px backdrop blur.

---

## Elevation & Depth

Surfaces rely on tonal warmth and ambient diffusion rather than harsh drop shadows.

### Shadow Vocabulary
- **Warm Small** (`0 1px 3px rgba(45, 32, 22, 0.06)`): Default state for interactive pills and input bars.
- **Warm Medium** (`0 4px 16px -2px rgba(45, 32, 22, 0.08)`): Item card rest state.
- **Warm Large** (`0 10px 25px -4px rgba(45, 32, 22, 0.1)`): Hover elevation and sticky search bar.
- **Warm XL** (`0 20px 35px -5px rgba(45, 32, 22, 0.12)`): Modal dialogs and dropdown trays.

---

## Shapes

- **Card Radius**: `24px` (`rounded-3xl`) for all primary content containers and cards.
- **Button Radius**: `12px` to `16px` (`rounded-xl` / `rounded-2xl`) for tactile affordance.
- **Badges & Pills**: Full pill geometry (`rounded-full`) for status indicators and language toggles.
- **Borders**: Delicate `1px` stroke in Warm Sand (`#ECE5DE`) on every card to ensure structure without visual weight.

---

## Components

### Buttons
- **Shape:** `rounded-xl` (12px)
- **Primary:** Background Chestnut `#784D34`, text `#FAFAF8`, hover Mocha `#543624`.
- **Lost CTA:** Background `#FEF3C7`, border `#FDE68A`, text `#B45309`.
- **Found CTA:** Background `#784D34`, text `#FAFAF8`, shadow `shadow-warm-sm`.

### Cards
- **Corner Style:** `rounded-3xl` (24px)
- **Background:** Clean Paper `#FAFAF8`
- **Border:** `1px solid rgba(216, 202, 191, 0.8)`
- **Hover:** Elevates with `scale-[1.01]` and `shadow-warm-lg`.

### Status Badges
- **Lost**: Amber capsule (`bg-lost-light text-lost-dark border-lost-border`).
- **Found**: Emerald capsule (`bg-found-light text-found-dark border-found-border`).
- **Match Score**: Cyan capsule with flash icon (`bg-match-light text-match-dark border-match-border`).

---

## Do's and Don'ts

### Do:
- **Do** maintain the Warm White & Brown palette across all new screens and modals.
- **Do** provide bilingual Thai/English string equivalents in `src/data/i18n.js` for every new UI label.
- **Do** highlight matching scores with the cyan match badge whenever score $\ge 60\%$.
- **Do** use `Prompt` for Thai typography and `Inter` for numbers and metric labels.

### Don't:
- **Don't** introduce harsh saturated neon colors or stark cold grays (`#666666`, `#000000`).
- **Don't** use bounce or elastic easing animations; stick to smooth exponential transitions.
- **Don't** hide verification guidelines when displaying item claim actions.
