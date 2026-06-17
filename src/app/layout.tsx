import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { CLINIC } from "@/data/clinic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://aureadental.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CLINIC.name} — Futuristic Dental Care`,
    template: `%s · ${CLINIC.name}`,
  },
  description:
    "An award-style, scroll-driven dental experience. Fly from a smiling patient into a fully interactive 3D jaw, click any tooth, and explore orthodontics, gum health, implants and cosmetic dentistry.",
  keywords: [
    "dental clinic",
    "dentist",
    "luxury dentistry",
    "dental implants",
    "root canal",
    "cosmetic dentistry",
    "periodontology",
    "endodontics",
  ],
  authors: [{ name: CLINIC.name }],
  openGraph: {
    title: `${CLINIC.name} — Futuristic Dental Care`,
    description:
      "Fly into an interactive 3D jaw and explore dental care like never before.",
    url: SITE_URL,
    siteName: CLINIC.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC.name} — Futuristic Dental Care`,
    description: "An award-style, scroll-driven 3D dental experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F365B",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.name,
  description: "Premium scroll-driven dental clinic experience.",
  telephone: CLINIC.phone,
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.address,
  },
  priceRange: "$$$",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
