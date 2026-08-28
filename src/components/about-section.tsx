"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import withCutImg from "../../public/about/withcut.png";
import milesImg from "../../public/about/miles.png";
import bigTrainTightImg from "../../public/bigtrain-tight.png";
import TimelineSection from "./timeline-section";
import PrizesSection from "./prizes-section";

const NUM_OVERLAY_POINTS = 10;
const NUM_OVERLAY_PATHS = 3;
const OVERLAY_POINT_OFFSETS = [0.0, 0.04, 0.015, 0.06, 0.02, 0.05, 0.01, 0.045, 0.03, 0.015];

/**
 * Builds a continuous closed polygon path with cubic bezier curves for both top and bottom edges.
 * - topY = 0, bottomY = 0       -> 0 height at top (invisible)
 * - topY = 0, bottomY = 100     -> Full screen coverage (100% filled)
 * - topY = 100, bottomY = 100   -> 0 height at bottom (invisible)
 */
function buildLiquidPathD(topY: number[], bottomY: number[]): string {
  const n = NUM_OVERLAY_POINTS;
  let d = `M 0 ${topY[0]}`;

  // Top edge (left to right: x: 0 -> 100)
  for (let j = 0; j < n - 1; j++) {
    const p1 = (j / (n - 1)) * 100;
    const p2 = ((j + 1) / (n - 1)) * 100;
    const cp1 = p1 + (p2 - p1) / 2;
    d += ` C ${cp1} ${topY[j]} ${cp1} ${topY[j + 1]} ${p2} ${topY[j + 1]}`;
  }

  // Right vertical segment to bottom edge
  d += ` L 100 ${bottomY[n - 1]}`;

  // Bottom edge (right to left: x: 100 -> 0)
  for (let j = n - 1; j > 0; j--) {
    const p1 = (j / (n - 1)) * 100;
    const p2 = ((j - 1) / (n - 1)) * 100;
    const cp1 = p1 + (p2 - p1) / 2;
    d += ` C ${cp1} ${bottomY[j]} ${cp1} ${bottomY[j - 1]} ${p2} ${bottomY[j - 1]}`;
  }

  // Close back to top-left
  d += ` Z`;
  return d;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const aboutRoomRef = useRef<HTMLDivElement>(null);
  const withCutRef = useRef<HTMLDivElement>(null);
  const milesRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const headlightsRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const prizesContainerRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Initialize train completely offscreen to the left and headlights off
        if (trainRef.current) {
          gsap.set(trainRef.current, { xPercent: -170 });
        }

        if (headlightsRef.current) {
          gsap.set(headlightsRef.current, { opacity: 0 });
        }

        if (aboutRoomRef.current) {
          gsap.set(aboutRoomRef.current, { opacity: 1 });
        }

        if (prizesContainerRef.current) {
          gsap.set(prizesContainerRef.current, { opacity: 0, pointerEvents: "none" });
        }

        if (timelineContainerRef.current) {
          gsap.set(timelineContainerRef.current, { opacity: 1, pointerEvents: "auto" });
        }

        // Parallax effect on withcut.png background wall
        if (withCutRef.current) {
          gsap.fromTo(
            withCutRef.current,
            { yPercent: -4, scale: 1.03 },
            {
              yPercent: 4,
              scale: 1.01,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        // Dynamic Morphing SVG setup
        const svg = svgOverlayRef.current;
        const pathEls = svg
          ? Array.from(svg.querySelectorAll<SVGPathElement>(".shape-overlays__path"))
          : [];

        const allTopY: number[][] = [];
        const allBottomY: number[][] = [];

        for (let i = 0; i < NUM_OVERLAY_PATHS; i++) {
          allTopY.push(Array(NUM_OVERLAY_POINTS).fill(0));
          allBottomY.push(Array(NUM_OVERLAY_POINTS).fill(0));
        }

        function renderOverlay() {
          if (pathEls.length < NUM_OVERLAY_PATHS) return;
          for (let i = 0; i < NUM_OVERLAY_PATHS; i++) {
            const path = pathEls[i];
            if (!path) continue;
            path.setAttribute("d", buildLiquidPathD(allTopY[i], allBottomY[i]));
          }
        }

        // Initial state: 0 height at top (invisible)
        renderOverlay();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.4,
          },
          onUpdate: renderOverlay,
        });

        // 1. Phase 1: Generous hold on About Us room before train enters (0.00 -> 0.03)
        tl.fromTo(
          headlightsRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.02 },
          0.03
        );

        // Train rolls in smoothly from left to center (0.03 -> 0.10)
        tl.to(
          trainRef.current,
          { xPercent: 0, ease: "power1.out", duration: 0.07 },
          0.03
        );

        // 2. Dissolve About room as train covers the scene (0.06 -> 0.10)
        tl.to(
          aboutRoomRef.current,
          { opacity: 0, ease: "power1.inOut", duration: 0.04 },
          0.06
        );

        // 3. Phase 2: Slow crawl/deceleration when train fits the screen wholly (0.10 -> 0.15)
        tl.to(
          trainRef.current,
          { xPercent: 14, ease: "none", duration: 0.05 },
          0.10
        );

        // 4. Phase 3: Train smoothly departs OUT to the right (0.15 -> 0.22)
        tl.to(
          trainRef.current,
          { xPercent: 170, ease: "power1.in", duration: 0.07 },
          0.15
        );

        // 5. Scroll the timeline dynamically AFTER the train is fully gone (0.22 -> 0.52)
        tl.to(
          timelineScrollRef.current,
          {
            y: () => {
              const el = timelineScrollRef.current;
              if (!el) return 0;
              const diff = el.scrollHeight - window.innerHeight;
              return diff > 0 ? -diff : 0;
            },
            ease: "none",
            duration: 0.30,
          },
          0.22
        );

        // 6. Locked hold on end of timeline from 0.52 -> 0.60 (user sees all rounds stationary)

        // 7. Dynamic Morphing SVG wave sweeps down from top to cover locked timeline (0.60 -> 0.74)
        for (let i = 0; i < NUM_OVERLAY_PATHS; i++) {
          const bottomPts = allBottomY[i];
          const pathDelay = i * 0.025;
          for (let j = 0; j < NUM_OVERLAY_POINTS; j++) {
            const ptDelay = OVERLAY_POINT_OFFSETS[j] * 0.04;
            const start = 0.60 + ptDelay + pathDelay;
            const dur = 0.74 - start;
            tl.to(
              bottomPts,
              {
                [j]: 100,
                ease: "power2.inOut",
                duration: Math.max(dur, 0.06),
              },
              start
            );
          }
        }

        // 8. Under-Curtain Switch at Full Cover (0.75): Switch view from Timeline to Prizes
        if (timelineContainerRef.current && prizesContainerRef.current) {
          tl.set(timelineContainerRef.current, { opacity: 0, pointerEvents: "none" }, 0.75);
          tl.set(prizesContainerRef.current, { opacity: 1, pointerEvents: "auto" }, 0.75);
        }

        // 9. Dynamic Morphing SVG wave pulls down to bottom, revealing Prizes stage (0.77 -> 0.91)
        for (let i = 0; i < NUM_OVERLAY_PATHS; i++) {
          const topPts = allTopY[i];
          const pathDelay = (NUM_OVERLAY_PATHS - i - 1) * 0.025;
          for (let j = 0; j < NUM_OVERLAY_POINTS; j++) {
            const ptDelay = OVERLAY_POINT_OFFSETS[j] * 0.04;
            const start = 0.77 + ptDelay + pathDelay;
            const dur = 0.91 - start;
            tl.to(
              topPts,
              {
                [j]: 100,
                ease: "power2.inOut",
                duration: Math.max(dur, 0.06),
              },
              start
            );
          }
        }

        // 10. Prizes Section remains pinned, open & fully interactive from 0.91 -> 1.00
      });
    },
    { scope: sectionRef },
  );

  // Interactive mouse parallax for withcut.png
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!withCutRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xOffset = ((clientX / innerWidth) - 0.5) * -20;
    const yOffset = ((clientY / innerHeight) - 0.5) * -12;

    gsap.to(withCutRef.current, {
      x: xOffset,
      y: yOffset,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!withCutRef.current) return;
    gsap.to(withCutRef.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[950vh] w-full bg-black -mt-px -mb-px"
    >
      <h2 className="sr-only">About Us, Timeline & Prizes</h2>

      {/* Sticky Stage Container */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {/* LAYER 0: The Timeline Section */}
        <div ref={timelineContainerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-auto overflow-hidden bg-[#fcd49b]">
          <div ref={timelineScrollRef} className="relative w-full">
            <TimelineSection />
          </div>
        </div>

        {/* LAYER 1: About Us Room */}
        <div
          ref={aboutRoomRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full will-change-transform overflow-hidden"
        >
          <div
            ref={withCutRef}
            className="absolute inset-0 z-0 h-full w-full will-change-transform overflow-hidden flex items-start justify-center"
          >
            <div className="relative h-[114%] w-full -top-[7%] flex items-start justify-center">
              <Image
                src={withCutImg}
                alt="About Us Subway Station Wall"
                fill
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-top select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/45" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
            </div>
          </div>

          <div
            ref={milesRef}
            className="absolute inset-0 z-10 h-full w-full will-change-transform flex items-end justify-center pointer-events-none select-none translate-y-[4vh] sm:translate-y-[5vh] md:translate-y-[6vh]"
          >
            <div className="relative h-full w-full">
              <Image
                src={milesImg}
                alt="Miles Morales on Subway Platform Sofa"
                fill
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-bottom select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* LAYER 2: Subway Train */}
        <div
          ref={trainRef}
          className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center will-change-transform"
        >
          <div className="relative flex h-[100vh] sm:h-[104vh] md:h-[108vh] lg:h-[112vh] w-auto max-w-none items-center justify-center scale-100 sm:scale-[1.02] md:scale-[1.04] translate-y-[7vh] sm:translate-y-[8vh] md:translate-y-[9vh] lg:translate-y-[10vh]">
            <Image
              src={bigTrainTightImg}
              alt="Domains Subway Train"
              priority
              className="h-full w-auto max-w-none object-contain drop-shadow-[0_50px_140px_rgba(0,0,0,0.98)]"
            />

            <div
              ref={headlightsRef}
              className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
            >
              <div className="absolute" style={{ left: "87.5%", top: "59.5%" }}>
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: "0px",
                    top: "0px",
                    width: "max(1500px, 95vw)",
                    height: "min(620px, 75vh)",
                    transformOrigin: "0% 50%",
                    transform: "translate(0, -50%)",
                    clipPath: "polygon(0% 49%, 100% -10%, 100% 110%, 0% 51%)",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,245,160,0.65) 6%, rgba(255,225,50,0.28) 25%, rgba(255,210,0,0.08) 55%, transparent 100%)",
                    filter: "blur(20px)",
                    mixBlendMode: "screen",
                  }}
                />
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: "0px",
                    top: "0px",
                    width: "28px",
                    height: "28px",
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(circle, #ffffff 25%, #fff7a0 55%, #ffd230 80%, transparent 100%)",
                    boxShadow:
                      "0 0 18px 8px rgba(255,255,255,0.9), 0 0 45px 18px rgba(255,220,50,0.7), 0 0 90px 35px rgba(255,190,0,0.35)",
                  }}
                />
              </div>

              <div className="absolute" style={{ left: "97.2%", top: "59.0%" }}>
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: "0px",
                    top: "0px",
                    width: "max(1600px, 100vw)",
                    height: "min(680px, 80vh)",
                    transformOrigin: "0% 50%",
                    transform: "translate(0, -50%)",
                    clipPath: "polygon(0% 49%, 100% -12%, 100% 112%, 0% 51%)",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,245,160,0.7) 6%, rgba(255,225,50,0.3) 25%, rgba(255,210,0,0.09) 55%, transparent 100%)",
                    filter: "blur(20px)",
                    mixBlendMode: "screen",
                  }}
                />
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: "0px",
                    top: "0px",
                    width: "30px",
                    height: "30px",
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(circle, #ffffff 25%, #fff7a0 55%, #ffd230 80%, transparent 100%)",
                    boxShadow:
                      "0 0 20px 8px rgba(255,255,255,0.9), 0 0 50px 20px rgba(255,220,50,0.75), 0 0 100px 40px rgba(255,190,0,0.4)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LAYER 3: The Prizes Stage */}
        <div
          ref={prizesContainerRef}
          className="absolute inset-0 z-30 h-full w-full pointer-events-auto"
        >
          <PrizesSection />
        </div>

        {/* LAYER 4: Dynamic Morphing SVG Overlay */}
        <svg
          ref={svgOverlayRef}
          className="shape-overlays pointer-events-none absolute inset-0 z-40 h-full w-full select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Layer 1: Crimson Red to Gwen Magenta */}
            <linearGradient id="about-trans-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d6070c" />
              <stop offset="60%" stopColor="#e5308c" />
              <stop offset="100%" stopColor="#7a0016" />
            </linearGradient>

            {/* Layer 2: Electric Cyan to Midnight Navy */}
            <linearGradient id="about-trans-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22b6d6" />
              <stop offset="50%" stopColor="#0a4b6e" />
              <stop offset="100%" stopColor="#041e3f" />
            </linearGradient>

            {/* Layer 3: Deep Void with Crimson Rim */}
            <linearGradient id="about-trans-grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e100f" />
              <stop offset="80%" stopColor="#1a0408" />
              <stop offset="100%" stopColor="#d6070c" />
            </linearGradient>
          </defs>

          <path className="shape-overlays__path" fill="url(#about-trans-grad-1)" />
          <path className="shape-overlays__path" fill="url(#about-trans-grad-2)" />
          <path className="shape-overlays__path" fill="url(#about-trans-grad-3)" />
        </svg>

      </div>
    </section>
  );
}
