"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import withCutImg from "../../public/about/withcut.png";
import milesImg from "../../public/about/miles.png";
import bigTrainTightImg from "../../public/trainwithdeets.png";
import TimelineSection from "./timeline-section";
import PrizesSection from "./prizes-section";

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

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // Mobile Choreography (<768px): About is fully visible first, train rolls in after scroll, departs completely, and timeline scrolls without long pauses
      media.add("(max-width: 768px)", () => {
        const getTrainOffscreenX = () => {
          const w = typeof window !== "undefined" ? window.innerWidth : 390;
          const h = typeof window !== "undefined" ? window.innerHeight : 844;
          const trainWidth = h * 1.96 * 2.3;
          return Math.max(w * 3.0, (trainWidth + w) * 0.75);
        };

        if (trainRef.current) {
          gsap.set(trainRef.current, { x: () => -getTrainOffscreenX(), visibility: "hidden", force3D: true });
        }
        if (headlightsRef.current) {
          gsap.set(headlightsRef.current, { opacity: 0, force3D: true });
        }
        if (aboutRoomRef.current) {
          gsap.set(aboutRoomRef.current, { opacity: 1, force3D: true });
        }
        if (prizesContainerRef.current) {
          gsap.set(prizesContainerRef.current, { yPercent: 100, opacity: 1, pointerEvents: "none", visibility: "visible", force3D: true });
        }
        if (timelineContainerRef.current) {
          gsap.set(timelineContainerRef.current, { yPercent: 0, opacity: 0, pointerEvents: "none", force3D: true });
        }
        if (withCutRef.current) {
          gsap.set(withCutRef.current, { scale: 1.04, y: 0, x: 0, force3D: true });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 1. About section is fully visible & scrolled first from 0.00 -> 0.28

        // 2. Train arrives AFTER about has been viewed (0.28 -> 0.44)
        tl.set(trainRef.current, { visibility: "visible" }, 0.28);

        tl.fromTo(
          headlightsRef.current,
          { opacity: 0 },
          { opacity: 0.48, ease: "sine.out", duration: 0.06 },
          0.28
        );

        tl.to(
          trainRef.current,
          { x: 0, ease: "sine.out", duration: 0.16 },
          0.28
        );

        // 3. Dissolve About room & Reveal Timeline underneath as train covers screen (0.36 -> 0.44)
        tl.to(
          aboutRoomRef.current,
          { opacity: 0, ease: "sine.inOut", duration: 0.08 },
          0.36
        );

        if (timelineContainerRef.current) {
          tl.to(
            timelineContainerRef.current,
            { opacity: 1, ease: "sine.inOut", duration: 0.08 },
            0.36
          );
          tl.set(timelineContainerRef.current, { pointerEvents: "auto" }, 0.44);
        }

        // 4. Train moves away completely to the right (0.44 -> 0.54)
        tl.to(
          trainRef.current,
          { x: () => getTrainOffscreenX(), ease: "power1.in", duration: 0.10 },
          0.44
        );

        // Immediately hide train so it is completely removed
        tl.set(trainRef.current, { visibility: "hidden", pointerEvents: "none" }, 0.54);

        // In mobile timeline: web is already there unspooled till the end (100%) right from the start!
        gsap.set(".timeline-web-clip", { height: "100%" });

        // 5. Timeline scrolls directly down through all events without long pause on mobile (0.52 -> 0.68)
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
            duration: 0.16,
          },
          0.52
        );

        // 6. Smoothly glide Prizes section up over Timeline (0.70 -> 0.79)
        tl.to(
          timelineScrollRef.current,
          {
            y: () => {
              const el = timelineScrollRef.current;
              if (!el) return 0;
              const diff = el.scrollHeight - window.innerHeight;
              return diff > 0 ? -diff * 0.45 : 0;
            },
            ease: "power2.out",
            duration: 0.09,
          },
          0.70
        );

        tl.to(
          prizesContainerRef.current,
          { yPercent: 0, ease: "power3.out", duration: 0.09, force3D: true },
          0.70
        );

        if (timelineContainerRef.current && prizesContainerRef.current) {
          tl.set(timelineContainerRef.current, { pointerEvents: "none" }, 0.79);
          tl.set(prizesContainerRef.current, { pointerEvents: "auto" }, 0.79);
        }
        tl.set(prizesContainerRef.current, { yPercent: 0 }, 0.79);

        // 7. Generous Hold / Pause on Prizes Section (0.79 -> 1.00) before unpinning
      });

      // Desktop Choreography (>=769px)
      media.add("(min-width: 769px)", () => {
        const getTrainOffscreenX = () => {
          const w = typeof window !== "undefined" ? window.innerWidth : 1920;
          const h = typeof window !== "undefined" ? window.innerHeight : 1080;
          const trainWidth = h * 1.96 * 2.3;
          return Math.max(w * 2.5, (trainWidth + w) * 0.65);
        };

        if (trainRef.current) {
          gsap.set(trainRef.current, { x: () => -getTrainOffscreenX(), visibility: "hidden", force3D: true });
        }
        if (headlightsRef.current) {
          gsap.set(headlightsRef.current, { opacity: 0, force3D: true });
        }
        if (aboutRoomRef.current) {
          gsap.set(aboutRoomRef.current, { opacity: 1, force3D: true });
        }
        if (prizesContainerRef.current) {
          gsap.set(prizesContainerRef.current, { yPercent: 100, opacity: 1, pointerEvents: "none", visibility: "visible", force3D: true });
        }
        if (timelineContainerRef.current) {
          gsap.set(timelineContainerRef.current, { yPercent: 0, opacity: 0, pointerEvents: "none", force3D: true });
        }
        if (withCutRef.current) {
          gsap.set(withCutRef.current, { scale: 1.04, y: 0, x: 0, force3D: true });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 1. Train arrives (0.10 -> 0.28)
        tl.set(trainRef.current, { visibility: "visible" }, 0.10);

        tl.fromTo(
          headlightsRef.current,
          { opacity: 0 },
          { opacity: 0.48, ease: "sine.out", duration: 0.08 },
          0.10
        );

        tl.to(
          trainRef.current,
          { x: 0, ease: "sine.out", duration: 0.18 },
          0.10
        );

        // 2. Dissolve About room & Reveal Timeline underneath (0.20 -> 0.28)
        tl.to(
          aboutRoomRef.current,
          { opacity: 0, ease: "sine.inOut", duration: 0.08 },
          0.20
        );

        if (timelineContainerRef.current) {
          tl.to(
            timelineContainerRef.current,
            { opacity: 1, ease: "sine.inOut", duration: 0.08 },
            0.20
          );
          tl.set(timelineContainerRef.current, { pointerEvents: "auto" }, 0.28);
        }

        // 3. Cruise & Depart (0.28 -> 0.34)
        tl.to(
          trainRef.current,
          { x: () => typeof window !== "undefined" ? window.innerWidth * 0.12 : 150, ease: "none", duration: 0.03 },
          0.28
        );

        tl.to(
          trainRef.current,
          { x: () => getTrainOffscreenX(), ease: "power1.in", duration: 0.05 },
          0.29
        );

        tl.set(trainRef.current, { visibility: "hidden", pointerEvents: "none" }, 0.34);

        gsap.set(".timeline-web-clip", { height: "0%" });

        // 5. Reduced PAUSE on Timeline entrance after train departs (0.34 -> 0.44)

        // 6. Smooth Timeline Continuous Auto-Scroll through to Result Declaration (0.44 -> 0.66)
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
            duration: 0.22,
          },
          0.44
        );

        tl.fromTo(
          ".timeline-web-clip",
          { height: "0%" },
          { height: "100%", ease: "none", duration: 0.22 },
          0.44
        );

        // 7. Comfortable pause after Result Declaration (0.66 -> 0.68)

        // 8. Silky glide of Prizes section up into full view (0.68 -> 0.77)
        tl.to(
          timelineScrollRef.current,
          {
            y: () => {
              const el = timelineScrollRef.current;
              if (!el) return 0;
              const diff = el.scrollHeight - window.innerHeight;
              return diff > 0 ? -diff * 0.45 : 0;
            },
            ease: "power2.out",
            duration: 0.09,
          },
          0.68
        );

        tl.to(
          prizesContainerRef.current,
          { yPercent: 0, ease: "power3.out", duration: 0.09, force3D: true },
          0.68
        );

        if (timelineContainerRef.current && prizesContainerRef.current) {
          tl.set(timelineContainerRef.current, { pointerEvents: "none" }, 0.77);
          tl.set(prizesContainerRef.current, { pointerEvents: "auto" }, 0.77);
        }
        tl.set(prizesContainerRef.current, { yPercent: 0 }, 0.77);

        // 9. Substantial, luxurious PAUSE on Prizes Section from 0.77 -> 1.00 (23% scroll distance) before scrolling to next section
      });
    },
    { scope: sectionRef },
  );

  // Interactive mouse parallax for withcut.png (Horizontal-focused with bare minimum vertical)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!withCutRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xOffset = ((clientX / innerWidth) - 0.5) * -24;
    const yOffset = ((clientY / innerHeight) - 0.5) * -2;

    gsap.to(withCutRef.current, {
      x: xOffset,
      y: yOffset,
      duration: 0.8,
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
      className="relative h-[900vh] w-full bg-black -mt-px -mb-px"
    >
      <h2 className="sr-only">About Us, Timeline & Prizes</h2>

      {/* Sticky Stage Container */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {/* LAYER 0: The Timeline Section (Hidden until train enters) */}
        <div ref={timelineContainerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden bg-[#fcd49b] opacity-0">
          <div ref={timelineScrollRef} className="relative w-full">
            <TimelineSection />
          </div>
        </div>

        {/* LAYER 1: About Us Room */}
        <div
          ref={aboutRoomRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full will-change-transform overflow-hidden bg-black"
        >
          <div
            ref={withCutRef}
            className="absolute inset-0 z-0 h-full w-full will-change-transform overflow-hidden flex items-center justify-center"
          >
            <div className="relative h-full w-full flex items-center justify-center translate-y-[3.5vh] sm:translate-y-[5.5vh] md:translate-y-[7.5vh]">
              <Image
                src={withCutImg}
                alt="About Us Subway Station Wall"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="h-full w-full object-cover object-center select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/45" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
            </div>
          </div>

          <div
            ref={milesRef}
            className="absolute inset-0 z-10 h-full w-full will-change-transform flex items-end justify-center pointer-events-none select-none translate-y-[6vh] sm:translate-y-[12vh] md:translate-y-[14vh]"
          >
            <div className="relative h-full w-full flex items-end justify-center">
              <Image
                src={milesImg}
                alt="Miles Morales on Subway Platform Sofa"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="h-full w-full object-cover object-bottom select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* LAYER 2: Subway Train */}
        <div
          ref={trainRef}
          className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center will-change-transform transform-gpu [backface-visibility:hidden]"
        >
          <div className="relative flex h-[184vh] sm:h-[188vh] md:h-[192vh] lg:h-[196vh] w-auto max-w-none items-center justify-center scale-100 translate-y-[5.5vh] sm:translate-y-[6vh] md:translate-y-[6.5vh] transform-gpu [backface-visibility:hidden]">
            <Image
              src={bigTrainTightImg}
              alt="Domains Subway Train"
              priority
              unoptimized
              className="h-full w-auto max-w-none object-contain select-none [image-rendering:high-quality] [image-rendering:-webkit-optimize-contrast]"
            />

            <div
              ref={headlightsRef}
              className="pointer-events-none absolute inset-0 h-full w-full will-change-transform opacity-75"
            >
              <div className="absolute" style={{ left: "86.4%", top: "56.4%" }}>
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

              <div className="absolute" style={{ left: "96.1%", top: "55.9%" }}>
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

        {/* LAYER 3: The Prizes Stage (Slides Up Over Timeline) */}
        <div
          ref={prizesContainerRef}
          className="absolute inset-0 z-30 h-full w-full pointer-events-auto will-change-transform"
        >
          <PrizesSection />
        </div>

      </div>
    </section>
  );
}
