"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import withCutImg from "../../public/about/withcut.png";
import milesImg from "../../public/about/miles.png";
import bigTrainTightImg from "../../public/bigtrain-tight.png";
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
          gsap.set(prizesContainerRef.current, { yPercent: 100, opacity: 1, pointerEvents: "none", visibility: "visible" });
        }

        if (timelineContainerRef.current) {
          gsap.set(timelineContainerRef.current, { yPercent: 0, opacity: 1, pointerEvents: "auto" });
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
                scrub: 1.0,
              },
            }
          );
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        // 1. Phase 1: Generous hold on About Us room before train approaches (0.00 -> 0.08)
        tl.fromTo(
          headlightsRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.03 },
          0.06
        );

        // Train rolls in smoothly & slowly from left to center (0.08 -> 0.22)
        tl.to(
          trainRef.current,
          { xPercent: 0, ease: "power1.out", duration: 0.14 },
          0.08
        );

        // 2. Dissolve About room as train covers the scene (0.14 -> 0.22)
        tl.to(
          aboutRoomRef.current,
          { opacity: 0, ease: "power1.inOut", duration: 0.08 },
          0.14
        );

        // 3. Phase 2: Slow cinematic crawl when train fits the screen wholly (0.22 -> 0.30)
        tl.to(
          trainRef.current,
          { xPercent: 16, ease: "none", duration: 0.08 },
          0.22
        );

        // 4. Phase 3: Train smoothly departs OUT to the right (0.30 -> 0.38)
        tl.to(
          trainRef.current,
          { xPercent: 170, ease: "power1.in", duration: 0.08 },
          0.30
        );

        // Initialize web strand at 0% height (at Pavitr's hand)
        gsap.set(".timeline-web-clip", {
          height: "0%",
        });

        // 5. Scroll the timeline dynamically AFTER the train is fully gone (0.38 -> 0.60)
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
          0.38
        );

        // 5b. Web strand shoots & unspools downwards from Pavitr as user scrolls (0.38 -> 0.60)
        tl.fromTo(
          ".timeline-web-clip",
          {
            height: "0%",
          },
          {
            height: "100%",
            ease: "none",
            duration: 0.22,
          },
          0.38
        );

        // 6. Brief hold on completed timeline (0.60 -> 0.62)

        // 7. Prizes section gets PULLED UP over the timeline as a whole panel (0.62 -> 0.76)
        tl.to(
          prizesContainerRef.current,
          {
            yPercent: 0,
            ease: "power2.out",
            duration: 0.14,
          },
          0.62
        );

        // Subtle timeline recoil — gets pushed down slightly as prizes slides over it
        tl.to(
          timelineContainerRef.current,
          {
            yPercent: -8,
            scale: 0.97,
            ease: "power1.in",
            duration: 0.14,
          },
          0.62
        );

        // Switch pointer events once prizes fully covers the screen
        if (timelineContainerRef.current && prizesContainerRef.current) {
          tl.set(timelineContainerRef.current, { pointerEvents: "none" }, 0.76);
          tl.set(prizesContainerRef.current, { pointerEvents: "auto" }, 0.76);
        }

        // Force-ensure prizes is fully in position at 0.76 (safety net)
        tl.set(prizesContainerRef.current, { yPercent: 0 }, 0.76);

        // 8. Prizes Section remains pinned, fully visible & interactive from 0.76 -> 1.00 (Long comfortable hold)
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
      className="relative h-[900vh] w-full bg-black -mt-px -mb-px"
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
            <div className="relative h-[114%] w-full -top-[2%] sm:-top-[1%] md:top-0 flex items-start justify-center translate-y-[2vh] sm:translate-y-[3vh] md:translate-y-[4vh]">
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
            className="absolute inset-0 z-10 h-full w-full will-change-transform flex items-end justify-center pointer-events-none select-none translate-y-[12vh] sm:translate-y-[14vh] md:translate-y-[16vh]"
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
          <div className="relative flex h-[112vh] sm:h-[116vh] md:h-[120vh] lg:h-[124vh] w-auto max-w-none items-center justify-center scale-100 sm:scale-[1.02] md:scale-[1.04] translate-y-[2vh] sm:translate-y-[2.5vh] md:translate-y-[3vh] lg:translate-y-[3.5vh]">
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
