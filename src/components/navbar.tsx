"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const NAV_LEFT = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Timeline", href: "#timeline" },
  { name: "Domains", href: "#domains" },
];

const NAV_RIGHT = [
  { name: "Prizes", href: "#prizes" },
  { name: "Sponsors", href: "#sponsors" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

const ALL_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsExpanded(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4 pointer-events-none flex justify-center">
      {/* ── DESKTOP COLLAPSIBLE NAVBAR (hidden md:flex) ────────────────── */}
      <div className="hidden md:flex items-center justify-center pointer-events-auto">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className={`flex items-center justify-center rounded-full border transition-colors duration-300 ${
            isExpanded
              ? "bg-black/85 border-white/15 backdrop-blur-xl px-3.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
              : scrolled
              ? "bg-black/90 border-white/20 backdrop-blur-xl p-2 shadow-lg hover:border-white/40"
              : "bg-black/80 border-white/15 backdrop-blur-md p-2 shadow-md hover:border-white/30"
          }`}
        >
          {/* Left Expanding Wing (Home, About, Timeline, Domains) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, width: "auto", scaleX: 1 }}
                exit={{ opacity: 0, width: 0, scaleX: 0.8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden flex items-center origin-right"
              >
                <div className="flex items-center gap-1 lg:gap-2 pr-2 whitespace-nowrap">
                  {NAV_LEFT.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`${montserrat.className} text-[11px] lg:text-xs font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider px-2.5 py-1 rounded-full hover:bg-white/5`}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Interactive Diamond Logo Toggle Button */}
          <button
            type="button"
            onClick={toggleNavbar}
            aria-label={isExpanded ? "Close navigation" : "Open navigation"}
            className="relative flex items-center justify-center p-1 rounded-full cursor-pointer transition-transform duration-200 active:scale-95 group focus:outline-none"
          >
            <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="Bit N Build Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                priority
              />
            </div>
          </button>

          {/* Right Expanding Wing (Prizes, Sponsors, FAQ, Contact) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, width: "auto", scaleX: 1 }}
                exit={{ opacity: 0, width: 0, scaleX: 0.8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden flex items-center origin-left"
              >
                <div className="flex items-center gap-1 lg:gap-2 pl-2 whitespace-nowrap">
                  {NAV_RIGHT.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`${montserrat.className} text-[11px] lg:text-xs font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider px-2.5 py-1 rounded-full hover:bg-white/5`}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── MOBILE COLLAPSIBLE NAVBAR (md:hidden) ─────────────────────── */}
      <div className="md:hidden flex flex-col items-center pointer-events-auto">
        {/* Mobile Center Logo Button */}
        <motion.button
          type="button"
          onClick={toggleNavbar}
          aria-label={isExpanded ? "Close navigation" : "Open navigation"}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center p-2 rounded-full bg-black/85 border border-white/15 backdrop-blur-xl shadow-lg cursor-pointer focus:outline-none"
        >
          <Image
            src="/logo.png"
            alt="Bit N Build Logo"
            width={26}
            height={26}
            className="w-6 h-6 object-contain select-none pointer-events-none"
            priority
          />
        </motion.button>

        {/* Mobile Expandable Menu Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`${montserrat.className} mt-2 w-56 rounded-2xl bg-black/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-2.5 flex flex-col space-y-0.5`}
            >
              {ALL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 uppercase tracking-wider transition-colors text-center"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
