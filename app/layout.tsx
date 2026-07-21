import type { Metadata, Viewport } from "next";
import { Montserrat, Sacramento, Allura } from "next/font/google";
import "./globals.css";
import { seo, eventMeta } from "@/lib/content";

// Light, widely-tracked sans for everything (display + body), matching the
// save-the-date. One family keeps it minimal and cohesive.
const sans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
// Casual, slanted handwriting for accent words ("the", "formal invitation…").
const script = Sacramento({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});
// Flowing calligraphic script for the hero couple names.
const hero = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hero",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: seo.url ? new URL(seo.url) : undefined,
  title: seo.title,
  description: seo.description,
  applicationName: "Asha & Romeo",
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    url: seo.url || undefined,
    siteName: "Asha & Romeo",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: `Asha & Romeo — ${eventMeta.shortDate}, Nileshwaram, Kerala`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF7EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${script.variable} ${hero.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
