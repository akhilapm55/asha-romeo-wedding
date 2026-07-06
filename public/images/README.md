# 📷 Images — where they go & what to name them

Drop your photos into these folders using the **exact filenames** below. Each one
appears on the site automatically. If a file is missing, that slot shows the
elegant "coming soon" placeholder instead — so you can add images gradually.

All names/paths are defined in [`lib/content.ts`](../../lib/content.ts) → `images`.
To use different names, edit that file.

**Format:** JPG for photos, **transparent PNG** for the two caricatures.
**Quality:** ≥ 2000px on the long side, well-lit, in focus. No text baked into art.

```
public/images/
├── couple/
│   ├── couple-hero.jpg          → Hero portrait (tall)
│   ├── caricature.png           → Hero watercolour caricature (transparent PNG)
│   └── caricature-waving.png    → Footer "waving goodbye" caricature (transparent PNG)
│
├── venue/
│   └── venue.jpg                → Venue beach shot (also used on the venue "Stay" card)
│
├── story/                        (one per timeline chapter)
│   ├── 2020-stony-brook.jpg     → Aug 2020 · A chance beginning
│   ├── 2021-us-move.jpg         → 2021 · From screen to reality
│   ├── 2022-study-years.jpg     → 2022 · Study partners to friends
│   ├── 2023-dc.jpg              → 2023 · Love finds its words (Washington D.C.)
│   ├── 2025-proposal.jpg        → 2025 · The proposal
│   └── 2026-graduation.jpg      → 2026 · Together, at last
│
├── kerala/                       (Explore Kerala cards)
│   ├── bekal-fort.jpg
│   ├── backwaters.jpg           → Valiyaparamba Backwaters
│   ├── ranipuram.jpg
│   ├── kayaking.jpg             → Backwater Kayaking
│   └── anandashram.jpg
│
├── stay/                         (other hotels — venue card reuses venue/venue.jpg)
│   ├── gokulam-nalanda.jpg
│   └── raj-residency.jpg
│
└── gallery/                      (masonry gallery — up to 20)
    ├── gallery-01.jpg
    ├── gallery-02.jpg
    │   …
    └── gallery-20.jpg
```

## Notes
- **Caricatures** must be transparent PNGs with **no baked-in text** (all wording on
  the site is live HTML). A watercolour caricature of the couple is expected for the
  hero and footer.
- To add **more than 20** gallery photos, extend the `gallery` array length in
  `lib/content.ts`.
- The **OG / WhatsApp preview** image is separate — it lives at `public/og.svg`.
  Replace it with a real `public/og.png` (1200×630) for proper WhatsApp previews
  (see the main README).
