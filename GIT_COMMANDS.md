# Git Quick Reference — NodalWire Website

## First — Open Terminal and go to the project folder
```bash
cd "/Users/surendrannatarajan/Library/Mobile Documents/com~apple~CloudDocs/NodalWire/07.Website_Project"
```

---

## Save changes to GitHub (do this every time you update the site)
```bash
git add -A
git commit -m "describe what you changed"
git push
```

**Example:**
```bash
git add -A
git commit -m "Updated hero section on home page"
git push
```

---

## Check what files have been changed (before committing)
```bash
git status
```

---

## View history of all past commits
```bash
git log --oneline
```

---

## Start the local dev server (to preview the site)
```bash
node serve.mjs
```
Then open your browser at: **http://localhost:3000**

---

## Take a screenshot of any page
```bash
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000/about.html
```
Screenshots are saved in the `Temp_Screenshots/` folder.

---

## GitHub Repository
https://github.com/NodalWire/NodalWire_WebSite

---

## How the Live Site Updates (GitHub → Hostinger Auto-Deploy)

Once set up, every `git push` automatically updates **nodalwire.com** within seconds. No manual uploading needed.

### One-time setup (already done — for reference only)

1. **Empty `public_html`** in Hostinger File Manager — delete all files before connecting
2. **hPanel → Advanced → GIT → Create a New Repository:**
   - Repository: `https://YOUR_TOKEN@github.com/NodalWire/NodalWire_WebSite.git`
   - Branch: `main`
   - Directory: *(leave blank — deploys to public_html)*
   - Click **Create**
3. Scroll down to **Manage Repositories** — toggle **Auto-deploy ON**

### If you need a new GitHub token (PAT)

1. github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Name: `Hostinger Deploy` — check the **`repo`** checkbox
4. Copy the token immediately — it is shown only once
5. **Never paste the token in chat or anywhere public**
6. Use it in the Repository URL: `https://TOKEN@github.com/NodalWire/NodalWire_WebSite.git`

### Your daily workflow (all you need)

```bash
cd "/Users/surendrannatarajan/Library/Mobile Documents/com~apple~CloudDocs/NodalWire/07.Website_Project"
git add -A
git commit -m "describe what you changed"
git push
```

→ Hostinger auto-deploys within a few seconds → site is live.
