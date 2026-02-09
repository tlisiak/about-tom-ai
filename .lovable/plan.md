

## Restructure Page Layout: Experience Section, Book Time CTA, and Informal Links

Three changes to reorganize the page hierarchy and add professional experience.

### 1. Promote "Book Time" as the Primary CTA

Replace the current row of equal-weight buttons with a single prominent "Book Time" button placed right after the bio. It will use a larger, more eye-catching style with a warm glow to stand out as the main action.

### 2. Add an "Experience" Section

A new section between the bio/CTA area and Fun Projects, showing a concise timeline of your career. Each entry will have:
- Company name (bold)
- Role title
- Date range
- A short one-line highlight

Companies included (from your resume):
| Company | Role | Dates |
|---------|------|-------|
| Scout | Head of Product | Mar 2025 -- Present |
| Inspire (acquired by Shell) | Senior Product Manager | Nov 2021 -- Mar 2025 |
| The Washington Post | Product Manager, Zeus Technology | Apr 2020 -- Nov 2021 |
| Arcadia | Product Manager, Utility Data | Aug 2019 -- Mar 2020 |
| XAPPmedia | Product Manager, Voice UX | Jun 2017 -- Jul 2019 |

The section header "Experience" will use the Caveat font to match the existing style. Each entry will be displayed in a clean, minimal card-like row with the company name, role, and dates -- no heavy borders, just subtle separators. Company logos won't be included as image files since we don't have them, but we can use text-based initials in small colored circles as visual anchors.

### 3. Move LinkedIn, Resume, GitHub, Email to Informal Footer Links

Remove the four glass buttons (LinkedIn, Resume, GitHub, Email) from the main action area. Instead, place them as simple text links with small icons near the footer, below Fun Projects but above the "Built by Red Fox Labs" line. They'll appear as a casual row of links (e.g., `LinkedIn / Resume / GitHub / Email`) with hover underline effects matching the existing footer link style.

### New Page Flow

```text
Avatar
Name + Subtitle
Bio paragraph
[Book Time] (prominent CTA button)
"Experience" (timeline section)
"Fun Projects" (Chat with Me, Goal Predict, Red Fox Labs)
LinkedIn / Resume / GitHub / Email (small inline links)
--- border ---
Built by Red Fox Labs (aka me)
```

### Technical Details

**File: `src/components/HeroSection.tsx`**
- Remove the `<nav>` block with LinkedIn, Resume, GitHub, Email, and Book Time buttons (lines 148-188)
- Add a standalone "Book Time" button with enhanced styling (larger, glowing) right after the bio `<article>`
- Add an "Experience" section with a Caveat-styled h2 and a vertical list of roles with company initials, name, title, and dates
- Add a new row of informal icon+text links (LinkedIn, Resume, GitHub, Email) between Fun Projects and the footer, styled as simple anchor tags with opacity and hover underline effects
- Keep all existing imports; no new dependencies needed

