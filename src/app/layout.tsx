import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/smooth-scroll";
import Navbar from "@/components/navbar";
import "./globals.css";

/*
 * Two families, each with a job. Archivo is a variable neo-grotesque — the
 * same tight, heavy, uppercase proportions as the title card baked into the
 * video, so the type below the fold reads as the same object as the type
 * inside it. JetBrains Mono handles micro-labels and the countdown, where
 * tabular figures are the whole point (digits must not jitter every second).
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bitnbuild.gdgcrce.com"),
  title: "Bit N Build 2026 | GDG CRCE",
  description: "Bit N Build 2026 is a hackathon organized by GDG CRCE.",
  keywords: [
    "Bit N Build",
    "Bit N Build 2026",
    "GDG CRCE",
    "hackathon",
    "Mumbai hackathon",
  ],
  alternates: {
    canonical: "https://bitnbuild.gdgcrce.com/",
  },
  authors: [{ name: "GDG CRCE", url: "https://gdgcrce.com" }],
  creator: "GDG CRCE",
  publisher: "GDG CRCE",
  applicationName: "Bit N Build 2026",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Bit N Build 2026 | GDG CRCE",
    description: "Bit N Build 2026, a hackathon by GDG CRCE.",
    url: "https://bitnbuild.gdgcrce.com/",
    siteName: "Bit N Build 2026",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Bit N Build 2026 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bit N Build 2026 | GDG CRCE",
    description: "Bit N Build 2026, a hackathon by GDG CRCE.",
    images: ["/logo.png"],
    creator: "@gdg_crce",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="canonical" href="https://bitnbuild.gdgcrce.com/" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="bg-black text-white antialiased selection:bg-[#ff2e88] selection:text-white">
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
