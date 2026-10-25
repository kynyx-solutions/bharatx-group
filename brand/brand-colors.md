# BharatX Group brand colours

These colours were sampled from the BharatX Group logo (`logo/bharatx-group-logo.png`), using the median colour of each part of the logo. Code-ready tokens are in [`design-tokens.css`](design-tokens.css).

## Palette

| Role | Name | HEX | From the logo | Use |
| --- | --- | --- | --- | --- |
| Primary | BharatX Navy | `#012247` | "BHARAT" wordmark | Headings, body text, header, footer |
| Accent | BharatX Saffron | `#FE7802` | "X" wordmark and mark | Buttons, key highlights, icons. Never use as text |
| Secondary | Bharat Blue | `#016DAB` | "B" mark | Links, secondary buttons |
| Secondary | Growth Green | `#5C9B19` | Leaf | Icons, accents, company tags |
| Neutral | Slate Grey | `#464C57` | "GROUP" text | Secondary text |
| Tint | Sky | `#5ACDEB` | Highlight in the B | Backgrounds, illustrations |
| Tint | Deep Green | `#085A25` | Farmland | Backgrounds, charts |
| Tint | Light Saffron | `#FDA84A` | Sun | Backgrounds, hover states |
| Background | Ivory | `#FAF9F6` | — | Page background |

## Accessibility (WCAG AA: 4.5:1 for body text)

| Colour | As text on white | Rule |
| --- | --- | --- |
| Navy `#012247` | 15.9 : 1 | Safe for all text |
| Blue `#016DAB` | 5.6 : 1 | Safe for links and text |
| Slate `#464C57` | 8.6 : 1 | Safe for secondary text |
| Saffron `#FE7802` | 2.7 : 1 | Not for text. Use `#A34B00` (5.9 : 1 on white, 5.1 : 1 on beige) when orange text is needed |
| Green `#5C9B19` | 3.4 : 1 | Not for text. Use `#3F7A0E` (5.3 : 1) when green text is needed |

- **Saffron buttons take navy text** (6.0 : 1), not white text (2.7 : 1, which fails).
- **Balance:** about 60% ivory and white, 25% navy, 10% saffron, 5% blue and green.
- **Light theme only** (decided 24 Oct 2026): page and section backgrounds are ivory, white or beige. Navy is for text, buttons, small icon tiles and the footer, never a section background. The one exception is the home hero, where white text sits over a darkened photo or video. There is no dark mode, and browsers are told not to darken the site.
- **Saffron highlight words on light backgrounds** use the deep gradient `#C45C00` to `#A34B00` (at least 3.7 : 1, fine for large headings). Bright saffron `#FE7802` is only for buttons, icons and the dark home hero.

## Typography

- Headings: **Fraunces** (serif, Google Fonts)
- Body: **Inter** (sans-serif, Google Fonts)

## Logo notes

- `logo/bharatx-group-logo.png` is the master logo: 1879×1214 with a transparent background. It's raster only; there's no vector version yet.
- The detailed illustration doesn't read well below about 120 px wide. In the header, use it at 140 px or wider.
- `logo/og-image-1200x630.jpg` is for social-media link previews.
