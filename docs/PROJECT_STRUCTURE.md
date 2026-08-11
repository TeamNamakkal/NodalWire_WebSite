# NodalWire Website - Project Structure

## Directory Organization

```
nodalwire-website/
├── Root Level (Web-Served Files)
│   ├── *.html              - All HTML pages (index, about, verify-employee, service pages)
│   ├── sitemap.xml         - SEO sitemap for search engines
│   ├── robots.txt          - Search engine crawling rules
│   └── .htaccess           - Server configuration
│
├── js/                     - JavaScript Assets (Web-Served)
│   └── analytics.js        - Google Analytics 4 tracking module
│
├── assets/                 - Static Assets (Web-Served)
│   ├── brand/              - Brand logos and assets (24 files)
│   ├── images/             - Placeholder for future images
│   ├── icons/              - Placeholder for future icons
│   └── documents/          - Placeholder for documents
│
├── scripts/                - Development Scripts (Not Deployed)
│   ├── serve.mjs           - Local development server
│   └── screenshot.mjs      - Screenshot utility for testing
│
├── docs/                   - Documentation (Not Deployed)
│   ├── PROJECT_STRUCTURE.md - This file
│   ├── CLAUDE.md           - Project rules and guidelines
│   ├── SEO_ANALYTICS_SETUP.md - GA4 and SEO setup guide
│   ├── README.md           - Project overview
│   └── GIT_COMMANDS.md     - Git workflow reference
│
├── Config Files (Root)
│   ├── .gitignore          - Git ignore rules
│   ├── package.json        - NPM configuration
│   ├── package-lock.json   - NPM dependency lock
│   └── .vscode/            - VS Code settings
│
└── Directories (Not Deployed)
    ├── node_modules/       - NPM dependencies
    ├── Temp_Screenshots/   - Development screenshots
    └── drafts/             - Draft files
```

---

## File Types by Category

### HTML Pages (Root Directory)
- `index.html` — Homepage
- `about.html` — About company & team
- `verify-employee.html` — Employee verification tool
- `microwave.html` — Microwave networks service
- `optical.html` — Optical networks service
- `ftth.html` — FTTH networks service
- `wifi.html` — WiFi networks service
- `lab.html` — Communication labs service
- `industries.html` — Industries served
- `hummingbird_hollow_case_study.html` — Case study

### JavaScript (`js/` Directory)
- `analytics.js` — Google Analytics 4 tracking module with PII protection

### Static Assets (`assets/` Directory)
- `assets/brand/` — NodalWire brand logos (24 variations)
- `assets/images/` — Reserved for future images
- `assets/icons/` — Reserved for future icons
- `assets/documents/` — Reserved for downloadable documents

### Development Scripts (`scripts/` Directory)
- `serve.mjs` — Start local dev server on port 3000
- `screenshot.mjs` — Capture page screenshots for testing

### Documentation (`docs/` Directory)
- `CLAUDE.md` — Project rules, design system, deployment workflow
- `SEO_ANALYTICS_SETUP.md` — Google Analytics & SEO configuration guide
- `PROJECT_STRUCTURE.md` — This file
- `README.md` — Project overview and quick start
- `GIT_COMMANDS.md` — Git workflow reference
- `LEAD_MANAGEMENT.md` — Lead Management module (routes, storage, activity
  history, AI provider extension point)

### Internal Portal (Authenticated App — Not Part of the Public Marketing Site)
`portal.html` is a separate, authenticated single-page app (login-gated,
`scripts/serve.mjs` backend) distinct from everything described above, which
covers the public marketing site only. It has its own sidebar-based
navigation built by `js/portal.js`, with each section as a self-contained
module in `js/` (`employees.js`, `timebooking.js`, `payroll.js`,
`tickets.js`, `leads.js`) registering itself via `window.NWPortal.register()`.
Backend logic for these lives in `scripts/serve.mjs` plus `scripts/lib/`
(`shared.mjs`, `payroll-tax.mjs`, `leads-db.mjs`, `leads-routes.mjs`,
`ai-provider.mjs`). Data is flat JSON files under `data/` for most modules;
Lead Management uses SQLite (`data/leads.db`) — see `LEAD_MANAGEMENT.md`.
Sensitive data files are gitignored and provisioned by hand on the server.

### Server Configuration (Root)
- `robots.txt` — Search engine crawling instructions
- `sitemap.xml` — XML sitemap for search engines
- `.htaccess` — Server rewrite rules (Hostinger)

---

## URL Mapping

### How Files Are Served
Since Hostinger serves files from the root directory:

| File Path | URL |
|-----------|-----|
| `index.html` | `https://www.nodalwire.com/` |
| `about.html` | `https://www.nodalwire.com/about.html` |
| `verify-employee.html` | `https://www.nodalwire.com/verify-employee.html` |
| `js/analytics.js` | `https://www.nodalwire.com/js/analytics.js` |
| `assets/brand/fulllogo.png` | `https://www.nodalwire.com/assets/brand/fulllogo.png` |
| `sitemap.xml` | `https://www.nodalwire.com/sitemap.xml` |
| `robots.txt` | `https://www.nodalwire.com/robots.txt` |

---

## Development Workflow

### Starting the Dev Server
```bash
node scripts/serve.mjs
# Server runs at http://localhost:3000
```

### Taking Screenshots
```bash
node scripts/screenshot.mjs http://localhost:3000/about.html "Screenshot Label"
# Saves to Temp_Screenshots/screenshot-N-label.png
```

### Git Workflow
```bash
cd /path/to/website
git add .
git commit -m "Your message"
git push
# Auto-deploys to nodalwire.com via Hostinger
```

---

## Important Notes

### Web-Served Files
These files are deployed and served by Hostinger:
- All `.html` files
- `js/analytics.js`
- Everything in `assets/`
- `sitemap.xml`, `robots.txt`, `.htaccess`

### Development-Only Files
These are NOT deployed:
- `scripts/` directory
- `docs/` directory
- `node_modules/`
- `Temp_Screenshots/`
- `drafts/`

### Asset Path Updates
If you add new assets, ensure they're placed in `assets/` and referenced as:
```html
<img src="assets/brand/myimage.png" alt="...">
```

---

## Deployment

### Automatic Deployment
- When you push to GitHub, Hostinger auto-deploys within seconds
- Only root-level and `js/`, `assets/` files are deployed
- Documentation and scripts remain in git but aren't served

### Manual Verification
```bash
# Check that paths resolve correctly
curl https://www.nodalwire.com/js/analytics.js
curl https://www.nodalwire.com/sitemap.xml
```

---

## Maintenance

### Adding New Pages
1. Create `newpage.html` in root directory
2. Include all required SEO meta tags (see CLAUDE.md)
3. Add to `sitemap.xml`
4. Update navigation links on existing pages
5. Test locally: `http://localhost:3000/newpage.html`
6. Commit and push

### Adding New Assets
1. Place files in `assets/` subdirectory (brand/, images/, etc.)
2. Reference as `assets/subfolder/filename`
3. Commit and push
4. No additional configuration needed

### Updating Documentation
1. Edit files in `docs/` directory
2. Documentation changes don't affect deployed site
3. Commit for version control

---

**Last Updated:** June 12, 2026  
**Maintained By:** NodalWire Development Team
