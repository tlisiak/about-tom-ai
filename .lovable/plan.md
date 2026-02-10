

## Make the Experience Section an Alternating Timeline

Transform the current list-style experience section into a visually engaging alternating timeline where entries appear on alternating left and right sides of a central vertical line on desktop/tablet, and stack vertically on mobile.

### Design

On desktop/tablet (md and up):
- A vertical line runs down the center of the section
- Odd entries (1st, 3rd, 5th) appear on the left side, right-aligned toward the center line
- Even entries (2nd, 4th) appear on the right side, left-aligned toward the center line
- Each entry has a small dot/circle on the center line connecting it to the timeline
- The date range appears closest to the line, with company name and role extending outward

On mobile:
- The vertical line shifts to the left edge
- All entries stack on the right side of the line
- Dots remain on the line for visual continuity

### Layout Structure (Desktop)

```text
   Scout  Mar 2025 - Present   |
   Head of Product             o----
                               |
                          ----o|   Inspire (Shell)  Nov 2021 - Mar 2025
                               |   Senior Product Manager
                               |
   The Washington Post         |
   PM, Zeus Technology    ----o|
                               |
                          ----o|   Arcadia  Aug 2019 - Mar 2020
                               |   PM, Utility Data
                               |
   XAPPmedia                   |
   PM, Voice UX           ----o|
```

### Technical Details

**File: `src/components/HeroSection.tsx`**

1. Replace the current experience `<div className="space-y-3 text-left max-w-2xl mx-auto">` block with a new timeline layout using CSS Grid or flexbox
2. Use a `relative` container with a pseudo-element (`before:`) for the central vertical line
3. Each entry will be positioned using grid columns or flex with alternating `md:flex-row-reverse` for left/right placement
4. Add small timeline dots using pseudo-elements or a styled `<div>` element
5. On mobile (`< md`), collapse to a single-column layout with the line on the left
6. Company logos will appear alongside each entry as they do now
7. Keep the Caveat font header and existing animation classes
8. No new dependencies needed -- pure Tailwind CSS implementation

