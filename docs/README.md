# NodalWire Website

Marketing and services website for NodalWire LLC — a network engineering and AI-driven automation consultancy based in Plano, TX.

## Stack

- Static HTML/CSS/JS — no build step, no framework
- Tailwind CSS via CDN
- Google Fonts: Lato (headings/UI) + Inter (body)
- FormSubmit.co for contact form submissions (AJAX)
- Puppeteer for local screenshot verification

## Local Development

**Start the dev server:**
```bash
node serve.mjs
```
Serves the project root at `http://localhost:3000`. Always use this — never open HTML files directly in the browser (FormSubmit breaks on `file://` URLs).

**Take a screenshot:**
```bash
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000/about.html
node screenshot.mjs http://localhost:3000 label   # adds label to filename
```
Screenshots save to `Temp_Screenshots/screenshot-N-label.png` (auto-incremented, never overwritten).

**Install dependencies** (first time only):
```bash
npm install
```

## Pages

| URL | File | Description |
|-----|------|-------------|
| `/` | `index.html` | Home — hero accordion, services, case study, CTA |
| `/about.html` | `about.html` | Company story, team, values |
| `/ftth.html` | `ftth.html` | FTTH Networks service page |
| `/microwave.html` | `microwave.html` | Microwave Networks service page |
| `/optical.html` | `optical.html` | Optical Networks service page |
| `/wifi.html` | `wifi.html` | WiFi Networks service page |
| `/lab.html` | `lab.html` | Communication Labs service page |
| `/industries.html` | `industries.html` | Industries overview (placeholder, Coming Soon) |
| `/hummingbird_hollow_case_study.html` | `hummingbird_hollow_case_study.html` | Rural venue connectivity case study |
| `/card.html` | `card.html` | Digital business card — no nav/footer |

## Project Structure

```
/
├── Brand_Assets/          # Logo and brand exports (PNG, JPG, SVG, EPS, PDF)
├── index.html             # Home page — canonical source for nav/footer
├── about.html
├── ftth.html
├── microwave.html
├── optical.html
├── wifi.html
├── lab.html
├── industries.html
├── hummingbird_hollow_case_study.html
├── card.html
├── sitemap.xml
├── robots.txt
├── serve.mjs              # Local dev server
├── screenshot.mjs         # Puppeteer screenshot helper
├── package.json
└── CLAUDE.md              # AI assistant instructions and design system rules
```

## Design System

**Colors**
- `#1D78C4` — brand blue (primary accent)
- `#060e1a` — navy (dark section backgrounds, footer)
- `#eef4ff` — bright (light text on dark)
- `#7a9bbf` — muted (secondary text on dark)
- `#f4f5f1` — off-white (light content sections)

**Fonts**
- `Lato` — headings, nav, buttons, labels
- `Inter` — body copy, descriptions, form fields

**Section rhythm:** Dark hero → light content sections → dark CTA → dark footer

## Contact Form

All pages use [FormSubmit.co](https://formsubmit.co) via AJAX POST to `contact@nodalwire.com`. Submissions trigger an auto-response email to the sender and a notification to the business.

## SEO

Every page includes a full SEO block: meta description, canonical URL, Open Graph, Twitter Card, geo tags, and JSON-LD structured data. See `CLAUDE.md` for the exact patterns.

---

**NodalWire LLC** · Plano, TX · [nodalwire.com](https://www.nodalwire.com)
