"use client";

import {
  ArrowUp,
  ShieldCheck,
  Mail,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const SECTIONS = [
  { name: "About The Build", href: "#about" },
  { name: "Prizes & Bounties", href: "#prizes" },
  { name: "Domains & Tracks", href: "#domains" },
  { name: "Sponsors & Allies", href: "#sponsors" },
  { name: "FAQ Portal", href: "#faq" },
  { name: "Contact The Squad", href: "#contact" },
];

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/gdg_crce",
    handle: "@gdg_crce",
    accent: "#E1306C",
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/gdg-crce",
    handle: "GDG CRCE",
    accent: "#0077B5",
    icon: LinkedinIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/gdg-crce",
    handle: "gdg-crce",
    accent: "#FFE600",
    icon: GithubIcon,
  },
  {
    name: "Email",
    href: "mailto:gdgcrce@gmail.com",
    handle: "gdgcrce@gmail.com",
    accent: "#22b6d6",
    icon: Mail,
  },
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
      {/* Event Marquee Strip */}
      <div className="w-full bg-[#FFE600] py-2.5 overflow-hidden select-none border-b border-black">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[11px] md:text-xs font-black text-black uppercase tracking-widest gap-8">
          <span>BIT N BUILD 2026</span>
          <span>✦</span>
          <span>NATIONAL LEVEL HACKATHON</span>
          <span>✦</span>
          <span>24 HOURS OF INNOVATION</span>
          <span>✦</span>
          <span>ORGANIZED BY GDG CRCE</span>
          <span>✦</span>
          <span>OCTOBER 31 – NOVEMBER 1, 2026</span>
          <span>✦</span>
          <span>MUMBAI, INDIA</span>
          <span>✦</span>
          <span>BIT N BUILD 2026</span>
          <span>✦</span>
          <span>NATIONAL LEVEL HACKATHON</span>
          <span>✦</span>
          <span>24 HOURS OF INNOVATION</span>
          <span>✦</span>
          <span>ORGANIZED BY GDG CRCE</span>
          <span>✦</span>
          <span>OCTOBER 31 – NOVEMBER 1, 2026</span>
          <span>✦</span>
          <span>MUMBAI, INDIA</span>
          <span>✦</span>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-paper/10">

          {/* Column 1: Brand & Description (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div>

              {/* Title */}
              <h3 className="display text-3xl sm:text-4xl text-paper tracking-tight">
                Bit N Build <span className="text-[#FFE600]">2026</span>
              </h3>

              <p className="mt-3 font-sans text-muted text-sm leading-relaxed max-w-md">
                A 24-hour national hackathon presented by{" "}
                <span className="text-paper font-semibold">Google Developer Groups CRCE</span>. Where code, design, and interdimensional innovation collide.
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5308c]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                QUICK TRANSMISSIONS
              </span>
            </div>

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
          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  CONNECT WITH US
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SOCIALS.map((soc) => {
                  const Icon = soc.icon;
                  return (
                    <a
                      key={soc.name}
                      href={soc.href}
                      target={soc.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={soc.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="group flex items-center gap-2.5 rounded-lg border border-paper/15 bg-ink/80 p-2.5 backdrop-blur-sm transition-all hover:border-paper/40 hover:bg-paper/5 hover:-translate-y-0.5"
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-paper/15 bg-paper/5 transition-all group-hover:scale-105"
                        style={{ color: soc.accent }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <span className="font-mono text-xs font-bold text-paper transition-colors group-hover:text-white truncate">
                          {soc.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted truncate">
                          {soc.handle}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center justify-between w-full rounded-lg border border-paper/20 bg-ink/90 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-paper transition-all hover:border-paper/50 hover:bg-ink hover:-translate-y-0.5 cursor-pointer"
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

        </div>
      </div>
    </footer>
  );
}
