"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import domainImg from "../../public/images/domain.png";
import domainsBackdrop from "../../public/images/domains.png";

const DOMAIN_DETAILS = [
  {
    id: "web",
    title: "Web & Mobile Dev",
    windowLabel: ".WEB/APP DEV.",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.4)",
    tag: "TRACK // 01",
    subtitle: "High-Performance Next-Gen Software",
    desc: "Architect reactive web apps, progressive mobile tools, real-time collaboration engines, and blazing fast frontend experiences that push the boundaries of digital interfaces.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "WebSockets", "PWA"],
  },
  {
    id: "blockchain",
    title: "Web3 & Blockchain",
    windowLabel: "BLOCKCHAIN",
    accent: "#22b6d6",
    glow: "rgba(34, 182, 214, 0.4)",
    tag: "TRACK // 02",
    subtitle: "Decentralized Trust & Smart Contracts",
    desc: "Build next-generation decentralized applications, zero-knowledge verification systems, smart contract protocols, DeFi tools, and self-sovereign digital asset economies.",
    tech: ["Solidity", "Polygon", "Ethereum", "Ethers.js", "ZK-SNARKs", "IPFS"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    windowLabel: "AI/ML",
    accent: "#e5308c",
    glow: "rgba(229, 48, 140, 0.4)",
    tag: "TRACK // 03",
    subtitle: "Autonomous Agents & Neural Systems",
    desc: "Harness foundation models, multimodal intelligence, autonomous agentic workflows, computer vision, and predictive machine learning architectures to solve complex challenges.",
    tech: ["Gemini AI", "PyTorch", "LangChain", "HuggingFace", "Python", "Vector DBs"],
  },
];

/**
 * Domains Section:
 * The Full-Screen Subway Train (domain.png) pulls into the station on scroll,
 * covering the entire viewport smoothly.
 * Features interactive window hotspots and track badges for deep exploration.
 */
export default function DomainsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        // 1. Train rushes in from left and smoothly brakes to cover the entire screen (0 -> 0.35)
        tl.fromTo(
          trainRef.current,
          {
            xPercent: -105,
            scale: 0.96,
            opacity: 0.8,
          },
          {
            xPercent: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.inOut",
            duration: 0.35,
          },
          0,
        );

        // 2. HUD & Track Badges glide in (0.32 -> 0.45)
        tl.fromTo(
          hudRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.15 },
          0.32,
        );

        tl.fromTo(
          cardsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
          0.38,
        );

        // 3. Train holds full-screen during (0.45 -> 0.80) for reading and interaction

        // 4. Train smoothly accelerates out toward the right into Timeline (0.80 -> 1.0)
        tl.to(
          trainRef.current,
          {
            xPercent: 105,
            scale: 1.04,
            opacity: 0.6,
            ease: "power2.in",
            duration: 0.2,
          },
          0.8,
        );

        tl.to(
          [hudRef.current, cardsRef.current],
          { opacity: 0, y: -20, duration: 0.12 },
          0.8,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="domains"
      ref={sectionRef}
      className="relative h-[320vh] w-full bg-black"
    >
      <h2 className="sr-only">Domains & Multiverse Tracks</h2>

      {/* Sticky Full-Screen Subway Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Subway Tunnel Background (domains.png) */}
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
          <Image
            src={domainsBackdrop}
            alt="Subway Station Graffiti Wall"
            fill
            sizes="100vw"
            priority={false}
            className="h-full w-full object-cover object-center opacity-25 brightness-90 contrast-125"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        </div>

        {/* 
          The Full-Screen Train (domain.png)
          Covers the whole screen smoothly edge-to-edge
        */}
        <div
          ref={trainRef}
          className="absolute inset-0 z-10 h-full w-full will-change-transform flex items-center justify-center overflow-hidden"
        >
          {/* Full Screen Train Image */}
          <div className="relative h-full w-full">
            <Image
              src={domainImg}
              alt="Domains Subway Train"
              fill
              priority
              sizes="100vw"
              className="h-full w-full object-cover object-center drop-shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
            />
            {/* Cinematic Subway Lighting & Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
          </div>

          {/* Interactive Window Clickable Hotspots */}
          <div className="pointer-events-auto absolute inset-0 z-20 grid grid-cols-3">
            {/* Window 1: Web / App */}
            <button
              type="button"
              onClick={() => setActiveDomain(activeDomain === "web" ? null : "web")}
              className="group relative h-full w-full cursor-pointer focus:outline-none"
              aria-label="View Web & Mobile Dev Track Details"
            >
              <div className="absolute top-[20%] left-[8%] right-[8%] bottom-[38%] rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-[#FFE600] group-hover:bg-[#FFE600]/10 group-hover:shadow-[0_0_40px_rgba(255,230,0,0.4)]">
                <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#FFE600] px-3 py-1 font-mono text-xs font-black text-black uppercase transition-opacity shadow-[3px_3px_0px_#000]">
                  EXPLORE TRACK ➔
                </span>
              </div>
            </button>

            {/* Window 2: Blockchain */}
            <button
              type="button"
              onClick={() => setActiveDomain(activeDomain === "blockchain" ? null : "blockchain")}
              className="group relative h-full w-full cursor-pointer focus:outline-none"
              aria-label="View Web3 & Blockchain Track Details"
            >
              <div className="absolute top-[20%] left-[8%] right-[8%] bottom-[38%] rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-[#22b6d6] group-hover:bg-[#22b6d6]/10 group-hover:shadow-[0_0_40px_rgba(34,182,214,0.4)]">
                <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#22b6d6] px-3 py-1 font-mono text-xs font-black text-black uppercase transition-opacity shadow-[3px_3px_0px_#000]">
                  EXPLORE TRACK ➔
                </span>
              </div>
            </button>

            {/* Window 3: AI / ML */}
            <button
              type="button"
              onClick={() => setActiveDomain(activeDomain === "ai" ? null : "ai")}
              className="group relative h-full w-full cursor-pointer focus:outline-none"
              aria-label="View AI & Machine Learning Track Details"
            >
              <div className="absolute top-[20%] left-[8%] right-[8%] bottom-[38%] rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-[#e5308c] group-hover:bg-[#e5308c]/10 group-hover:shadow-[0_0_40px_rgba(229,48,140,0.4)]">
                <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#e5308c] px-3 py-1 font-mono text-xs font-black text-white uppercase transition-opacity shadow-[3px_3px_0px_#000]">
                  EXPLORE TRACK ➔
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Top HUD Overlay (Subway Station Status) */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute top-6 inset-x-0 z-30 flex items-center justify-between px-6 md:px-12 opacity-0"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FFE600] animate-pulse shadow-[0_0_12px_#FFE600]" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FFE600]">
              SUBWAY ROUTE // MULTIVERSE EXPRESS
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <span className="font-mono text-xs text-muted">
              CLICK ANY WINDOW TO INSPECT TRACK
            </span>
            <span className="rounded border border-paper/20 bg-paper/10 px-2 py-0.5 font-mono text-[0.625rem] text-paper">
              PLATFORM 03
            </span>
          </div>
        </div>

        {/* Bottom Interactive Track Badges / Drawer */}
        <div
          ref={cardsRef}
          className="pointer-events-none absolute bottom-6 inset-x-0 z-30 flex justify-center px-4 md:px-8 opacity-0"
        >
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {DOMAIN_DETAILS.map((domain) => {
              const isActive = activeDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() =>
                    setActiveDomain(isActive ? null : domain.id)
                  }
                  className={`group relative flex items-center gap-3 rounded-lg border-2 bg-ink/90 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 md:px-6 md:py-3 ${
                    isActive
                      ? "border-paper scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
                      : "border-paper/20 hover:border-paper/60"
                  }`}
                  style={{
                    borderLeftColor: domain.accent,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="text-left">
                    <span
                      className="font-mono text-[0.5625rem] font-bold uppercase tracking-widest md:text-[0.625rem]"
                      style={{ color: domain.accent }}
                    >
                      {domain.tag}
                    </span>
                    <h3 className="font-mono text-xs font-black text-paper transition-colors group-hover:text-white md:text-sm">
                      {domain.title}
                    </h3>
                  </div>

                  <span
                    className="flex h-6 w-6 items-center justify-center rounded border border-black font-mono text-xs font-black transition-transform"
                    style={{
                      backgroundColor: domain.accent,
                      color: domain.id === "ai" ? "#fff" : "#000",
                    }}
                  >
                    {isActive ? "✕" : "➔"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal / Detailed Track Popup Drawer */}
        {activeDomain && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            {DOMAIN_DETAILS.filter((d) => d.id === activeDomain).map((domain) => (
              <div
                key={domain.id}
                className="relative max-w-xl w-full rounded-xl border-2 bg-ink p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
                style={{
                  borderColor: domain.accent,
                  boxShadow: `0 0 45px ${domain.glow}`,
                }}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveDomain(null)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded border border-black bg-[#FFE600] font-mono text-sm font-black text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFF033]"
                  aria-label="Close track overview"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3">
                  <span
                    className="border border-black px-2.5 py-0.5 font-mono text-xs font-black uppercase text-black"
                    style={{ backgroundColor: domain.accent }}
                  >
                    {domain.tag}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    SUBWAY WINDOW: {domain.windowLabel}
                  </span>
                </div>

                <h3 className="mt-3 font-mono text-2xl font-black text-paper md:text-3xl">
                  {domain.title}
                </h3>
                <p
                  className="mt-1 font-mono text-xs font-bold uppercase tracking-wider"
                  style={{ color: domain.accent }}
                >
                  {domain.subtitle}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {domain.desc}
                </p>

                {/* Tech Badges */}
                <div className="mt-6 border-t border-paper/10 pt-4">
                  <span className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted">
                    // Recommended Tech Stacks & Frameworks
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {domain.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-paper/15 bg-paper/5 px-2.5 py-1 font-mono text-xs font-medium text-paper"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveDomain(null)}
                    className="border-[2px] border-black bg-[#FFE600] px-5 py-2 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000] hover:bg-[#FFF033]"
                  >
                    BACK TO SUBWAY TRAIN ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

