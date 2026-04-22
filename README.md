# 🦷 Arcadia Dental — Premium Website

Ultra-premium dental practice website built with React + Vite.

---

## 🚀 Deploy to Netlify in 60 Seconds

### Option A — Drag & Drop (Fastest)

1. Install Node.js from https://nodejs.org (if you don't have it)
2. Open Terminal / Command Prompt in this folder
3. Run:
   ```
   npm install
   npm run build
   ```
4. Go to https://app.netlify.com/drop
5. Drag the `dist/` folder onto the page
6. ✅ Live in seconds!

---

### Option B — GitHub + Netlify (Best for updates)

1. Push this folder to a new GitHub repo
2. Go to https://app.netlify.com → "Add new site" → "Import from Git"
3. Select your repo
4. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
5. Click **Deploy** — done!
6. Every `git push` auto-deploys your changes.

---

## 🛠 Local Development

```bash
npm install
npm run dev
```
Opens at http://localhost:5173

---

## 📁 Project Structure

```
arcadia-dental/
├── index.html          # HTML entry point
├── netlify.toml        # Netlify build config
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── public/
│   ├── favicon.svg     # Site favicon
│   └── _redirects      # Netlify SPA routing
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full website (all sections)
```

---

## ✏️ Customization

All content is in `src/App.jsx`. To update:

| What to change | Where |
|---|---|
| Practice name | Search "ARCADIA DENTAL" |
| Phone number | Search "(212) 555-1234" |
| Address | Search "245 Park Avenue" |
| Doctors | Edit `DOCTORS` array |
| Services | Edit `SERVICES` array |
| Colors | Edit `:root` CSS variables |
| Testimonials | Edit `TESTIMONIALS` array |

---

Built with React 18 + Vite 6. No other dependencies required.
