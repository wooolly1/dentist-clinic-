import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { CLINIC } from "@/data/problems";

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

const SITE_URL = "https://lumieredental.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CLINIC.name} — Cinematic Dental Care`,
    template: `%s · ${CLINIC.name}`,
  },
  description:
    "An immersive, scroll-driven journey through modern dentistry. Travel from the patient chair into the mouth and meet the specialists who treat every condition with precision and care.",
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
    title: `${CLINIC.name} — Cinematic Dental Care`,
    description:
      "Travel from the patient chair into the mouth and explore dental care like never before.",
    url: SITE_URL,
    siteName: CLINIC.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC.name} — Cinematic Dental Care`,
    description:
      "An immersive, scroll-driven journey through modern dentistry.",
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
