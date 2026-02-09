

## Extend the Handwritten Character Across the Page

The Caveat font brings a warm, personal feel to your subtitle. Here's a plan to spread that character throughout the page without overdoing it -- keeping readability while adding personality.

### Changes

1. **Section header "Fun Projects"** -- Switch from default font to Caveat at a slightly larger size, making it feel like a handwritten label

2. **Footer text "Built by Red Fox Labs (aka me)"** -- Apply Caveat to give it a casual, personal sign-off feel

3. **Button labels** -- Keep buttons in the default sans-serif font for clarity and tap-target readability (mixing cursive into small UI elements hurts usability)

4. **Bio paragraph** -- Keep in sans-serif for readability since it's a long block of text

5. **Name "Tommy Lisiak"** -- Keep bold sans-serif for strong visual hierarchy, but optionally bump up the subtitle size slightly (e.g., text-2xl md:text-3xl) to give Caveat more presence

### Summary of what gets Caveat

| Element | Font | Rationale |
|---------|------|-----------|
| Name (h1) | Sans-serif (unchanged) | Strong anchor/hierarchy |
| Subtitle | Caveat (already done) | Personal touch |
| Bio paragraph | Sans-serif (unchanged) | Readability for long text |
| "Fun Projects" header | Caveat | Handwritten section label |
| Button labels | Sans-serif (unchanged) | UI clarity |
| Footer text | Caveat | Casual sign-off |

### Technical Details

- Apply `style={{ fontFamily: "'Caveat', cursive" }}` to the h2 "Fun Projects" and footer p element in `src/components/HeroSection.tsx`
- Optionally increase subtitle font size from `text-xl md:text-2xl` to `text-2xl md:text-3xl`
- Bump footer and section header sizes slightly to account for Caveat rendering smaller than sans-serif at the same size
- No new dependencies or files needed

