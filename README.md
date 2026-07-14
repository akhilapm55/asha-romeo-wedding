# Asha & Romeo — Wedding Invitation

A single-page, cinematic wedding invitation. Nileshwaram, Kerala · **28–29 December 2026**.

Built with **Next.js 14 (App Router) · TypeScript · TailwindCSS · GSAP + ScrollTrigger · Lenis smooth scroll · Framer Motion**. Mobile-first (most guests open it from WhatsApp), motion disabled under `prefers-reduced-motion`.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
```

The site runs fully in **preview mode without any backend** — the RSVP form will show its success animation (in dev) without storing anything. Wire up the backend below to actually collect RSVPs.

---

## ✏️ Editing content — ONE file

**All copy, dates, names, and data live in [`lib/content.ts`](lib/content.ts).** Nothing is hard-coded in components. Edit that file and everything updates.

- **Countdown:** change `COUNTDOWN_TARGET` (currently `2026-12-28T00:00:00+05:30`). When the Sangeet start time is confirmed, this is the only line to touch.
- Anything marked `PENDING` in the file is a labelled placeholder (empty state / "coming soon"), not a guess — fill these as details arrive.

### Still `PENDING` (see `content.ts` + the master list in the brief)
| Item | Where |
|---|---|
| Gallery photos (18–22) | `gallery` — 20 placeholder tiles ready |
| Couple caricature (hero + footer) | placeholder silhouettes |
| Sangeet start time | `COUNTDOWN_TARGET` / `events.sangeet` |
| 29 Dec "Arrival & refreshments" time | `events.wedding.schedule[0].time` |
| Gokulam Nalanda + Raj Residency details | `hotels` (name only — no invented data) |
| Explore-Kerala couple's own picks | `exploreKerala` (labelled "a few ideas from us") |
| RSVP deadline | `rsvp.deadline` (line hidden until set) |
| Domain | `seo.url` (sets `og:url`) |
| Contact person(s) / hashtag | `footer.contact`, `couple.hashtag` |

### Adding real photos
Replace the `<PhotoPlaceholder>` slots. Drop images into `public/` and swap the placeholder for a `next/image`. Quality guide: ≥2000px long side, well-lit, in focus. Photo plan is in the brief (Hero, Welcome, one per Story chapter, Gallery, closing).

---

## 🔌 RSVP backend (Google Sheets, no database)

The flow avoids the CORS trap — the **browser never calls Apps Script directly**:

```
Guest → POST /api/rsvp (Next server route) → Apps Script Web App → Google Sheet
Dashboard → GET /api/guests (gated) → Apps Script doGet → Google Sheet
```

### 1. Google Sheet + Apps Script
1. Create a Google Sheet. In **row 1**, add these headers in columns **A–P** (exact order):
   ```
   Timestamp | Name | Phone | WhatsApp | Flight Number | Arrival Airport | Arrival Time |
   Transport Required | Stay Required | Attire Preference | Dietary Preference | Dietary Notes |
   Traditional Attire Required | Departure Airport | Departure Time | Departure Transport Required
   ```
2. **Extensions → Apps Script**, paste [`apps-script/Code.gs`](apps-script/Code.gs), Save.
3. **Deploy → New deployment → Web app** · Execute as **Me** · Who has access **Anyone**. Copy the Web App URL.

### 2. Environment variables
Copy `.env.local.example` → `.env.local`:

```bash
APPS_SCRIPT_RSVP_URL=https://script.google.com/macros/s/……/exec
DASHBOARD_ACCESS_KEY=some-long-random-string
```

Restart `npm run dev` (or redeploy). RSVPs now append to the Sheet.

---

## 🔒 Private guest dashboard

**Route:** `/guest-dashboard?key=YOUR_DASHBOARD_ACCESS_KEY`

Unlinked anywhere on the site and gated by `DASHBOARD_ACCESS_KEY` (it holds guest PII — phones, WhatsApp, flights). Without the key you get a passphrase screen. It shows:

- Totals: guests, transport required, stay required, traditional dress
- Breakdowns: arrival/departure airport, dietary preference
- **Search** (name / phone / flight), **filters** (airport, transport, stay, diet), **Export CSV**

Data is read server-side via `/api/guests` (the Sheet/Script URL never reaches the browser). The page is also `noindex`.

---

## 📱 WhatsApp / SEO link preview

Open Graph + Twitter tags are set in `app/layout.tsx` from `lib/content.ts`.

- Set `seo.url` to the final domain so `og:url` and image URLs resolve.
- `public/og.svg` is an intentional palm-motif placeholder card (1200×630). **For real WhatsApp previews, replace it with a `og.png`** (many platforms don't render SVG `og:image`) and update the `images` path in `app/layout.tsx`.
- Favicon: `public/favicon.svg` (palm monogram).

---

## Project structure

```
app/
  layout.tsx              fonts, SEO/OG metadata
  page.tsx                assembles all sections
  globals.css             design tokens + utilities
  api/rsvp/route.ts       server-side RSVP forwarder
  api/guests/route.ts     gated dashboard read
  guest-dashboard/        private, key-gated dashboard
components/
  sections/               Hero, Welcome, Story, Events, Venue, Travel,
                          Stay, Explore, Gallery, Rsvp, Footer
  system/                 Nav, CustomCursor, FloatingLeaves, PalmConfetti
  providers/SmoothScroll  Lenis + ScrollTrigger sync
  ui/                     Reveal, SectionHeading, MagneticButton, Decor,
                          Placeholder
  dashboard/              Dashboard, KeyGate
lib/
  content.ts              ← SINGLE SOURCE OF TRUTH (all copy & data)
  gsap.ts, hooks.ts, cn.ts
apps-script/Code.gs       paste-ready Google Apps Script
```

---

## Accessibility & performance
- All decorative motion is gated by `prefers-reduced-motion`.
- Custom cursor / heavy parallax only on `pointer:fine` desktop widths.
- Fonts via `next/font` (self-hosted, no layout shift). Images should be lazy-loaded `next/image` when real photos land.
