# CLAUDE.md — NodalWire Website Project Rules

## Quick Start
- **Invoke the `frontend-design` skill** before writing any frontend code (every session, no exceptions).
- Always serve locally: `node serve.mjs` → `http://localhost:3000`
- Screenshot from localhost: `node screenshot.mjs http://localhost:3000`
- Push to deploy: `git push` → auto-deploys to https://www.nodalwire.com via Hostinger

---

## Project Position & Direction

**NodalWire** is a serious network engineering and AI-driven automation company.

The website communicates:
- Technical credibility and engineering maturity
- Operational trust and enterprise professionalism
- Premium positioning (not flashy SaaS, not generic dark UI)

---

## Design System

### Typography (Fixed)
- **Lato** — headings, nav, UI labels, buttons, eyebrows
- **Inter** — body text, descriptions, form fields, captions
- Never use Space Grotesk, Arial, Roboto, or system fonts
- Large headings: tight tracking (`-0.03em`), `font-weight: 700`
- Body text: generous line-height (`1.7`)

### Color Tokens
```css
--brand:  #1D78C4;   /* primary blue accent */
--navy:   #060e1a;   /* dark section background */
--bright: #eef4ff;   /* light text on dark */
--muted:  #7a9bbf;   /* secondary text on dark */
```

**Light section override** (off-white sections use):
```css
background: #f4f5f1;
--bright: #0d1a2e;
--muted:  #486080;
```

### Sections & Backgrounds

| Section | Background | Text |
|---|---|---|
| Nav | Transparent | White |
| Hero | Dark navy + radial blue gradients | `var(--bright)` / `var(--muted)` |
| Content (Showcase, Problem, Solutions, etc.) | `#f4f5f1` (off-white) | `#0d1a2e` / `#486080` |
| Final CTA | Dark navy + radial blue gradients | `#E5E7EB` |
| Footer | `#060e1a` | White |

**Pattern:** Dark hero → Light content → Dark CTA → Dark footer.

### Navigation & Footer (Fixed)
- **Nav height:** `90px`
- **Logo:** `height: 78px; filter: brightness(0) invert(1)` (white version)
- **Nav links:** `17px`, `#fff`, Lato
- **Nav CTA:** `border: 1.5px solid rgba(255,255,255,0.65); background: rgba(255,255,255,0.07)`
- **Footer background:** Always `#060e1a` (never transparent)
- **Footer logo:** `height: 72px`

### Buttons

**Primary CTA (dark sections):**
```css
background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%);
color: #fff;
border-radius: 9px;
box-shadow: 0 4px 16px rgba(29,120,196,0.28);
```
Include `:hover`, `:focus-visible`, `:active` states.

**Nav CTA:** See Navigation section above.

### Dark Section Gradient (Hero, CTA)
```css
background:
  radial-gradient(ellipse 80% 60% at 20% 50%, rgba(29,120,196,0.12) 0%, transparent 65%),
  radial-gradient(ellipse 60% 50% at 80% 30%, rgba(29,120,196,0.08) 0%, transparent 60%),
  linear-gradient(158deg, #07101f 0%, #0d2340 55%, #122e52 100%);
```

**Dot grid texture** (::before):
```css
background-image: radial-gradient(rgba(29,120,196,0.14) 1px, transparent 1px);
background-size: 28px 28px;
opacity: 0.35;
```

### Light Cards (within off-white sections)
```css
background: #fff;
border: 1px solid rgba(0,0,0,0.09);
```

### Glass Cards (CTA forms)
```css
background: rgba(255,255,255,0.055);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.09);
border-radius: 16px;
box-shadow: 0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07);
```

Form inputs: `background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #E5E7EB;`

### Animations
- Only animate `transform` and `opacity`. Never `transition-all`.
- Spring entrance easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Standard layout easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Stagger with `animation-delay` for reveals (one entrance is better than scattered micro-interactions)

### Anti-Generic Guardrails
- Never use default Tailwind palette (indigo-500, blue-600). Use `#1D78C4` only.
- Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- Gradients: layer multiple radial gradients + dot-grid texture for dark sections.
- Images: add gradient overlay and color treatment via `mix-blend-multiply`.
- Spacing: intentional, consistent tokens — not arbitrary Tailwind steps.
- Depth: surfaces must layer (base → elevated → floating). Nothing flat.

---

## Hero Section — **PERMANENTLY LOCKED**
Do not change any part of the hero section under any circumstance.

- Height: `70vh` / `min-height: 70vh`
- Layout: CSS grid `grid-template-columns: 42fr 58fr`
- Left: heading, sub, CTA button — padded `32px 48px 48px 88px`
- Right: horizontal flex accordion with 6 panels
- Accordion: collapsed `flex: 1`, active `flex: 5`, transition `0.65s cubic-bezier(0.25,0.46,0.45,0.94)`
- Panel backgrounds: slight gradient variations
- Panel labels: `writing-mode: vertical-lr; transform: rotate(180deg)` — vertical text, white, 15px
- Panel content: absolutely positioned, hidden until active
- H1: `clamp(27px, 3.36vw, 46px)`, `font-weight: 700`, `letter-spacing: -0.03em`

---

## Asset Organization

Assets are now organized in `assets/` folder:

```
assets/
├── brand/          (All brand logos, 24 files)
├── images/         (Ready for future use)
├── icons/          (Ready for future use)
└── documents/      (Ready for future use)
```

**Important:** Update all image paths to use `assets/brand/` instead of `Brand_Assets/`.

Example: `assets/brand/fulllogo_transparent.png`

Use brand logo for social sharing: `https://www.nodalwire.com/assets/brand/fulllogo.jpg`

Favicon (required on every page):
```html
<link rel="icon" type="image/png" href="assets/brand/icononly_transparent_nobuffer.png">
<link rel="apple-touch-icon" href="assets/brand/icononly_transparent_nobuffer.png">
```

---

## Navigation & Canonical Patterns

**Canonical nav HTML:**
```html
<nav class="nav">
  <a href="/" class="nav-logo" aria-label="NodalWire home">
    <img src="assets/brand/fulllogo_transparent.png" alt="NodalWire">
  </a>
  <ul class="nav-links">
    <li class="has-dropdown">
      <a href="#">Solutions</a>
      <ul class="nav-dropdown">
        <li><a href="microwave.html">Microwave Networks</a></li>
        <li><a href="optical.html">Optical Networks</a></li>
        <li><a href="ftth.html">FTTH Networks</a></li>
        <li><a href="wifi.html">WiFi Networks</a></li>
        <li><a href="lab.html">Communication Labs</a></li>
        <li><a href="hummingbird_hollow_case_study.html">Remote Property Connectivity</a></li>
      </ul>
    </li>
    <li><a href="industries.html">Industries</a></li>
    <li class="has-dropdown">
      <a href="#">Insights</a>
      <ul class="nav-dropdown">
        <li><a href="https://www.nodalwireacademy.com" target="_blank" rel="noopener">Academy</a></li>
      </ul>
    </li>
    <li><a href="about.html">About</a></li>
  </ul>
  <a href="#assessment" class="nav-cta">Talk to an Engineer</a>
</nav>
```

**Dropdown hover fix** (add to every page):
```css
.nav-dropdown::before {
  content: '';
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  height: 16px;
}
```

---

## SEO Rules for All Pages

### Global Principles
- Every page has one unique `<title>` tag (descriptive, not generic).
- Every page has one unique `<meta name="description">` (150–160 chars).
- Every page has exactly one `<h1>`.
- Headings follow proper hierarchy: H1 → H2 → H3.
- No keyword stuffing. Write naturally; search engines reward authenticity.

### Google Analytics (GA4) — Required on All Pages
Every page **must** include this GA4 code immediately after the opening `<head>` tag:

```html
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TCXCP971BF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-TCXCP971BF');
  </script>

  <!-- Rest of head content -->
  <meta charset="UTF-8">
  ...
</head>
```

**This is the ONLY GA4 tag needed per page.** All existing pages (index, about, optical, ftth, wifi, microwave, lab, industries, hummingbird_hollow_case_study, verify-employee) already have this configured.

### Homepage SEO (Fixed)
**Title:** `NodalWire | Reliable Network Design & Deployment Solutions`

**Description:** `NodalWire helps organizations turn reactive networks into predictable systems through engineering-led design, deployment, optimization, and automation.`

**Visible slogan:** `Cognitive Network Solutions` (do not replace with SEO keywords)

### Service Page SEO
Include service keyword in: title, description, H1, first paragraph, image alt text.

Core service keywords:
- Optical Network Engineering
- FTTH / PON Network Design
- Enterprise Wi-Fi Design
- Microwave and Hybrid Connectivity
- Remote and Multi-Site Network Systems
- Engineering Labs and Capability Development

### Image SEO
- Use descriptive filenames: `optical-network-engineering.webp` (not `image1.png`)
- Add meaningful alt text to all images
- Use empty `alt=""` only for decorative images

### Open Graph Tags (All Pages)
Every page includes:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="...">
<meta property="og:image" content="https://www.nodalwire.com/assets/brand/fulllogo.jpg">
```

### Schema Markup
- **Homepage:** LocalBusiness + ProfessionalService + WebSite
- **Service pages:** Service schema + BreadcrumbList
- **About page:** AboutPage + BreadcrumbList
- **Case studies:** Article + BreadcrumbList
- **Industries:** WebPage + BreadcrumbList

Do not add schema that misrepresents the business.

### SEO Tone
Copy is: professional, engineering-focused, clear, outcome-driven.

Avoid: buzzwords, generic language, keyword stuffing, overly long meta descriptions.

### Technical SEO
- Use semantic HTML: `header`, `main`, `section`, `article`, `footer`
- Accessible labels on buttons and links
- Labels on all form fields
- No broken links
- Lightweight page load
- Minimal JavaScript for static content

---

## Contact Forms & Success Modal

Use FormSubmit AJAX endpoint (not native POST).

**Form fields (required `name` attributes):**
```html
<input name="Full Name" ...>
<input name="email" type="email" ...>
<input name="Organization" ...>
<select name="Area of Interest">
```

**AJAX submission:**
```javascript
const form = document.getElementById('assessmentForm');
const modal = document.getElementById('successModal');

function val(sel) {
  const el = form.querySelector(sel);
  return el ? el.value : '';
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  var payload = {
    'Full Name':         val('[name="Full Name"]'),
    email:               val('[name="email"]'),
    Organization:        val('[name="Organization"]'),
    'Area of Interest':  val('[name="Area of Interest"]'),
    _subject:            'New Assessment Request — NodalWire',
    _replyto:            val('[name="email"]'),
    _autoresponse:       'Thank you for contacting NodalWire. We have received your request and a member of our team will be in touch within one business day.'
  };
  try {
    var res = await fetch('https://formsubmit.co/ajax/contact@nodalwire.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    var json = await res.json();
    if (json.success === 'true' || json.success === true) {
      form.reset();
      modal.classList.add('open');
    }
  } catch(err) {
    console.error('Form submission error:', err);
  }
});

document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
  btn.addEventListener('click', function() { modal.classList.remove('open'); });
});
```

**Success modal HTML:**
```html
<div id="successModal" class="modal-overlay">
  <div class="modal-card">
    <div class="modal-icon">✓</div>
    <h3>Message Sent</h3>
    <p>Thank you for reaching out. A NodalWire engineer will be in touch within one business day.</p>
    <button data-close-modal class="modal-close-btn">Close</button>
  </div>
</div>
```

**Modal CSS:**
```css
.modal-overlay {
  display: none; position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  align-items: center; justify-content: center;
}
.modal-overlay.open { display: flex; }
.modal-card {
  background: rgba(255,255,255,0.055); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.28);
  padding: 48px; text-align: center; max-width: 400px; width: 90%;
}
.modal-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(29,120,196,0.18); border: 1px solid rgba(29,120,196,0.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #1D78C4; margin: 0 auto 20px;
}
```

---

## Project Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage (LocalBusiness + ProfessionalService schema) |
| `about.html` | About page (AboutPage schema) |
| `ftth.html` | FTTH/PON service page |
| `optical.html` | Optical service page |
| `wifi.html` | Wi-Fi service page |
| `microwave.html` | Microwave service page |
| `lab.html` | Communication Labs service page |
| `industries.html` | Industries page (WebPage schema) |
| `hummingbird_hollow_case_study.html` | Case study (Article schema) |

---

## Deployment & GitHub

### GitHub Setup
- **Repo:** https://github.com/NodalWire/NodalWire_WebSite
- **Auto-deploy:** Push to `main` → Hostinger auto-deploys to https://www.nodalwire.com
- **No manual uploads needed**

### Git Workflow
```bash
git add -A
git commit -m "describe what changed"
git push
# → Hostinger auto-deploys within seconds
```

### .gitignore (Managed)
Excludes: `node_modules/`, `Temp_Screenshots/`, `.DS_Store`, `.vscode/`, `*.log`, `*.tmp`, `*.bak`

Includes: all production pages, assets, configuration files

### Before You Push
- All asset paths updated (Brand_Assets/ → assets/brand/)
- No broken links or images
- All pages have unique titles and descriptions
- One H1 per page, proper heading hierarchy
- All images have descriptive filenames and alt text

---

## Local Development

### Start Dev Server
```bash
node serve.mjs
# → localhost:3000
```

### Screenshot Workflow
```bash
node screenshot.mjs http://localhost:3000 [optional-label]
# → Temp_Screenshots/screenshot-N.png (auto-incremented)
```

Compare screenshots side-by-side. Be specific: "heading is 32px but should be 24px", "gap is 16px but reference shows 24px".

Do at least 2 rounds of comparison when updating designs.

---

## Hard Rules

- **Hero section is permanently locked** — do not change anything
- Never use `transition-all`
- Never use default Tailwind colors (indigo-500, blue-600) — use `#1D78C4` only
- Never use Space Grotesk or system fonts — Lato + Inter only
- Never make footer background transparent — always `#060e1a`
- Never add sections, features, or content not in the design
- Never stop after one screenshot pass — do 2+ rounds
