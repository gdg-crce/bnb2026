"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import prizesBg from "../../public/images/prizes-bg.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const TOP_PRIZES = [
  {
    rank: "01",
    place: "GRAND CHAMPION",
    cash: "₹1,00,000",
    title: "Multiverse Winner",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.3)",
    perks: [
      "₹1,00,000 Direct Cash Bounty",
      "Official GDG Champions Trophy",
      "Exclusive Spider-Verse Swag Box",
      "Direct Incubator Fast-Track Review",
      "$1,000 Google Cloud & AI Credits",
    ],
    popular: true,
  },
  {
    rank: "02",
    place: "1ST RUNNER UP",
    cash: "₹50,000",
    title: "Dimensional Finalist",
    accent: "#22b6d6",
    glow: "rgba(34, 182, 214, 0.25)",
    perks: [
      "₹50,000 Direct Cash Bounty",
      "Runner-up Memento & Accreditations",
      "Developer Goodies & Swag Kit",
      "1-on-1 VC & Industry Mentorship",
      "$500 Google Cloud Credits",
    ],
    popular: false,
  },
  {
    rank: "03",
    place: "2ND RUNNER UP",
    cash: "₹25,000",
    title: "Innovation Vanguard",
    accent: "#e5308c",
    glow: "rgba(229, 48, 140, 0.25)",
    perks: [
      "₹25,000 Direct Cash Bounty",
      "Podium Certificates & Medals",
      "Premium Tooling Subscriptions",
      "Fast-Track Technical Interview Rounds",
      "$250 Google Cloud Credits",
    ],
    popular: false,
  },
];

const TRACK_BOUNTIES = [
  {
    title: "Best AI & Autonomous Agents",
    prize: "₹15,000",
    desc: "Groundbreaking LLM agents, multimodal reasoning apps, or workflow automation.",
    accent: "#8fc63d",
    tag: "AI TRACK",
  },
  {
    title: "Best Web3 & DeFi Breakthrough",
    prize: "₹15,000",
    desc: "High-utility smart contracts, decentralized identity, or next-gen consumer wallets.",
    accent: "#22b6d6",
    tag: "BLOCKCHAIN",
  },
  {
    title: "Best All-Women / Diversity Squad",
    prize: "₹10,000",
    desc: "Empowering visionary women developers building bold, impactful software products.",
    accent: "#e5308c",
    tag: "DIVERSITY",
  },
  {
    title: "Best UI/UX & Community Choice",
    prize: "₹10,000",
    desc: "Voted by attendees for the most tactile, intuitive, and visually stunning interface.",
    accent: "#FFE600",
    tag: "DESIGN",
  },
];

export default function PrizesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the prizes backdrop
        gsap.fromTo(
          ".prizes-backdrop",
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
          ".prizes-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".prizes-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".prizes-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".prizes-mark", start: "top 84%" },
        });

        gsap.from(".prizes-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".prizes-mark", start: "top 84%" },
        });

        // Main prize cards
        gsap.from(".prize-card", {
          opacity: 0,
          y: 50,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".prize-cards-grid", start: "top 82%" },
        });

        // Track bounties
        gsap.from(".track-bounty-card", {
          opacity: 0,
          y: 36,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".track-bounties-grid", start: "top 84%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="prizes"
      ref={root}
      className="halftone relative z-[50] overflow-hidden bg-void px-6 py-28 md:px-10 md:py-36"
    >
      {/* Real Spider-Verse Comic Skyline Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="prizes-backdrop absolute -top-[10%] -left-[5%] h-[120%] w-[110%]">
          <Image
            src={prizesBg}
            alt="Prizes Skyline Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-35 brightness-95 contrast-125"
          />
        </div>
        {/* Scrim blending into void */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="prizes-mark relative mb-20 flex flex-col items-start md:mb-24">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFE600]" />
            <span className="eyebrow text-[#FFE600]">The Multiverse Bounty</span>
          </div>

          <div className="relative mt-4">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`prizes-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              Prizes
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`prizes-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              Prizes
            </span>
            {/* Front Face */}
            <h2
              className={`prizes-mark-face display relative text-paper ${MARK_SIZE}`}
            >
              Prizes
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="prizes-lede max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Compete for cash bounties, developer grants, mentorship, and
              exclusive Spider-Verse accolades across all domains.
            </p>
            <div className="inline-flex items-center gap-2 border-[2.5px] border-black bg-[#FFE600] px-5 py-2 font-mono text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">
              <span>TOTAL POOL: ₹2,00,000+</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="prize-cards-grid grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {TOP_PRIZES.map((prize) => {
            return (
              <div
                key={prize.rank}
                className={`prize-card group relative flex flex-col justify-between rounded-xl border-2 bg-ink/90 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 md:p-8 ${
                  prize.popular
                    ? "border-[#FFE600] shadow-[0_0_35px_rgba(255,230,0,0.2)] md:-translate-y-3"
                    : "border-paper/20 hover:border-paper/50"
                }`}
                style={{
                  boxShadow: `0 12px 36px ${prize.glow}`,
                }}
              >
                {/* Header Tape / Rank */}
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="border border-black px-2.5 py-0.5 font-mono text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: prize.accent }}
                    >
                      {prize.place}
                    </span>
                    <span className="font-mono text-xs font-bold text-muted">
                      RANK #{prize.rank}
                    </span>
                  </div>

                  {/* Cash Amount */}
                  <div className="mt-8">
                    <span className="eyebrow text-[0.625rem] text-muted">
                      CASH REWARD
                    </span>
                    <h3
                      className="mt-1 font-mono text-4xl font-extrabold tracking-tight md:text-5xl"
                      style={{ color: prize.accent }}
                    >
                      {prize.cash}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-paper/90">
                      {prize.title}
                    </p>
                  </div>

                  {/* Perks List */}
                  <ul className="mt-8 space-y-3 border-t border-paper/10 pt-6">
                    {prize.perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-start gap-2.5 text-xs text-paper/80 md:text-sm"
                      >
                        <span
                          className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: prize.accent }}
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Footer Accent */}
                <div className="mt-8 border-t border-paper/10 pt-4">
                  <span className="font-mono text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">
                    + GDG CRCE MEMENTO & CERTIFICATE
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Track Bounties Grid */}
        <div className="mt-20 md:mt-28">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-mono text-lg font-bold tracking-wider text-paper uppercase md:text-xl">
              // Category & Track Bounties
            </h3>
            <span className="eyebrow text-muted hidden sm:block">Special Recognitions</span>
          </div>

          <div className="track-bounties-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRACK_BOUNTIES.map((track) => (
              <div
                key={track.title}
                className="track-bounty-card group relative rounded-lg border-2 border-paper/15 bg-ink/90 p-6 backdrop-blur-sm transition-all duration-300 hover:border-paper/45 hover:bg-ink"
                style={{
                  borderTopColor: track.accent,
                  borderTopWidth: "3.5px",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[0.625rem] font-bold uppercase tracking-widest"
                    style={{ color: track.accent }}
                  >
                    {track.tag}
                  </span>
                  <span className="font-mono text-base font-extrabold text-paper">
                    {track.prize}
                  </span>
                </div>

                <h4 className="mt-4 font-bold text-paper transition-colors duration-200 group-hover:text-white">
                  {track.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {track.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
