import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
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

export const metadata: Metadata = {
  title: "bitNbuild",
  description: "A 24-hour build. Google Developer Groups.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
