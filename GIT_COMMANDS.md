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
