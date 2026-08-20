# Blue Shield Facilities Design System

This document is the source of truth for the application's visual language and interaction patterns. New screens should reuse the components in `components/ui` before introducing new styles.

## Principles

1. **Operational clarity** — show the most urgent information first and make the next action obvious.
2. **Consistency** — use the same component for the same purpose everywhere.
3. **Accessible by default** — support keyboard navigation, visible focus, clear labels, and readable contrast.
4. **Responsive from the start** — design for a phone first, then expand for desktop operations.
5. **Progressive disclosure** — reporters see a simple submission flow; staff see management controls and operational detail.

## Technology

- Tailwind CSS v4 provides utility styling.
- Components follow shadcn/ui ownership conventions and live in `components/ui`.
- Lucide React is the only general interface icon library.
- Inter is self-hosted through `@fontsource/inter`.
- Carbon Design System principles guide dashboard information hierarchy; Carbon code is not imported.

## Brand and colour

| Role | Tailwind value | Use |
| --- | --- | --- |
| Primary | `blue-800` | Primary actions, navigation, active focus, key icons |
| Primary hover | `blue-900` | Hover state for primary actions |
| Page background | `slate-100` / existing `--bg` | Application canvas |
| Surface | `white` | Cards, forms, header |
| Main text | `slate-950` | Titles and important content |
| Supporting text | `slate-600` | Descriptions, metadata, help text |
| Border | `slate-200` or `slate-300` | Dividers, cards, form controls |
| Success | `emerald-50/100/800` | Saved, resolved, completed |
| Warning | `amber-100/900` | Urgent issues and caution |
| Danger | `red-50/100/600/800` | Errors and emergency issues |

Do not use colour as the only indicator. Pair it with text, an icon, or both.

## Typography

Inter is the application font. Available weights are 400, 600, and 700.

| Element | Recommended style |
| --- | --- |
| Page title | `text-3xl font-bold tracking-tight` |
| Card or section title | `text-xl font-bold` |
| Subsection title | `text-base font-bold` |
| Body | `text-sm leading-6` |
| Label | `text-sm font-semibold` |
| Supporting text | `text-xs` or `text-sm text-slate-500/600` |
| Eyebrow | `text-xs font-bold tracking-widest text-blue-800` |

Use sentence case for headings and actions. Avoid all capitals except short eyebrow labels.

## Spacing and layout

- Use Tailwind's 4px spacing scale.
- Default control height: 44px (`h-11`); minimum touch target: 44 × 44px.
- Card padding: 24px (`p-6`) on mobile and up to 32px (`p-8`) on larger screens.
- Form field gap: 20px (`gap-5`).
- Major section gap: 32px (`space-y-8`).
- Main content maximum: 1100px; report forms: 896px (`max-w-4xl`); authentication: 448px (`max-w-md`).
- Use one column on mobile, two columns only when fields are meaningfully related.

## Components

### Button

Import from `@/components/ui/button`.

- `default`: primary action; normally one per card or section.
- `outline`: secondary action.
- `ghost`: low-emphasis action.
- Use `sm`, `default`, or `lg` sizes rather than custom padding.
- Include a Lucide icon when it improves recognition, not as decoration.
- Loading copy should describe progress, such as “Submitting…” or “Saving…”.

### Input, Select, and Textarea

Import from `@/components/ui/input`, `select`, and `textarea`.

- Every control must have a visible `Label` connected with `htmlFor` and `id`.
- Put format guidance immediately below the control.
- Use native input types and autocomplete attributes.
- Keep validation in both the browser and server API.
- Do not use placeholders as labels.

### Card

Import `Card`, `CardHeader`, and `CardContent` from `@/components/ui/card`.

- Cards group one coherent task or information area.
- Use borders and light shadows; avoid nested cards unless hierarchy requires them.
- A blue top rule may identify a primary workflow card.

### Alert

Import from `@/components/ui/alert`.

- `error` is for actionable errors and invalid states.
- `success` confirms completed actions.
- Add `role="alert"` for errors and `role="status"` for non-urgent success updates.
- Keep messages specific and tell the user what to do next.

### Badge

Import from `@/components/ui/badge`.

- Normal: slate.
- Urgent: amber.
- Emergency: red.
- Resolved or closed: emerald.
- In progress: blue.
- Badge wording must match the stored workflow value.

## Icons

- Import icons only from `lucide-react`.
- Standard inline size: 16–20px; feature icon: 24px.
- Decorative icons must use `aria-hidden="true"`.
- Icon-only buttons require an `aria-label`.
- Use one icon consistently for one concept: `MapPin` for location, `UserRound` for reporter, `Clock3` for age, and `AlertTriangle` for emergencies.

## Dashboard pattern

Follow this order:

1. Context and page title.
2. Decision-oriented KPI cards.
3. Search and filters.
4. Prioritized work queue.
5. Ticket metadata and actions.

Sort emergency and urgent work before normal work, then oldest first. Staff actions belong in a visually separate control area. Reporter views must remain read-only and must never expose other reporters' data.

## Accessibility checklist

- Keyboard focus is always visible.
- Every form control has a programmatic label.
- Status is not communicated by colour alone.
- Error and success announcements use the correct ARIA role.
- Links describe their destination; buttons describe an action.
- Text and interface controls meet WCAG AA contrast.
- Pages work at 320px width and at 200% browser zoom.
- Motion is subtle and never required to understand state.

## Adding a new page

Before merging a new screen:

1. Reuse existing UI components.
2. Follow the typography and spacing scale.
3. Use Lucide icons only.
4. Add mobile and empty/error/loading states.
5. Confirm authorization boundaries for displayed data.
6. Test keyboard navigation and labels.
7. Run `npm run build`.

If a new pattern is genuinely required, add it as a reusable component and update this guide in the same change.
