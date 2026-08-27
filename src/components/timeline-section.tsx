"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import timelineBg from "../../public/images/timeline-bg.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

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
    time: "Portal Closes 11:59 PM IST",
    status: "COMPLETED",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.3)",
    desc: "Registrations launch globally on Devfolio. Assemble your squad of 2–4 builders, select your dimensional domain track (Web/App, Web3/Blockchain, AI/ML), and submit your initial architectural concept pitch.",
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
    desc: "Expert technical review panel evaluates submitted architectures. Top 50 shortlisted squads advance to the in-person Grand Finale at CRCE Bandra, Mumbai with travel guidance and mentor discord pairing.",
    highlights: ["Top 50 Selected", "Travel Guidance", "Discord Briefing"],
  },
  {
    id: "phase-03",
    phase: "DAY 01",
    category: "DAY1",
    categoryLabel: "KICKOFF",
    title: "Check-In, Swag Boxes & Grand Opening",
    date: "SEPT 19, 2026",
    time: "08:00 AM — 10:30 AM",
    status: "UPCOMING",
    accent: "#e5308c",
    glow: "rgba(229, 48, 140, 0.3)",
    desc: "Campus check-in at CRCE Bandra, physical badge collection, exclusive Spider-Verse swag box handover, sponsor keynotes, track challenges reveal, and countdown activation.",
    highlights: ["Campus Check-in", "Exclusive Swag Kit", "Opening Ceremony"],
  },
  {
    id: "phase-04",
    phase: "DAY 01",
    category: "DAY1",
    categoryLabel: "HACKATHON SPRINT",
    title: "Hacking Commences & Mentor Round 01",
    date: "SEPT 19, 2026",
    time: "11:00 AM — 08:00 PM",
    status: "UPCOMING",
    accent: "#8fc63d",
    glow: "rgba(143, 198, 61, 0.3)",
    desc: "The 36-hour timer begins! Round 1 1-on-1 architecture reviews with Google Developer Experts, VC mentors, and tech leads to refine core algorithms and cloud pipelines.",
    highlights: ["Hacking Begins", "Google Cloud Mentors", "Lunch & Snacks"],
  },
  {
    id: "phase-05",
    phase: "DAY 01 / NIGHT",
    category: "DAY1",
    categoryLabel: "MIDNIGHT PROTOCOL",
    title: "Midnight Pizza, Red Bull Bar & Glitch Games",
    date: "SEPT 19 — 20, 2026",
    time: "11:30 PM — 04:00 AM",
    status: "UPCOMING",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.3)",
    desc: "Fuel up at the midnight pizza stations, grab chilled Red Bull energy cans, compete in quick developer mini-games, and get overnight debugging support from roving mentors.",
    highlights: ["Midnight Pizza", "24/7 Red Bull Bar", "Overnight Debugging"],
  },
  {
    id: "phase-06",
    phase: "DAY 02",
    category: "DAY2",
    categoryLabel: "DEADLINE",
    title: "Code Freeze, Devfolio Submission & Expo",
    date: "SEPT 20, 2026",
    time: "11:00 AM — 01:00 PM",
    status: "UPCOMING",
    accent: "#d6070c",
    glow: "rgba(214, 7, 12, 0.3)",
    desc: "Final commit buzzer sounds. Repositories lock. Table-by-table project expo and preliminary scoring rounds by technical evaluators and track sponsors.",
    highlights: ["Strict Code Freeze", "Devfolio Lock", "Project Showcase"],
  },
  {
    id: "phase-07",
    phase: "DAY 02",
    category: "DAY2",
    categoryLabel: "GRAND FINALE",
    title: "Grand Stage Pitches & Multiverse Awards",
    date: "SEPT 20, 2026",
    time: "02:00 PM — 05:30 PM",
    status: "UPCOMING",
    accent: "#FFE600",
    glow: "rgba(255, 230, 0, 0.35)",
    desc: "Top 10 finalist squads pitch live on the main auditorium stage to venture capitalists and engineering leaders. Grand Champion crowning, ₹2,00,000+ bounty distribution, and GDG Trophy ceremony.",
    highlights: ["Top 10 Stage Pitches", "₹2,00,000+ Bounty", "Champions Trophy"],
  },
];

const CATEGORY_TABS: { key: MilestoneCategory; label: string }[] = [
  { key: "ALL", label: "ALL MILESTONES" },
  { key: "ONLINE", label: "ONLINE PHASES" },
  { key: "DAY1", label: "DAY 01 (FINALE)" },
  { key: "DAY2", label: "DAY 02 (PODIUM)" },
];

export default function TimelineSection() {
  const root = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<MilestoneCategory>("ALL");

  const filteredEvents =
    activeFilter === "ALL"
      ? TIMELINE_EVENTS
      : TIMELINE_EVENTS.filter((e) => e.category === activeFilter);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the timeline backdrop
        gsap.fromTo(
          ".timeline-backdrop",
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
          ".timeline-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".timeline-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".timeline-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".timeline-mark", start: "top 84%" },
        });

        gsap.from(".timeline-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".timeline-mark", start: "top 84%" },
        });

        // Timeline items staggered entrance
        gsap.from(".timeline-card-wrapper", {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".timeline-flow", start: "top 82%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="timeline"
      ref={root}
      className="halftone relative z-10 overflow-hidden bg-void px-6 py-28 md:px-10 md:py-36"
    >
      {/* Spider-Verse Comic Skyline Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="timeline-backdrop absolute -top-[10%] -left-[5%] h-[120%] w-[110%]">
          <Image
            src={timelineBg}
            alt="Timeline Skyline Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-30 brightness-95 contrast-125"
          />
        </div>
        {/* Scrim blending smoothly into void */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/75 to-void" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="timeline-mark relative mb-16 flex flex-col items-start md:mb-20">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FFE600] shadow-[0_0_10px_#FFE600]" />
            <span className="eyebrow text-[#FFE600]">
              The Chronology // 50-Hour Roadmap
            </span>
          </div>

          <div className="relative mt-4">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`timeline-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              Timeline
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`timeline-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              Timeline
            </span>
            {/* Front Face */}
            <h2
              className={`timeline-mark-face display relative text-paper ${MARK_SIZE}`}
            >
              Timeline
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="timeline-lede max-w-xl text-base leading-relaxed text-muted md:text-lg">
              From online ideation to the midnight code sprint and live auditorium
              pitches — track every milestone of Bit N Build 2026.
            </p>
            <div className="inline-flex items-center gap-2 border-[2.5px] border-black bg-[#FFE600] px-5 py-2 font-mono text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000]">
              <span>36-HOUR HACKATHON PROTOCOL</span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-10 flex flex-wrap gap-2.5 sm:gap-3">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`border-2 px-4 py-2 font-mono text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-[#FFE600] bg-[#FFE600] text-black shadow-[3px_3px_0px_#000]"
                      : "border-paper/20 bg-ink/70 text-paper/80 hover:border-paper/40 hover:text-paper"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Flow */}
        <div className="timeline-flow relative">
          {/* Glowing Vertical Center Spine (Desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-4 bottom-8 left-4 md:left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#FFE600] via-[#22b6d6] to-[#e5308c] opacity-40 shadow-[0_0_12px_rgba(255,230,0,0.5)]"
          />

          <div className="space-y-8 md:space-y-12">
            {filteredEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={event.id}
                  className={`timeline-card-wrapper relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Spine Node Dot (Desktop & Mobile) */}
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 top-7 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-ink transition-transform duration-300 hover:scale-125"
                    style={{
                      borderColor: event.accent,
                      boxShadow: `0 0 16px ${event.glow}`,
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: event.accent }}
                    />
                  </div>

                  {/* Card Container (Offset from spine) */}
                  <div
                    className={`w-full pl-12 md:pl-0 md:w-[calc(50%-2.5rem)] ${
                      isEven ? "md:pr-0 md:text-left" : "md:pl-0 md:text-left"
                    }`}
                  >
                    <div
                      className="group relative rounded-xl border-2 border-paper/15 bg-ink/90 p-6 md:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-paper/40 shadow-[4px_4px_0px_#000]"
                      style={{
                        boxShadow: `4px 4px 0px #000, 0 10px 30px ${event.glow}`,
                      }}
                    >
                      {/* Top Accent Stripe */}
                      <div
                        className="absolute top-0 inset-x-0 h-1 rounded-t-lg transition-opacity duration-300 opacity-80 group-hover:opacity-100"
                        style={{ backgroundColor: event.accent }}
                      />

                      {/* Header Row: Phase Badge & Status Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="border border-black px-2.5 py-0.5 font-mono text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]"
                            style={{ backgroundColor: event.accent }}
                          >
                            {event.phase}
                          </span>
                          <span className="font-mono text-[11px] font-bold tracking-wider text-muted uppercase">
                            {event.categoryLabel}
                          </span>
                        </div>

                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 uppercase border ${
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
                      <h3 className="mt-3 font-sans text-lg font-extrabold text-paper md:text-xl group-hover:text-white transition-colors">
                        {event.title}
                      </h3>

                      {/* Date & Time Badge */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                        <span className="flex items-center gap-1.5 text-paper/90 font-semibold">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: event.accent }}
                          />
                          {event.date}
                        </span>
                        <span className="text-paper/40">•</span>
                        <span>{event.time}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {event.desc}
                      </p>

                      {/* Highlight Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-paper/10">
                        {event.highlights.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm border border-paper/10 bg-void/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-paper/70"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
