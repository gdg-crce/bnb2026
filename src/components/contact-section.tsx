"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Phone, Mail, ArrowUpRight, Copy, Check, User, Radio } from "lucide-react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import bridgeBg from "../../public/images/contact-bridge.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const CONTACTS = [
  {
    name: "Kevin Synet",
    role: "HEAD OF OPERATIONS",
    phone: "+91 84468 58648",
    accent: "#ff2e88", // Gwen Hot Pink
    glowColor: "rgba(255, 46, 136, 0.4)",
    strandColor: "#ff2e88",
    rotation: "-rotate-1",
  },
  {
    name: "Varad Joshi",
    role: "MANAGEMENT HEAD",
    phone: "+91 9082158583",
    accent: "#FFE600", // Miles Electric Yellow
    glowColor: "rgba(255, 230, 0, 0.4)",
    strandColor: "#FFE600",
    rotation: "rotate-1",
  },
  {
    name: "Abhishek Jose",
    role: "TECHNICAL LEAD",
    phone: "+91 77389 69557",
    accent: "#00f0ff", // 2099 Laser Cyan
    glowColor: "rgba(0, 240, 255, 0.4)",
    strandColor: "#00f0ff",
    rotation: "-rotate-1",
  },
];

export default function ContactSection() {
  const root = useRef<HTMLElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Chromatic split on header
        gsap.fromTo(
          ".contact-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".contact-mark", start: "top 90%" },
          },
        );

        const split = new SplitText(".contact-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".contact-mark", start: "top 90%" },
        });

        gsap.from(".contact-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".contact-mark", start: "top 90%" },
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="contact"
      className="halftone relative z-10 w-full overflow-hidden bg-void py-24 md:py-36 px-6 font-sans text-paper"
    >
      {/* Spider-Verse Brooklyn Bridge Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={bridgeBg}
            alt="Spider-Verse Brooklyn Bridge Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-40 brightness-90 contrast-125 saturate-125"
          />
        </div>

        {/* Noir Vignette & Radial Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/65 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,7,11,0.5)_50%,rgba(8,7,11,0.95)_100%)]" />

        {/* Ambient Neon Atmosphere Glows */}
        <div className="absolute top-1/3 -left-20 h-96 w-96 rounded-full bg-[#ff2e88]/15 blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 h-96 w-96 rounded-full bg-[#00f0ff]/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl">

        {/* ========================================================================= */}
        {/* SECTION HEADER: Consistent Typography with Chromatic Ghost Split */}
        {/* ========================================================================= */}
        <div className="contact-mark relative mb-20 flex flex-col items-start md:mb-24">
          

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
            Have questions about the hackathon, tracks, or sponsorships? Reach out directly to our organizing leads.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CARDS CONTAINER: WEB STRANDS DANGLING AROUND TAPED POSTER CARDS */}
        {/* ========================================================================= */}
        <div className="contact-cards-container relative mb-20">

          {/* Top Structural Web Anchors with SVG Geometry */}
          <div className="hidden md:flex justify-around px-16 relative z-0 pointer-events-none -mb-3">
            {CONTACTS.map((contact, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Intricate Spider Web Top Corner */}
                <svg
                  className="w-16 h-12 opacity-65 overflow-visible"
                  viewBox="0 0 64 48"
                  fill="none"
                  stroke={contact.accent}
                  strokeWidth="1.5"
                >
                  <path d="M 0 0 Q 32 16 64 0" strokeDasharray="3 3" />
                  <path d="M 12 0 Q 32 26 52 0" />
                  <path d="M 22 0 Q 32 36 42 0" strokeDasharray="2 2" />
                  <path d="M 32 0 L 32 48" strokeWidth="2.5" />
                  <path d="M 16 10 L 32 48" opacity="0.6" />
                  <path d="M 48 10 L 32 48" opacity="0.6" />
                </svg>
                {/* Main Hanging Web Thread */}
                <div
                  className="w-0.5 h-12 border-l-2 border-dashed shadow-sm"
                  style={{ borderColor: contact.accent }}
                />
              </div>
            ))}
          </div>

          {/* 3 Hanging Posters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {CONTACTS.map((contact, idx) => {
              const isCopied = copiedKey === `phone-${idx}`;
              return (
                <div
                  key={contact.name}
                  className={`group relative flex flex-col items-center ${contact.rotation} hover:rotate-0 hover:scale-[1.02] transition-all duration-300`}
                >
                  {/* Dangling Web Strands Wrapping Around Card Sides */}
                  <svg
                    className="absolute -top-6 -right-6 w-24 h-24 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity z-20"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke={contact.accent}
                    strokeWidth="1.2"
                  >
                    <path d="M 100 0 Q 50 20 0 0" strokeDasharray="3 3" />
                    <path d="M 100 0 Q 60 50 0 30" />
                    <path d="M 100 0 Q 75 75 30 60" strokeDasharray="2 2" />
                    <path d="M 100 0 L 0 100" opacity="0.4" />
                  </svg>

                  {/* Neon Halftone Glow Backdrop */}
                  <div
                    className="absolute -inset-2 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${contact.accent}45 0%, rgba(13,11,18,0.7) 70%, transparent 100%)`,
                    }}
                  />

                  {/* Crossed Colored Tape "X" Sticking Poster on Top */}
                  <div className="absolute -top-4 z-30 flex items-center justify-center pointer-events-none">
                    <div className="relative w-8 h-8">
                      <div
                        className="absolute top-1/2 left-0 w-8 h-2.5 border border-black/70 rotate-45 shadow-[2px_2px_0px_#000]"
                        style={{ backgroundColor: contact.accent }}
                      />
                      <div
                        className="absolute top-1/2 left-0 w-8 h-2.5 border border-black/70 -rotate-45 shadow-[2px_2px_0px_#000]"
                        style={{ backgroundColor: contact.accent }}
                      />
                    </div>
                  </div>

                  {/* White Torn-Paper Poster Card */}
                  <div
                    className="relative w-full bg-[#f4f2ee] border-3 border-black p-6 pt-8 pb-7 shadow-[8px_8px_0px_#000] flex flex-col items-center text-center overflow-hidden"
                    style={{
                      clipPath: "polygon(0% 1.5%, 3% 0%, 97% 1%, 100% 2.5%, 98.5% 98%, 95% 100%, 2% 98.5%, 0% 97%)",
                    }}
                  >
                    {/* Comic Halftone Texture Inside Card */}
                    <div className="absolute inset-0 opacity-[0.08] sv-comic-halftone pointer-events-none" />

                    {/* Dark Avatar Circle with Silhouette User Icon */}
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0a0a10] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_#000] group-hover:scale-105 transition-transform"
                      style={{
                        boxShadow: `0 0 16px ${contact.glowColor}, 2px 2px 0px #000`,
                        color: contact.accent,
                      }}
                    >
                      <User className="w-7 h-7 stroke-[2.5]" />
                    </div>

                    {/* Person Name in Clean Bold Typography */}
                    <h3
                      className="text-2xl sm:text-3xl font-black uppercase text-[#0a0a10] tracking-tight leading-none mb-1.5"
                    >
                      {contact.name}
                    </h3>

                    {/* Role in Accent Color */}
                    <p
                      className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 px-3 py-0.5 rounded-full border border-black/10 bg-black/5"
                      style={{
                        color: contact.accent === "#FFE600" ? "#b38f00" : contact.accent,
                      }}
                    >
                      {contact.role}
                    </p>

                    {/* Accent Underline */}
                    <div
                      className="w-20 h-1 rounded-full mb-5"
                      style={{ backgroundColor: contact.accent }}
                    />

                    {/* Direct Call Action Button */}
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center justify-center gap-2.5 bg-black/5 hover:bg-black/10 border-2 border-black/25 hover:border-black rounded-lg px-4 py-2 text-black transition-all group/btn w-full max-w-[220px]"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-black text-xs shadow-[1px_1px_0px_#000]"
                        style={{ backgroundColor: contact.accent }}
                      >
                        <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[#0a0a10]">
                        {contact.phone}
                      </span>
                    </a>

                    {/* Copy Number Helper */}
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.phone, `phone-${idx}`)}
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-black/60 hover:text-black transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" style={{ color: contact.accent }} />
                          <span style={{ color: contact.accent === "#FFE600" ? "#b38f00" : contact.accent }}>COPIED TO CLIPBOARD!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY NUMBER</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM AREA: CLEAN CENTRAL EMAIL DISPATCH CONSOLE */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="group relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-paper/20 bg-ink/90 p-6 sm:p-8 md:flex-row md:p-9 backdrop-blur-xl transition-all duration-300 hover:border-paper/50">

            {/* Background Ambient Glows */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#FFE600]/10 blur-2xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#ff2e88]/10 blur-2xl" />

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
              {/* Glowing Mail Icon Badge */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-paper/20 bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]">
                <Mail className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div>
                
                <h4 className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-paper tracking-tight">
                  gdgcrce@gmail.com
                </h4>
                <p className="mt-0.5 font-sans text-xs sm:text-sm text-muted">
                  Have inquiries, sponsorship proposals, or want to collaborate with GDG CRCE? Send us a direct transmission.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row shrink-0">
              <a
                href="mailto:gdgcrce@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFE600] px-5 py-3 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-y-0"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => handleCopy("gdgcrce@gmail.com", "email-global")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-paper/20 bg-void/90 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-paper transition-all hover:border-paper/50 hover:bg-void"
              >
                {copiedKey === "email-global" ? (
                  <>
                    <Check className="h-4 w-4 text-[#22b6d6]" />
                    <span className="text-[#22b6d6]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-muted" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
