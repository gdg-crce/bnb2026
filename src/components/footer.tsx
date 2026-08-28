"use client";

import {
  ArrowUp,
  Compass,
  ShieldCheck,
  Radio
} from "lucide-react";

const SECTIONS = [
  { name: "About The Build", href: "#about" },
  { name: "Prizes & Bounties", href: "#prizes" },
  { name: "Domains & Tracks", href: "#domains" },
  { name: "Sponsors & Allies", href: "#sponsors" },
  { name: "FAQ Portal", href: "#faq" },
  { name: "Contact The Squad", href: "#contact" },
];

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/gdgcrce", handle: "@gdgcrce", accent: "#E1306C" },
  { name: "LinkedIn", href: "https://linkedin.com/company/gdg-crce", handle: "GDG CRCE", accent: "#0077B5" },
  { name: "Discord", href: "https://discord.gg/gdgcrce", handle: "Official Arena", accent: "#5865F2" },
  { name: "GitHub", href: "https://github.com/gdg-crce", handle: "gdg-crce", accent: "#FFE600" },
  { name: "X / Twitter", href: "https://x.com/gdg_crce", handle: "@gdg_crce", accent: "#22b6d6" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="halftone relative z-20 w-full overflow-hidden bg-void border-t border-paper/10 text-paper font-sans"
    >
      {/* Spider-Verse Warning Marquee Banner */}
      <div className="w-full bg-[#FFE600] py-2 overflow-hidden select-none">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[0.6875rem] md:text-xs font-black text-black uppercase tracking-widest gap-8">
          <span>// MULTIVERSE TRANSMISSION // 24 HOURS // ASSEMBLE YOUR CREW</span>
          <span>•</span>
          <span>// BIT N BUILD 2026 // MUMBAI MULTIVERSE // EARTH-1610 x EARTH-616</span>
          <span>•</span>
          <span>// CREATORS, HACKERS & DISRUPTORS // COLLIDE ACROSS DIMENSIONS</span>
          <span>•</span>
          <span>// MULTIVERSE TRANSMISSION // 24 HOURS // ASSEMBLE YOUR CREW</span>
          <span>•</span>
          <span>// BIT N BUILD 2026 // MUMBAI MULTIVERSE // EARTH-1610 x EARTH-616</span>
          <span>•</span>
          <span>// CREATORS, HACKERS & DISRUPTORS // COLLIDE ACROSS DIMENSIONS</span>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-paper/10">

          {/* Column 1: Brand & Description (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Coordinates Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-paper/5 border border-paper/15 font-mono text-[10px] uppercase tracking-widest text-[#22b6d6] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5308c] animate-ping" />
                DIMENSION-616 // EARTH-1610 // MUMBAI
              </div>

              {/* Title */}
              <h3 className="display text-3xl sm:text-4xl text-paper tracking-tight">
                Bit N Build <span className="text-[#FFE600]">2026</span>
              </h3>

              <p className="mt-3 font-sans text-muted text-sm leading-relaxed max-w-md">
                A 24-hour national hackathon presented by{" "}
                <span className="text-paper font-semibold">Google Developer Groups CRCE</span>. Where code, design, and interdimensional innovation collide.
              </p>
            </div>

            {/* Code Authority Badge */}
            <div className="inline-flex items-center gap-3 p-3 rounded-lg bg-ink/90 border border-paper/15 w-fit">
              <div className="w-8 h-8 rounded bg-[#d6070c] border border-black flex items-center justify-center text-white font-bold text-sm shadow-[2px_2px_0px_#000]">
                🕷️
              </div>
              <div>
                <div className="font-mono text-[9px] font-bold tracking-widest text-[#FFE600] uppercase">
                  APPROVED BY
                </div>
                <div className="font-mono text-xs font-bold text-paper uppercase tracking-wider">
                  MULTIVERSE CODE AUTHORITY
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#22b6d6] mb-6 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#22b6d6]" />
              // Sector Jumps
            </h4>

            <ul className="space-y-3 font-mono text-xs">
              {SECTIONS.map((sec, idx) => (
                <li key={idx}>
                  <a
                    href={sec.href}
                    className="text-muted hover:text-paper inline-flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-[#e5308c] group-hover:text-[#FFE600] transition-colors">
                      ›
                    </span>
                    {sec.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Socials & Back to Top (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-8">
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#e5308c]" />
                // Dimensional Channels
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {SOCIALS.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded border border-paper/15 bg-ink/80 p-2.5 backdrop-blur-sm transition-all hover:border-paper/40 hover:bg-paper/5"
                  >
                    <span className="font-mono text-xs font-bold text-paper transition-colors group-hover:text-white">
                      {soc.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {soc.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center justify-between w-full rounded-lg border border-paper/20 bg-ink/90 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-paper transition-all hover:border-paper/50 hover:bg-ink hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <span>🕸️</span>
                <span>Back To Top</span>
              </span>
              <ArrowUp className="w-4 h-4 text-[#FFE600]" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-mono text-xs text-muted">
            © 2026 <span className="text-paper font-bold">Bit N Build</span>. Organized by{" "}
            <span className="text-[#FFE600] font-bold">GDG CRCE</span>.
          </p>

          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22b6d6]" />
              SECURE TRANSMISSION
            </span>
            <span>•</span>
            <span className="text-muted/60">EARTH-1610</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
