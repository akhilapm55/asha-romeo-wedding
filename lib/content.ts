/* ============================================================================
   ASHA & ROMEO — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Every word, date and field on the site is edited HERE. Content is locked to
   the couple's approved copy (Part B). Treat every `PENDING` as a slot to fill,
   never a blank to guess.  The month is DECEMBER — never June.
   ============================================================================ */

/** Countdown target — start of celebrations, 28 Dec 2026, IST.
 *  When the Sangeet start time is confirmed, change ONLY this line. */
export const COUNTDOWN_TARGET = "2026-12-28T00:00:00+05:30";

export const PENDING = "coming soon" as const;

export const couple = {
  bride: { first: "Asha", full: "Asha Venugopalan" },
  groom: { first: "Romeo", full: "Romeo Gray" },
  hashtag: "" /* PENDING / optional */,
  tagline: "Two worlds. One love. One celebration.",
};

export const families = {
  brideParents: "Jalaja Venugopalan & Venugopalan CM",
  groomParents: "Alejandrina Gray & Michael Gray",
  venugopalans: "Jalaja, Venu and Akshay",
  grays: "Alejandrina, Michael, Cesar and Michael Jr",
};

export const eventMeta = {
  dateLine: "28 and 29 December, 2026",
  shortDate: "28–29 Dec 2026",
  location: "Nileshwaram (Nileshwar), Kerala, India",
};

export const venue = {
  name: "Malabar Ocean Front Resort & Spa",
  website: "https://www.malabarresort.com/",
  mapUrl: "https://maps.app.goo.gl/XnqqNfuTtajAn3s89",
  address:
    "Ozhinhavalappu Post, Harbour Rd, Nileshwar, Bekal, Kerala 671314, India",
  distances: [
    { label: "Mangalore (IXE)", detail: "≈ 1.5–2 hrs by car", recommended: true },
    { label: "Kannur (CNN)", detail: "≈ 3–4 hrs by car", recommended: false },
  ],
};

export const welcome = {
  invitation:
    "Jalaja Venugopalan & Venugopalan CM, and Alejandrina Gray & Michael Gray invite you to celebrate the wedding of Asha Venugopalan and Romeo Gray.",
  emphasis: "Asha Venugopalan and Romeo Gray.",
};

/* -------------------------------------------------------------------------- */
/*  OUR STORY — chapters in exact order, copy verbatim                         */
/* -------------------------------------------------------------------------- */
export interface StoryChapter {
  year: string;
  title: string;
  place?: string;
  paras: string[];
}

export const storyTeaser = "Six years after a Zoom call changed everything…";

export const story: StoryChapter[] = [
  {
    year: "August 2020",
    title: "A chance beginning",
    place: "Stony Brook University",
    paras: [
      "It started on Zoom. In the middle of a global pandemic, two strangers began their PhD journeys together at Stony Brook University — Asha from India, Romeo from the US. Between virtual lectures and Zoom seminars, something quietly began.",
    ],
  },
  {
    year: "2021",
    title: "From screen to reality",
    place: "United States",
    paras: [
      "Asha made the big move to the United States and they finally met in person. At parties, in hallways and around their offices, they got to know each other.",
    ],
  },
  {
    year: "2022",
    title: "Study partners to friends",
    paras: [
      "Exam season pulled them together — shared notes, late study sessions, and somewhere between flashcards and textbooks, they became indispensable. Romeo even helped Asha move apartments. Long walks and a shared love of dancing did the rest: dinners, parties, dance floors, movie theatres. (Romeo called the dinners dates. Asha called them dinner with a friend. Romeo was right about those too.)",
    ],
  },
  {
    year: "2023",
    title: "Love finds its words",
    place: "Washington, D.C.",
    paras: [
      "After Asha's first trip back to India, Romeo told her he'd missed her and asked her to spend Valentine's Day with him. Months later, at a basketball game in Washington, D.C. — bright lights, a roaring crowd — they finally said what had gone unspoken for years. Soon after, the families met: Asha with Romeo's, and Romeo flying all the way to India for hers. Two worlds, already building bridges.",
    ],
  },
  {
    year: "2025",
    title: "The question she didn't see coming",
    paras: [
      "On Asha's birthday, Romeo planned a lunch at a vineyard — Asha's parents by his side, in on the secret the whole time. In the middle of that golden afternoon, surrounded by the people who love her most, Romeo got down on one knee and asked her to be his wife. She said yes.",
    ],
  },
  {
    year: "2026",
    title: "Together, at last",
    paras: [
      "Six years after a Zoom call changed everything, Asha and Romeo graduated together — PhDs in hand, families gathered, hearts full. What began as a shared academic journey became a shared life. And now, surrounded by everyone they love, they begin the next chapter.",
    ],
  },
];

export const storyEpilogue = {
  title: "Building a life together",
  paras: [
    "Falling in love is one thing. Growing together is another.",
    "Through grief and celebration alike, they showed up for each other — losing loved ones, cheering every paper submission and interview call, every small win that deserved its moment. In the hard years of doctoral life, they became each other's steadiest ground.",
    "Along the way, they learned each other's worlds one plate at a time. Asha introduced Romeo to South Indian food — he is now a devoted dosa enthusiast and will not hear a word against it. Malabar porotta? Delicious! Romeo introduced Asha to Mexican and Puerto Rican food. She loves tostadas and arroz con gandules, and considers both life-changing discoveries. Pernil? Yes please!",
    "And in the weekends and half-price Tuesdays, they watched movies together. Asha cries through emotional films — reliably, completely, without apology. Romeo comforts her, every time. And somewhere along the way, he watched Manichitrathazhu. It is now one of his favourite movies. (Thom thom thom!)",
  ],
};

/* -------------------------------------------------------------------------- */
/*  WEDDING EVENTS                                                             */
/* -------------------------------------------------------------------------- */
export interface RunOfShow {
  time: string;
  title: string;
  detail: string;
  ritual?: string[];
}

export const events = {
  sangeet: {
    day: "28 December",
    name: "Sangeet",
    when: "Evening · Outdoors",
    blurb:
      "A fun evening to ring in the celebrations — expect music, dancing, and many a stroll down memory lane. Come ready to move, laugh, and celebrate.",
    attire:
      "Colourful Indian or western wear. Most important rule: can you dance in it?",
  },
  wedding: {
    day: "29 December",
    name: "Wedding",
    when: "Morning · Outdoors",
    blurb:
      "A Kerala wedding — simple in its rituals, deeply meaningful in spirit. The Muhurtam ceremony, a traditional sadya feast on plantain leaves, and an unhurried afternoon by the coast.",
    attire:
      "Traditional Indian wear or western cocktail wear. Please avoid black and red — the bride will be in red or maroon, and we'd love for her to stand out.",
    schedule: [
      {
        time: PENDING,
        title: "Arrival & refreshments",
        detail: "Come early, settle in, and help yourself to refreshments.",
      },
      {
        time: "11am",
        title: "Muhurtam",
        detail:
          "The wedding ceremony begins. A Kerala wedding is a beautiful, intimate affair — simple in its rituals, deeply meaningful in its spirit. The ceremony unfolds gently, each moment unhurried, each one carrying the weight of something that has been done with love for generations.",
        ritual: [
          "The tying of the thali, the sacred thread that binds them in marriage;",
          "The exchange of garlands as the couple welcome each other;",
          "The gifting of the pudava, the saree given by the groom's family, marking the bride's acceptance and her welcome into her new home.",
        ],
      },
      {
        time: "12pm",
        title: "Sadya lunch",
        detail:
          "A traditional Kerala feast served on a fresh plantain leaf, in the time-honoured way. Get ready for rice, curries, pickles, payasam, and more. Yes, you will be eating with your hands. Yes, it will be delicious. Someone at your table will show you how.",
      },
      {
        time: "After lunch",
        title: "The afternoon is yours",
        detail:
          "Explore the town, find the backwaters, or simply sit and soak it all in.",
      },
    ] as RunOfShow[],
  },
};

/* -------------------------------------------------------------------------- */
/*  TRAVEL                                                                     */
/* -------------------------------------------------------------------------- */
export const travel = {
  intro:
    "Tucked into the northern tip of Kerala, Nileshwaram is where Asha's family has its roots and where this celebration begins.",
  steps: [
    {
      step: "01",
      title: "Flying to India",
      body: "Flights to India typically route through an international hub — common ones include London, Frankfurt, Dubai, and Doha, though this will vary depending on where you're flying from. When booking, aim to land at either Mumbai (BOM) or Bengaluru (BLR) as your Indian arrival city, as these have the most onward connections to Kerala.",
    },
    {
      step: "02",
      title: "Getting to Nileshwaram",
      body: "From your Indian arrival city, two regional airports bring you within reach of Nileshwaram.",
      airports: [
        {
          code: "IXE",
          name: "Mangalore",
          recommended: true,
          note: "The closest airport to Nileshwaram, about 1.5–2 hours by car. Many flights from Dubai and Doha also connect directly to Mangalore, so depending on your routing, you may not need to go through Mumbai or Bengaluru at all.",
        },
        {
          code: "CNN",
          name: "Kannur",
          recommended: false,
          note: "A little further out — about 3–4 hours by car — but a good option depending on your flight connections.",
        },
      ],
    },
  ],
  transportNote:
    "If you let us know your arrival details, the event organizers will be happy to help arrange transportation from Mangalore to Nileshwaram.",
  languageNote:
    "The local language is Malayalam, but English is widely spoken so you will have no trouble getting around.",
};

/* -------------------------------------------------------------------------- */
/*  WHERE TO STAY                                                              */
/* -------------------------------------------------------------------------- */
export interface Hotel {
  name: string;
  status: "ready" | "pending";
  tag?: string;
  address?: string;
  distance?: string;
  website?: string;
  mapUrl?: string;
}

export const hotels: Hotel[] = [
  {
    name: "Malabar Ocean Front Resort & Spa",
    status: "ready",
    tag: "The venue",
    address: venue.address,
    distance: "You're already here",
    website: venue.website,
    mapUrl: venue.mapUrl,
  },
  { name: "Gokulam Nalanda", status: "pending" },
  { name: "Raj Residency", status: "pending" },
];

/* -------------------------------------------------------------------------- */
/*  EXPLORE KERALA — "a few ideas from us" (couple's own picks PENDING)        */
/* -------------------------------------------------------------------------- */
export interface Place {
  name: string;
  kind: string;
  blurb: string;
}

export const exploreKerala: Place[] = [
  { name: "Bekal Fort", kind: "Coastal fort", blurb: "Kerala's largest fort, curved against the Arabian Sea — sunset here is unforgettable." },
  { name: "Valiyaparamba Backwaters", kind: "Houseboats", blurb: "Glide the palm-lined backwaters on a traditional houseboat, water on every side." },
  { name: "Ranipuram", kind: "Hill station", blurb: "Misty shola forests and grasslands — a cool green escape inland." },
  { name: "Backwater Kayaking", kind: "On the water", blurb: "Paddle quiet channels at dawn as the villages slowly wake around you." },
  { name: "Anandashram", kind: "Kanhangad", blurb: "A serene spiritual retreat, unhurried and still, a short drive from the coast." },
];

/* -------------------------------------------------------------------------- */
/*  GALLERY — all photos PENDING; placeholders sized to plan                   */
/* -------------------------------------------------------------------------- */
export interface GalleryTile {
  id: number;
  orientation: "portrait" | "landscape";
  caption: string;
}
// 14 tiles, mixed orientation, per the available photos.
export const gallery: GalleryTile[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  orientation: [0, 3, 4, 7, 8, 11, 12, 15, 16, 19].includes(i)
    ? "portrait"
    : "landscape",
  caption: "Photo coming soon",
}));

/* -------------------------------------------------------------------------- */
/*  IMAGES — drop files into /public/images/… with these EXACT names and they  */
/*  appear automatically. A missing file falls back to the elegant             */
/*  placeholder, so it is safe to leave any of these unfilled.                 */
/*  Recommended: JPG for photos, transparent PNG for the caricatures,          */
/*  ≥2000px on the long side, well-lit and in focus.                           */
/* -------------------------------------------------------------------------- */
export const images = {
  // Hero + footer
  heroCouple: "/images/couple/couple-hero.jpg",
  heroCaricature: "/images/couple/caricature.png", // transparent PNG, no baked text
  footerCaricature: "/images/couple/caricature-waving.png", // transparent PNG

  // Venue beach shot
  venue: "/images/venue/venue.jpg",

  // Our Story — one per chapter, keyed by the chapter's `year`
  story: {
    "August 2020": "/images/story/2020-stony-brook.jpg",
    "2021": "/images/story/2021-us-move.jpg",
    "2022": "/images/story/2022-study-years.jpg",
    "2023": "/images/story/2023-dc.jpg",
    "2025": "/images/story/2025-proposal.jpg",
    "2026": "/images/story/2026-graduation.jpg",
  } as Record<string, string>,

  // Explore Kerala — keyed by place name
  explore: {
    "Bekal Fort": "/images/kerala/bekal-fort.jpg",
    "Valiyaparamba Backwaters": "/images/kerala/backwaters.jpg",
    Ranipuram: "/images/kerala/ranipuram.jpg",
    "Backwater Kayaking": "/images/kerala/kayaking.jpg",
    Anandashram: "/images/kerala/anandashram.jpg",
  } as Record<string, string>,

  // Where to stay — keyed by hotel name (the venue reuses the venue shot)
  hotels: {
    "Malabar Ocean Front Resort & Spa": "/images/venue/venue.jpg",
    "Gokulam Nalanda": "/images/stay/gokulam-nalanda.jpg",
    "Raj Residency": "/images/stay/raj-residency.jpg",
  } as Record<string, string>,

  // Gallery — gallery-01.jpg … gallery-14.jpg
  gallery: Array.from(
    { length: 14 },
    (_, i) => `/images/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`
  ),
};

/* -------------------------------------------------------------------------- */
/*  RSVP — deadline PENDING (line hidden until supplied)                       */
/* -------------------------------------------------------------------------- */
export const rsvp = {
  deadline: "" /* PENDING — e.g. "1 November 2026" */,
  successTitle: "Thank you",
  successBody:
    "Your RSVP is on its way to Asha & Romeo. We can't wait to celebrate with you in Nileshwaram.",
};

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                     */
/* -------------------------------------------------------------------------- */
export const footer = {
  message:
    "With love and gratitude, we can't wait to begin this next chapter surrounded by the people who mean the most to us.",
  signoff: "See you in Nileshwaram.",
  contact: "" /* PENDING — contact person(s) */,
};

/* -------------------------------------------------------------------------- */
/*  SEO / OG                                                                   */
/* -------------------------------------------------------------------------- */
export const seo = {
  title: "Asha & Romeo · 28–29 December 2026",
  description:
    "Join us in Nileshwaram, Kerala, for a two-day celebration. Tap for the story, schedule, travel & to RSVP.",
  url: "" /* PENDING final domain — sets og:url */,
};

/* Section ids for in-page nav */
export const sections = [
  { id: "hero", label: "Home" },
  { id: "welcome", label: "Welcome" },
  { id: "story", label: "Our Story" },
  { id: "events", label: "Events" },
  { id: "venue", label: "Venue" },
  { id: "travel", label: "Travel" },
  { id: "stay", label: "Stay" },
  { id: "explore", label: "Kerala" },
  { id: "gallery", label: "Gallery" },
  { id: "rsvp", label: "RSVP" },
] as const;
