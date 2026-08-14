import type { Metadata } from "next";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "bitNbuild",
  description: "GDG application — front-end build",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
