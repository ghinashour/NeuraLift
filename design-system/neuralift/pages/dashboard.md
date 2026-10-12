# Dashboard Page Overrides

> **PROJECT:** NeuraLift
> **Updated:** 2026-10-10 — Botanical Light (Image 1 reference)
> **Page Type:** Dashboard / Bento

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file.
> Only deviations from the Master are documented here.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** fluid inside `.layout-main`, 12-col bento `.dash-grid`
- **Grid areas:** focus(5) + quote(4) + schedule(3) / chip×3(4 each) / timer(3) + tasks(5) + progress(4) / weekly(5) + streak(3) + wellness(4) / activity(12)
- **Content Density:** High — dashboard density 8-32px scale

### Color Overrides

- `dash-focus`: sage tint gradient `#EDF1E8 → #E2E9DD`, border `#DDE5D6`
- `dash-quote .inspiration-box`: peach tint `#FEF6EC → #FDEEE0`, border `#F0DDC8`, quote ink `#3A3348`
- `dash-schedule`, `dash-wellness`: lavender tint `#F3EFFA → #EDE7F8`, border `#DDD3EF`
- All other `.dash-card`: `#FFFEFB`, border `#ECE4D4`
- Primary pills (`.dash-btn`, `.new-quote-btn`): plum `#2E2A44`, hover `#3D375C`
- Bars: peach `#E9B48F→#D99873` (today), sage `#9DB89E→#7FA184` (completion)
- Donut ring: peach `#E9B48F`; mini timer ring: sage `#7FA184`
- Legend dots: done sage, open peach, updated lavender

### Component Overrides

- Search pill: white, 999px, placeholder `Search tasks, notes, or anything…`
- Botanical corner flourish via `::after` radial gradients (hidden under reduced-motion)
- Sidebar icons restored (were `display:none` under dusk); active nav `#EDE7F7` + plum text
- Top-right cluster: streak + bell + avatar pill (initials or photo)

---

## Page-Specific Components

- `dash-focus`, `dash-quote`, `dash-schedule`, `dash-chip-stat`, `dash-timer`, `dash-tasks`, `dash-progress`, `dash-weekly`, `dash-streak`, `dash-wellness`, `dash-activity`

---

## Recommendations

- Effects: card lift on hover (-2px, 200ms), no layout-shifting transforms
- Charts: keep text-labeled counts alongside color (not color-only)
- A11y: 4.5:1 text, visible focus rings `#8E7FB8`, `prefers-reduced-motion` disables lift/flourish
