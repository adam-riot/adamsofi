import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CursorGlow from "@/components/ui/CursorGlow";

export const metadata: Metadata = {
  metadataBase: new URL("https://adamsofi.com"),
  title: {
    default: "AdamSofi — Landing Page Pantas untuk Bisnes Anda",
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
    title: "AdamSofi — Landing Page Pantas untuk Bisnes Anda",
    description: "Website profesional yang menjual — mobile-friendly, terus WhatsApp. Berpatutan, laju, draft percuma dulu.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AdamSofi — Web Development Malaysia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdamSofi — Landing Page Pantas untuk Bisnes Anda",
    description: "Website profesional yang menjual — mobile-friendly, terus WhatsApp.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport = { themeColor: "#08090d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>
        <CursorGlow />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
