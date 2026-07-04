import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adamsofi.com"),
  title: {
    default: "AdamSofi - Landing Page Pantas untuk Bisnes Anda",
    template: "%s | AdamSofi",
  },
  description:
    "Landing page profesional untuk bisnes Malaysia. Mobile-friendly, pelanggan terus WhatsApp anda, draft percuma dulu. Pakej bermula RM500.",
  keywords: ["landing page Malaysia", "website bisnes", "web developer Malaysia", "buat website murah", "AdamSofi"],
  authors: [{ name: "AdamSofi" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "AdamSofi",
    locale: "ms_MY",
    url: "https://adamsofi.com/",
    title: "AdamSofi - Landing Page Pantas untuk Bisnes Anda",
    description: "Website profesional yang menjual - mobile-friendly, terus WhatsApp. Berpatutan, laju, draft percuma dulu.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AdamSofi - Web Development Malaysia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdamSofi - Landing Page Pantas untuk Bisnes Anda",
    description: "Website profesional yang menjual - mobile-friendly, terus WhatsApp.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.svg" },
  // Google Search Console: set GOOGLE_SITE_VERIFICATION in Vercel env, redeploy,
  // then verify via the "HTML tag" method in GSC.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport = { themeColor: "#08090d" };

// A per-request CSP nonce (set in middleware.ts) can only be applied to Next's
// <script> tags when pages render dynamically. This opts the app out of static
// caching in exchange for a strict, nonce-based Content-Security-Policy.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") || "ms";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
