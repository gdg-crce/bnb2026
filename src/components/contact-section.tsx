"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import contactBg from "../../public/images/contact-bg.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const SOCIALS = [
  { name: "Discord", url: "https://discord.gg", handle: "Official Arena", accent: "#5865F2" },
  { name: "Instagram", url: "https://instagram.com/gdgcrce", handle: "@gdgcrce", accent: "#E1306C" },
  { name: "LinkedIn", url: "https://linkedin.com/company/gdg-crce", handle: "GDG CRCE", accent: "#0077B5" },
  { name: "GitHub", url: "https://github.com/gdg-crce", handle: "gdg-crce", accent: "#f4f2ee" },
  { name: "X / Twitter", url: "https://x.com/gdg_crce", handle: "@gdg_crce", accent: "#22b6d6" },
  { name: "Devfolio", url: "https://devfolio.co", handle: "bit-n-build-2026", accent: "#3770FF" },
];

export default function ContactSection() {
  const root = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the contact backdrop
        gsap.fromTo(
          ".contact-backdrop",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Chromatic split on header
        gsap.fromTo(
          ".contact-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".contact-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".contact-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact-mark", start: "top 84%" },
        });

        gsap.from(".contact-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".contact-mark", start: "top 84%" },
        });

        // Form and info cards
        gsap.from(".contact-grid-item", {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 82%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <footer
      id="contact"
      ref={root}
      className="halftone relative z-10 overflow-hidden bg-void pt-28 md:pt-36"
    >
      {/* Real Dimensional Collider Portal Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="contact-backdrop absolute -top-[10%] -left-[5%] h-[120%] w-[110%]">
          <Image
            src={contactBg}
            alt="Dimensional Portal Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-30 brightness-90 contrast-125"
          />
        </div>
        {/* Scrim blending into void */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Section Header */}
        <div className="contact-mark relative mb-16 flex flex-col items-start md:mb-20">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-red shadow-[0_0_10px_#d6070c]" />
            <span className="eyebrow text-red">Dimensional Transmission // GDG CRCE</span>
          </div>

          <div className="relative mt-4">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`contact-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              Contact
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`contact-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              Contact
            </span>
            {/* Front Face */}
            <h2
              className={`contact-mark-face display relative text-paper ${MARK_SIZE}`}
            >
              Contact
            </h2>
          </div>

          <p className="contact-lede mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Have a proposal, sponsorship inquiry, or need squad matchmaking?
            Reach out to the Google Developer Groups CRCE organizing core directly.
          </p>
        </div>

        {/* Contact Grid: Form + Coordinates */}
        <div className="contact-grid grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Transmission Form */}
          <div className="contact-grid-item rounded-xl border-2 border-paper/20 bg-ink/90 p-7 backdrop-blur-md md:p-10">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFE600]">
                // Transmit Signal
              </span>
              <span className="font-mono text-xs text-muted">TRANSMISSION 2026</span>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#FFE600] font-mono text-xl font-bold text-black shadow-[3px_3px_0px_#000]">
                  ✓
                </div>
                <h3 className="mt-4 text-xl font-bold text-paper">
                  Signal Broadcasted!
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Our GDG organizing crew will decode your transmission and reach out
                  promptly via Email or Discord.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 font-mono text-xs text-[#22b6d6] hover:underline"
                >
                  Send another signal ➔
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-paper"
                  >
                    Name / Multiverse Alias
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Miles Morales"
                    className="mt-2 w-full rounded border-2 border-paper/15 bg-void/80 px-4 py-3 font-sans text-sm text-paper placeholder-muted/50 transition-colors focus:border-[#FFE600] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-paper"
                  >
                    Email Address / Discord Tag
                  </label>
                  <input
                    id="email"
                    type="text"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="miles@brooklyn.dev or miles#2099"
                    className="mt-2 w-full rounded border-2 border-paper/15 bg-void/80 px-4 py-3 font-sans text-sm text-paper placeholder-muted/50 transition-colors focus:border-[#FFE600] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-paper"
                  >
                    Transmission Content
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    placeholder="Tell us about your squad, track ideas, or inquiry..."
                    className="mt-2 w-full rounded border-2 border-paper/15 bg-void/80 px-4 py-3 font-sans text-sm text-paper placeholder-muted/50 transition-colors focus:border-[#FFE600] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 border-[2.5px] border-black bg-[#FFE600] py-3.5 font-mono text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]"
                >
                  <span>TRANSMIT MESSAGE</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    ➔
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Direct Signals & Coordinates */}
          <div className="contact-grid-item flex flex-col justify-between space-y-10">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#22b6d6]">
                // Ground Coordinates
              </span>
              <h3 className="mt-2 text-2xl font-bold text-paper">
                GDG CRCE // Mumbai
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Fr. Conceicao Rodrigues College of Engineering
                <br />
                Father Agnel Ashram, Bandstand Promenade,
                <br />
                Bandra (West), Mumbai, Maharashtra 400050
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="mailto:gdg@frcrce.ac.in"
                  className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-[#FFE600] hover:underline"
                >
                  <span>✉ gdg@frcrce.ac.in</span>
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                // Dimensional Channels
              </span>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SOCIALS.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col rounded border border-paper/15 bg-ink/80 p-3 backdrop-blur-sm transition-all hover:border-paper/40 hover:bg-paper/5"
                  >
                    <span className="font-mono text-xs font-bold text-paper transition-colors group-hover:text-white">
                      {soc.name}
                    </span>
                    <span className="font-mono text-[0.625rem] text-muted">
                      {soc.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Comic Footer Bar */}
        <div className="mt-24 border-t border-paper/10 py-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs font-black tracking-wider text-paper uppercase">
                BIT N BUILD // ED. 2026
              </span>
              <span className="text-xs text-muted">
                Organized by Google Developer Groups CRCE. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#top"
                className="font-mono text-xs font-bold uppercase text-[#FFE600] transition-transform hover:-translate-y-0.5 hover:underline"
              >
                ▲ BACK TO TOP
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
