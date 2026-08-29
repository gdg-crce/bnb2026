"use client";

import { ArrowUp, Mail, MapPin } from "lucide-react";
import { Montserrat, Squada_One } from "next/font/google";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const QUICK_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Timeline", href: "#timeline" },
  { name: "Domains", href: "#domains" },
  { name: "Prizes", href: "#prizes" },
  { name: "Sponsors", href: "#sponsors" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/gdg_crce", label: "@gdg_crce" },
  { name: "LinkedIn", href: "https://linkedin.com/company/gdg-crce", label: "GDG CRCE" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={`${montserrat.className} relative z-20 w-full overflow-hidden bg-[#070b14] text-white pt-10 pb-6 px-6 sm:px-12 border-t border-white/10 select-none`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8 border-b border-white/10">
        {/* Col 1: Brand & Tagline */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className={`${squada.className} text-3xl sm:text-4xl text-[#ffd369] tracking-wider uppercase leading-none`}>
              BIT N BUILD 2026
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm font-normal">
              An International hackathon by <span className="text-white font-semibold">GDG CRCE</span>. Join with developers for coding, learning, and building amazing projects!
            </p>
          </div>

          {/* Social Links (Instagram & LinkedIn only) */}
          <div className="flex items-center gap-5 mt-6">
            {SOCIALS.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                aria-label={soc.name}
                className="text-xs sm:text-sm text-white/70 hover:text-[#ffd369] transition-colors font-medium"
              >
                {soc.name}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="md:col-span-4">
          <h4 className={`${squada.className} text-xl sm:text-2xl text-[#ffd369] tracking-wider uppercase mb-3`}>
            QUICK LINKS
          </h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm text-white/70 font-normal">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: Contact */}
        <div className="md:col-span-3">
          <h4 className={`${squada.className} text-xl sm:text-2xl text-[#ffd369] tracking-wider uppercase mb-3`}>
            CONTACT
          </h4>
          <div className="space-y-3 text-xs sm:text-sm text-white/80 font-normal">
            <a
              href="mailto:gdgcrce@gmail.com"
              className="flex items-center gap-2.5 hover:text-[#ffd369] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#ffd369] shrink-0" />
              <span>gdgcrce@gmail.com</span>
            </a>
            <div className="flex items-start gap-2.5 text-white/70">
              <MapPin className="w-4 h-4 text-[#ffd369] shrink-0 mt-0.5" />
              <span>CRCE, Bandra West, Mumbai, Maharashtra</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex items-center justify-between text-xs text-white/50 font-normal">
        <div>
          © 2026 Bit N Build. All rights reserved. <span className="text-[#ffd369] font-medium">GDG CRCE</span>
        </div>

        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="p-2.5 rounded-full bg-[#d6070c] hover:bg-[#ff2e35] text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
