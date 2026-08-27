"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import bgAboutUs from "../../public/images/curved.png";
import milesSofa from "../../public/images/milessofa.png";
import bigTrainTightImg from "../../public/bigtrain-tight.png";
import timelineBg from "../../public/images/timeline-bg.jpg";

const MARK_SIZE =
  "text-[clamp(2.2rem,8vw,3.8rem)] md:text-[clamp(2.8rem,5.5vw,4.8rem)]";

type MilestoneCategory = "ALL" | "ONLINE" | "DAY1" | "DAY2";

interface TimelineEvent {
  id: string;
  phase: string;
  category: "ONLINE" | "DAY1" | "DAY2";
  categoryLabel: string;
  title: string;
  date: string;
  time: string;
  status: "COMPLETED" | "UPCOMING" | "LIVE";
  accent: string;
  glow: string;
  desc: string;
  highlights: string[];
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "phase-01",
    phase: "PHASE 01",
    category: "ONLINE",
    categoryLabel: "ONLINE SPRINT",
    title: "Dimensional Registration & Ideation",
    date: "AUG 15 — SEPT 05, 2026",
    time: "Closes 11:59 PM IST",
    status: "COMPLETED",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.3)",
    desc: "Registrations launch on Devfolio. Assemble your squad of 2–4 builders, select your domain track, and submit your initial architectural concept pitch.",
    highlights: ["Devfolio Portal", "Squad Matchmaking", "Idea Screening"],
  },
  {
    id: "phase-02",
    phase: "PHASE 02",
    category: "ONLINE",
    categoryLabel: "ANNOUNCEMENT",
    title: "Screening & Top 50 Squad Shortlist",
    date: "SEPT 10 — SEPT 14, 2026",
    time: "Finalist Sync",
    status: "COMPLETED",
    accent: "#22b6d6",
    glow: "rgba(34, 182, 214, 0.3)",
    desc: "Technical review panel evaluates submitted architectures. Top 50 shortlisted squads advance to the offline Grand Finale at CRCE Bandra, Mumbai.",
    highlights: ["Top 50 Selected", "Travel Guidance", "Discord Briefing"],
  },
  {
    id: "phase-03",
    phase: "DAY 01",
    category: "DAY1",
    categoryLabel: "KICKOFF",
    title: "Check-In, Swag Boxes & Opening",
    date: "SEPT 19, 2026",
    time: "08:00 AM — 10:30 AM",
    status: "UPCOMING",
    accent: "#e5308c",
    glow: "rgba(229, 48, 140, 0.3)",
    desc: "Campus check-in at CRCE Bandra, physical badge collection, exclusive Spider-Verse swag box handover, keynotes, and countdown activation.",
    highlights: ["Campus Check-in", "Exclusive Swag Kit", "Opening Ceremony"],
  },
  {
    id: "phase-04",
    phase: "DAY 01",
    category: "DAY1",
    categoryLabel: "HACKATHON SPRINT",
    title: "Hacking Begins & Mentorship Sprint",
    date: "SEPT 19, 2026",
    time: "11:00 AM — 08:00 PM",
    status: "UPCOMING",
    accent: "#8fc63d",
    glow: "rgba(143, 198, 61, 0.3)",
    desc: "The 36-hour timer starts! Round 1 1-on-1 architecture reviews with Google Developer Experts, VC mentors, and tech leads to refine core features.",
    highlights: ["Hacking Begins", "Google Cloud Mentors", "Lunch & Snacks"],
  },
  {
    id: "phase-05",
    phase: "DAY 01 / NIGHT",
    category: "DAY1",
    categoryLabel: "MIDNIGHT PROTOCOL",
    title: "Midnight Pizza & Glitch Games",
    date: "SEPT 19 — 20, 2026",
    time: "11:30 PM — 04:00 AM",
    status: "UPCOMING",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.3)",
    desc: "Midnight pizza stations, cold Red Bull energy cans, high-tempo developer mini-games, and overnight debugging support from roving mentors.",
    highlights: ["Midnight Pizza", "24/7 Red Bull Bar", "Overnight Debugging"],
  },
  {
    id: "phase-06",
    phase: "DAY 02",
    category: "DAY2",
    categoryLabel: "DEADLINE",
    title: "Code Freeze & Devfolio Submission",
    date: "SEPT 20, 2026",
    time: "11:00 AM — 01:00 PM",
    status: "UPCOMING",
    accent: "#d6070c",
    glow: "rgba(214, 7, 12, 0.3)",
    desc: "Final commit buzzer sounds. Repositories lock. Table-by-table project expo and preliminary scoring rounds by technical evaluators.",
    highlights: ["Strict Code Freeze", "Devfolio Lock", "Project Showcase"],
  },
  {
    id: "phase-07",
    phase: "DAY 02",
    category: "DAY2",
    categoryLabel: "GRAND FINALE",
    title: "Auditorium Pitches & Awards",
    date: "SEPT 20, 2026",
    time: "02:00 PM — 05:30 PM",
    status: "UPCOMING",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.35)",
    desc: "Top 10 finalist squads pitch live on the main auditorium stage to venture capitalists and engineering directors. ₹2,00,000+ bounty distribution.",
    highlights: ["Stage Pitches", "₹2,00,000+ Bounty", "Champions Trophy"],
  },
];

const CATEGORY_TABS: { key: MilestoneCategory; label: string }[] = [
  { key: "ALL", label: "ALL MILESTONES" },
  { key: "ONLINE", label: "ONLINE PHASES" },
  { key: "DAY1", label: "DAY 01 (FINALE)" },
  { key: "DAY2", label: "DAY 02 (PODIUM)" },
];

/**
 * About & Timeline Train Wipe Section:
 * 1. Initial State: The About room with stationary Miles on sofa.
 * 2. On Scroll: The Subway Train drives from left to right across the screen.
 * 3. The passing train directly wipes away the About room and unveils the Timeline section underneath.
 * 4. Once the train has completely passed to the right, the Timeline section is right there in place.
 * 5. No awkward domain section scrolling down — the transition is seamless and direct.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const aboutRoomRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<MilestoneCategory>("ALL");

  const filteredEvents =
    activeFilter === "ALL"
      ? TIMELINE_EVENTS
      : TIMELINE_EVENTS.filter((e) => e.category === activeFilter);

  // Smooth mouse parallax on the room wall
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!wallRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;

    gsap.to(wallRef.current, {
      x: x * 24,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (wallRef.current) {
      gsap.to(wallRef.current, {
        x: 0,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Initialize train completely offscreen to the left
        if (trainRef.current) {
          gsap.set(trainRef.current, { xPercent: -170 });
        }

        if (aboutRoomRef.current) {
          gsap.set(aboutRoomRef.current, { opacity: 1 });
        }

        // Stronger parallax (y: 80 instead of 44)
        gsap.from(".event-miles", {
          opacity: 0,
          y: 80,
          duration: 1.2,
          scrollTrigger: { trigger: ".event-miles", start: "top 88%" },
        });

        // 3D Scroll Parallax for EventMiles
        gsap.to(".event-miles-3d", {
          yPercent: -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6,
          },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6,
          },
        });

        // 1. Phase 1: Train rolls in smoothly from left to center (0.04 -> 0.36)
        tl.to(
          trainRef.current,
          {
            xPercent: 0,
            ease: "power1.out",
            duration: 0.32,
          },
          0.04,
        );

        // 2. Dissolve About room as train covers the scene (0.16 -> 0.46)
        tl.to(
          aboutRoomRef.current,
          {
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.30,
          },
          0.16,
        );

        // 3. Phase 2: Extra slow crawl/deceleration when train fits the screen wholly (0.36 -> 0.70)
        tl.to(
          trainRef.current,
          {
            xPercent: 14,
            ease: "none",
            duration: 0.34,
          },
          0.36,
        );

        // 4. Phase 3: Train smoothly accelerates and departs completely OUT to the right (0.70 -> 0.98)
        tl.to(
          trainRef.current,
          {
            xPercent: 170,
            ease: "power1.in",
            duration: 0.28,
          },
          0.70,
        );

        // 5. Timeline Header Chromatic Split animation
        gsap.fromTo(
          ".timeline-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: ".timeline-mark", start: "top 80%" },
          },
        );

        const split = new SplitText(".timeline-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.03,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".timeline-mark", start: "top 80%" },
        });

        return () => split.revert();
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[800vh] w-full bg-black -mt-px"
    >
      <h2 className="sr-only">About Us & Hackathon Timeline</h2>

      {/* Sticky Stage Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {/* 
          ══════════════════════════════════════════════════════════════
          LAYER 0 (Base): The Timeline Section
          - Revealed in place directly as the train passes from left to right
          - Zero extra nested scrollbars
          ══════════════════════════════════════════════════════════════
        */}
        <div
          id="timeline"
          className="halftone absolute inset-0 z-0 h-full w-full overflow-hidden bg-void px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 flex flex-col justify-center items-center pointer-events-auto"
        >
          {/* Spider-Verse Comic Skyline Background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={timelineBg}
                alt="Timeline Skyline Backdrop"
                fill
                sizes="100vw"
                priority={false}
                className="object-cover object-center opacity-30 brightness-95 contrast-125"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/70 to-void/95" />
          </div>

          <div className="w-full max-w-6xl flex flex-col justify-center">
            {/* Section Header */}
            <div className="timeline-mark relative mb-5 flex flex-col items-start md:mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFE600]" />
                <span className="eyebrow text-[#FFE600]">
                  The Chronology // 50-Hour Hackathon Protocol
                </span>
              </div>

              <div className="relative mt-2">
                <span
                  aria-hidden="true"
                  className={`timeline-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
                >
                  Timeline
                </span>
                <span
                  aria-hidden="true"
                  className={`timeline-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
                >
                  Timeline
                </span>
                <h2
                  className={`timeline-mark-face display relative text-paper ${MARK_SIZE}`}
                >
                  Timeline
                </h2>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-muted">
                  From online ideation to the midnight code sprint and live auditorium pitches — track every milestone of Bit N Build 2026.
                </p>
                <div className="inline-flex items-center gap-1.5 border-[2px] border-black bg-[#FFE600] px-2.5 py-0.5 font-mono text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_#000]">
                  <span>36-HOUR SPRINT</span>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilter(tab.key)}
                      className={`border-2 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "border-[#FFE600] bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                          : "border-paper/20 bg-ink/70 text-paper/80 hover:border-paper/40 hover:text-paper"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Responsive Timeline Grid (Zero Extra Scrollbar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-3.5">
              {filteredEvents.slice(0, activeFilter === "ALL" ? 6 : 6).map((event) => {
                return (
                  <div
                    key={event.id}
                    className="group relative rounded-lg border-2 border-paper/15 bg-ink/90 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-paper/40 shadow-[3px_3px_0px_#000] flex flex-col justify-between"
                    style={{
                      boxShadow: `3px 3px 0px #000, 0 6px 20px ${event.glow}`,
                    }}
                  >
                    {/* Top Accent Stripe */}
                    <div
                      className="absolute top-0 inset-x-0 h-1 rounded-t-md opacity-80 group-hover:opacity-100"
                      style={{ backgroundColor: event.accent }}
                    />

                    <div>
                      {/* Header Row: Phase Badge & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="border border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-[1.5px_1.5px_0px_#000]"
                            style={{ backgroundColor: event.accent }}
                          >
                            {event.phase}
                          </span>
                          <span className="font-mono text-[9px] font-bold tracking-wider text-muted uppercase">
                            {event.categoryLabel}
                          </span>
                        </div>

                        <span
                          className={`font-mono text-[8.5px] font-bold px-1.5 py-0.5 uppercase border ${
                            event.status === "COMPLETED"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                              : event.status === "LIVE"
                              ? "border-amber-400/60 bg-amber-400/20 text-amber-300 animate-pulse"
                              : "border-paper/20 bg-void/60 text-muted"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-2 font-sans text-xs sm:text-sm font-extrabold text-paper group-hover:text-white transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      {/* Date & Time Badge */}
                      <div className="mt-1 flex items-center gap-x-2 font-mono text-[10px] text-muted">
                        <span className="flex items-center gap-1 text-paper/90 font-semibold">
                          <span
                            className="inline-block h-1 w-1 rounded-full"
                            style={{ backgroundColor: event.accent }}
                          />
                          {event.date}
                        </span>
                        <span className="text-paper/40">•</span>
                        <span className="truncate">{event.time}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-1.5 text-[11px] leading-relaxed text-muted line-clamp-2">
                        {event.desc}
                      </p>
                    </div>

                    {/* Highlight Chips */}
                    <div className="mt-2.5 flex flex-wrap gap-1 pt-2 border-t border-paper/10">
                      {event.highlights.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm border border-paper/10 bg-void/80 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-paper/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 
          ══════════════════════════════════════════════════════════════
          LAYER 1 (Middle): Pristine About Us Room (bg-aboutus.png + milessofa.png)
          - Starts visible on top of Timeline
          - Wiped away as the train moves from left to right
          ══════════════════════════════════════════════════════════════
        */}
        <div
          ref={aboutRoomRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full will-change-transform"
        >
          {/* Wall with subtle parallax */}
          <div
            ref={wallRef}
            className="absolute -inset-x-6 inset-y-0 h-full will-change-transform"
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={bgAboutUs}
                alt="About Us Room Background"
                fill
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
            </div>
          </div>

          {/* Stationary Miles on Sofa */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex w-full justify-center items-end px-2 pb-0 md:pb-2">
            <div className="relative flex max-h-[85vh] w-[min(100vw,1400px)] scale-110 md:scale-125 origin-bottom items-end justify-center">
              <Image
                src={milesSofa}
                alt="Miles Morales on Sofa"
                priority
                sizes="(max-width: 768px) 96vw, 1200px"
                className="h-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* 
          ══════════════════════════════════════════════════════════════
          LAYER 2 (Top): Subway Train (bigtrain-tight.png)
          - Drives from left to right on scroll, wiping from About into Timeline
          - Natural aspect ratio with zero cutoffs
          ══════════════════════════════════════════════════════════════
        */}
        <div
          ref={trainRef}
          className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center will-change-transform"
        >
          <div className="relative flex h-[80vh] sm:h-[86vh] md:h-[92vh] lg:h-[96vh] w-auto max-w-none items-center justify-center scale-100 sm:scale-104 md:scale-108">
            <Image
              src={bigTrainTightImg}
              alt="Domains Subway Train"
              priority
              className="h-full w-auto max-w-none object-contain drop-shadow-[0_50px_140px_rgba(0,0,0,0.98)]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
