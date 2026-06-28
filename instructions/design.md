# Design System — Beauty Bus

> **Design Status:** Figma designs received 2026-06-28. File: Focus-Cube (AoZfqfioGoGq7LpMKghUOq), Page-3 node 184:5. 40+ screens analyzed. Palette and typography confirmed. The flows are now the visual source of truth.
>
> **Key Figma observations:**
> - **Currency**: INR (₹), not USD — prices shown as ₹399, ₹599 etc.
> - **Bottom nav**: 5 tabs — Home, Services, Bookings, Alerts, Profile
> - **Categories**: Men, Women, Kids, Seniors, Bride, Groom (6 categories, 2-col grid with purple gradient background + person images)
> - **Service types**: Combos (bundled services with "20% OFF" badge) + Single Services
> - **Cart model**: Users add services to cart, then checkout (not single-service booking)
> - **Price display**: Strikethrough original price + bold discounted price + green discount badge
> - **Sticky bottom bar**: Cart icon + total price + service count + duration + "Continue" purple CTA
> - **Booking actions**: Track Van, Reschedule, Rebook, Cancel (active booking) — completed bookings show only Payment Summary
> - **Floating Support button**: Green FAB on home screen
> - **Login/Signup**: NOT in Figma — design from brand guidelines

---

## Brand Palette

The following 500-level values are the approved brand colors. Full 100–900 scales are derived from each.

### Primary (Purple)

| Shade | Hex |
|---|---|
| 100 | `#EDE5F9` |
| 200 | `#D4C2F2` |
| 300 | `#B794E8` |
| 400 | `#9560DE` |
| 500 | `#7430D9` |
| 600 | `#5E22B8` |
| 700 | `#491A91` |
| 800 | `#34136A` |
| 900 | `#200D43` |

### Success (Green)

| Shade | Hex |
|---|---|
| 100 | `#E5FAE7` |
| 200 | `#BFF2C4` |
| 300 | `#82E68D` |
| 400 | `#4DDA5B` |
| 500 | `#28D439` |
| 600 | `#1FB32E` |
| 700 | `#188C24` |
| 800 | `#12661A` |
| 900 | `#0C4011` |

### Danger (Red)

| Shade | Hex |
|---|---|
| 100 | `#FAE5E5` |
| 200 | `#F2BFBF` |
| 300 | `#E68282` |
| 400 | `#DA4D4D` |
| 500 | `#D42828` |
| 600 | `#B31F1F` |
| 700 | `#8C1818` |
| 800 | `#661212` |
| 900 | `#400C0C` |

### Info / Supporting (Blue)

| Shade | Hex |
|---|---|
| 100 | `#E5EDFA` |
| 200 | `#BFD2F2` |
| 300 | `#829FE6` |
| 400 | `#4D76DA` |
| 500 | `#2963D6` |
| 600 | `#1F4FB3` |
| 700 | `#183E8C` |
| 800 | `#122D66` |
| 900 | `#0C1D40` |

### Warning (Yellow/Amber)

| Shade | Hex |
|---|---|
| 100 | `#FBF0E1` |
| 200 | `#F5D9B3` |
| 300 | `#EDB96E` |
| 400 | `#E5A043` |
| 500 | `#DE902A` |
| 600 | `#BC7621` |
| 700 | `#935C1A` |
| 800 | `#6B4313` |
| 900 | `#432A0C` |

### Neutrals (Purple-Tinted)

| Shade | Hex | Usage |
|---|---|---|
| 0 (white) | `#FFFFFF` | Backgrounds, card surfaces |
| 100 | `#F4F2F6` | App background, subtle fills |
| 200 | `#E8E4ED` | Dividers, disabled backgrounds |
| 300 | `#D1CBD9` | Borders, input outlines |
| 400 | `#A89DB5` | Placeholder text |
| 500 | `#7F7290` | Secondary text |
| 600 | `#5C5169` | Body text |
| 700 | `#3D3548` | Primary text |
| 800 | `#261F30` | Headings |
| 900 | `#120D1A` | High-contrast text |

---

## Contrast & Accessibility Notes

- **Success-500 (`#28D439`)** and **Warning-500 (`#DE902A`)** fail WCAG AA as text on white backgrounds.
  - Use **600 or 700 shades** for text.
  - **500 is safe** for icons, fills, badges, and backgrounds with dark text.
- **White text on Primary-500 (`#7430D9`)**: verify contrast ratio meets AA (4.5:1). Expected to pass — ratio ~7.2:1.
- All interactive text must meet **4.5:1** minimum contrast ratio.
- Large text (18px+ or 14px+ bold) requires **3:1** minimum.

---

## Booking Status Color Mapping

| Status | Background | Text | Border |
|---|---|---|---|
| PENDING | `warning-100` | `warning-700` | `warning-300` |
| CONFIRMED | `info-100` | `info-700` | `info-300` |
| IN_PROGRESS | `primary-100` | `primary-700` | `primary-300` |
| COMPLETED | `success-100` | `success-700` | `success-300` |
| CANCELLED | `danger-100` | `danger-700` | `danger-300` |

---

## Semantic Surface Tokens

| Token | Light Value | Usage |
|---|---|---|
| `bg-app` | `neutral-100` | Page background |
| `bg-surface` | `neutral-0` (white) | Cards, modals, sheets |
| `bg-surface-raised` | `neutral-0` + shadow-sm | Elevated cards |
| `bg-surface-overlay` | `neutral-0` | Modals, bottom sheets |
| `bg-muted` | `neutral-200` | Disabled, subtle fills |
| `fg-primary` | `neutral-800` | Headings |
| `fg-default` | `neutral-700` | Body text |
| `fg-secondary` | `neutral-500` | Secondary/helper text |
| `fg-placeholder` | `neutral-400` | Input placeholders |
| `fg-inverse` | `neutral-0` | Text on dark/primary backgrounds |
| `fg-link` | `primary-600` | Links and interactive text |
| `fg-error` | `danger-600` | Error messages |
| `fg-success` | `success-600` | Success messages |
| `border-default` | `neutral-300` | Default borders |
| `border-focus` | `primary-500` | Focus rings |
| `border-error` | `danger-500` | Error state borders |
| `border-success` | `success-500` | Success state borders |

---

## Typography

> **PROVISIONAL** — font choices below are starting points. When the designer's mobile flows arrive, fonts will be confirmed or updated.

### Font Families

| Role | Font | Fallback |
|---|---|---|
| Headings | Poppins | `system-ui, sans-serif` |
| Body | Inter | `system-ui, sans-serif` |
| Mono (booking refs, prices) | JetBrains Mono | `ui-monospace, monospace` |

### Type Scale

| Name | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `display` | 48px | 1.1 | 700 | Poppins | Hero headlines |
| `h1` | 32px | 1.2 | 700 | Poppins | Page titles |
| `h2` | 24px | 1.3 | 600 | Poppins | Section headings |
| `h3` | 20px | 1.4 | 600 | Poppins | Card titles, sub-sections |
| `h4` | 18px | 1.4 | 600 | Poppins | Minor headings |
| `body-lg` | 18px | 1.6 | 400 | Inter | Large body text |
| `body` | 16px | 1.6 | 400 | Inter | Default body text |
| `body-sm` | 14px | 1.5 | 400 | Inter | Secondary text, captions |
| `caption` | 12px | 1.4 | 400 | Inter | Labels, timestamps |
| `mono` | 14px | 1.5 | 500 | JetBrains Mono | Booking refs, prices |

### Font Weights

| Name | Value |
|---|---|
| Regular | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |

---

## Spacing

Base unit: **4px**. All spacing values are multiples of 4.

| Token | Value | Common Use |
|---|---|---|
| `0.5` | 2px | Hairline gaps |
| `1` | 4px | Tight internal spacing |
| `1.5` | 6px | Small gaps |
| `2` | 8px | Compact padding |
| `3` | 12px | Default element gaps |
| `4` | 16px | Section padding, card padding |
| `5` | 20px | Container padding (mobile) |
| `6` | 24px | Section gaps |
| `8` | 32px | Large section spacing |
| `10` | 40px | Between major sections |
| `12` | 48px | Page-level spacing |
| `16` | 64px | Nav height, major gaps |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | 6px | Inputs, small elements |
| `md` | 8px | Buttons |
| `lg` | 12px | Cards |
| `xl` | 16px | Modals, bottom sheets |
| `2xl` | 24px | Large cards, image containers |
| `full` | 9999px | Pills, avatars, chips |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `sm` | `0 1px 2px rgba(18, 13, 26, 0.06)` | Subtle elevation (inputs) |
| `md` | `0 4px 8px rgba(18, 13, 26, 0.08)` | Cards |
| `lg` | `0 8px 24px rgba(18, 13, 26, 0.12)` | Dropdowns, popovers |
| `xl` | `0 16px 48px rgba(18, 13, 26, 0.16)` | Modals, bottom sheets |
| `focus` | `0 0 0 3px rgba(116, 48, 217, 0.3)` | Focus ring (primary-500 @ 30%) |
| `focus-error` | `0 0 0 3px rgba(212, 40, 40, 0.3)` | Error focus ring (danger-500 @ 30%) |

---

## Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `base` | 0 | Default |
| `dropdown` | 10 | Dropdowns, popovers |
| `sticky` | 20 | Sticky headers, nav |
| `overlay` | 30 | Backdrop overlays |
| `modal` | 40 | Modals, bottom sheets |
| `toast` | 50 | Toast notifications |

---

## Motion Tokens

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `fast` | 150ms | `ease-out` | Micro-interactions (hover, focus) |
| `normal` | 250ms | `ease-in-out` | State transitions, toggles |
| `slow` | 400ms | `ease-in-out` | Page transitions, modals |
| `spring` | 500ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful entrances (bottom sheet slide-up) |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Layout

### Navigation

| Breakpoint | Navigation Model | Height |
|---|---|---|
| < 768px (mobile) | Bottom navigation bar | 64px |
| >= 768px (desktop) | Top header navigation | 64px |

### Dimensions

| Token | Value | Usage |
|---|---|---|
| `max-width` | 1200px | Content container max width |
| `bottom-nav-height` | 64px | Mobile bottom nav |
| `top-nav-height` | 64px | Desktop header |
| `booking-cta-height` | 72px | Sticky booking CTA bar at bottom |
| `touch-target` | 44px | Minimum interactive element size |

### Content Padding

| Breakpoint | Padding |
|---|---|
| < 640px | 16px |
| 640–1024px | 24px |
| > 1024px | 32px |

---

## Responsive Breakpoints

| Name | Min Width | Tailwind Prefix | Navigation |
|---|---|---|---|
| Mobile | 0px | (default) | Bottom nav |
| Tablet | 768px | `md:` | Top nav |
| Desktop | 1024px | `lg:` | Top nav |
| Wide | 1440px | `xl:` | Top nav |

Mobile-first: default styles target mobile. Use `md:`, `lg:`, `xl:` prefixes for larger screens.

---

## Component Specifications

| Component | Variants | Key Specs |
|---|---|---|
| **Button** | `primary`, `secondary`, `outline`, `ghost`, `danger` / sizes: `sm`, `md`, `lg` | Radius `md` (8px), min-height 44px (touch), font-weight 600, disabled opacity 0.5 |
| **Input** | `default`, `error`, `disabled` | Radius `sm` (6px), height 44px, border `neutral-300`, focus border `primary-500` + focus shadow |
| **Card** | `default`, `raised`, `interactive` | Radius `lg` (12px), padding 16px, shadow `md` for raised, hover scale 1.02 for interactive |
| **ServiceCard** | — | Card with image (aspect 4:3), title (h3), short description, price (mono), rating, duration badge |
| **Modal / BottomSheet** | — | Mobile: slides from bottom, radius `xl` (16px) top. Desktop: centered modal, radius `xl`, max-width 480px. Backdrop `neutral-900/50`. |
| **Badge / Chip** | `default`, `primary`, `success`, `warning`, `danger`, `info` | Radius `full`, padding 4px 12px, font `caption` (12px), font-weight 500 |
| **Calendar** | — | Grid layout, 44px cell minimum, today highlight `primary-100`, selected `primary-500` + white text, disabled `neutral-200` |
| **TimeSlot Pill** | `available`, `selected`, `unavailable` | Radius `full`, padding 8px 16px, available: `neutral-0` border `neutral-300`, selected: `primary-500` white text, unavailable: `neutral-200` strikethrough |
| **BottomNav** | — | Height 64px, 5 items (Home, Services, Bookings, Alerts, Profile), active: `primary-500` filled icon + label, inactive: `neutral-500` outline icon, icon 24px, label `caption` |
| **Booking Stepper** | — | Horizontal steps, active step `primary-500`, completed `success-500` + check icon, upcoming `neutral-300`, connector lines between |
| **Avatar** | sizes: `sm` (32px), `md` (40px), `lg` (56px) | Radius `full`, fallback with initials on `primary-100` text `primary-700` |
| **Toast** | `success`, `error`, `info`, `warning` | Radius `lg`, shadow `lg`, auto-dismiss 5s, swipe-to-dismiss on mobile, max-width 400px |

---

## Mandatory 4 Data-View States

Every data-consuming component MUST implement all four states:

| State | Implementation |
|---|---|
| **Loading** | Skeleton placeholders matching the layout shape. Use `animate-pulse` with `neutral-200` / `neutral-300`. Never show a blank screen or spinner alone. |
| **Error** | Error message with `danger-600` text, retry button (`primary` variant). Include `[ComponentName] Error description` in console. |
| **Empty** | Friendly illustration or icon, descriptive text, and a CTA button guiding the user to the next action. |
| **Success** | The actual data rendered in its final layout. |

---

## Icon Rules

- **Library**: Lucide React only — no other icon libraries.
- **Sizes**: 20px for inline/small contexts, 24px for standard UI elements.
- **Stroke width**: 2 (Lucide default).
- **Color**: Inherit from text color via `currentColor`.
- **Touch targets**: Icon-only buttons must be wrapped in a 44px minimum touch target.

---

## Content Voice

| Do | Don't |
|---|---|
| Sentence case for all UI text | ALL CAPS except status enums |
| Short button labels (max 3 words) | "Click here to proceed with your booking" |
| Actionable error messages | "Error 422" or "Something went wrong" |
| "Book now", "View details", "Cancel" | "Submit", "Go", "OK" |
| Descriptive empty states | "No data" |
| "No upcoming bookings. Browse services to book your first appointment." | "Nothing to show." |
| Professional but warm tone | Overly casual or robotic |

---

## Accessibility Checklist

- [ ] All interactive elements have visible focus indicators (focus shadow token)
- [ ] Color is never the only indicator — always pair with text or icon
- [ ] Images have descriptive `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Modals trap focus and restore on close
- [ ] Buttons have descriptive text (not just icons — use `aria-label` for icon-only buttons)
- [ ] Keyboard navigation works for all interactive flows
- [ ] Touch targets are minimum 44px
- [ ] `prefers-reduced-motion` is respected
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skips)
- [ ] Status changes announced via `aria-live` regions

---

## Theme

**Light theme only** for MVP. Semantic tokens (`bg-app`, `fg-primary`, etc.) are designed to support a future dark theme by remapping values — no code changes needed, just token reassignment.
