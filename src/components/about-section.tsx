"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import bgAboutUs from "../../public/aboutus.png";
import milesSofa from "../../public/images/milessofa.png";
import bigTrainTightImg from "../../public/bigtrain-tight.png";
import timelineBg from "../../public/images/timeline-bg.jpg";
import { motion } from "framer-motion";
import TimelineSection from "./timeline-section";

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
  const aboutRoomRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const headlightsRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6,
          },
        });

        // 1. Phase 1: Generous hold on About Us room before train enters (0.00 -> 0.04)
        tl.fromTo(
          headlightsRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.02 },
          0.04
        );

        // Train rolls in smoothly from left to center (0.04 -> 0.12)
        tl.to(
          trainRef.current,
          { xPercent: 0, ease: "power1.out", duration: 0.08 },
          0.04
        );

        // 2. Dissolve About room as train covers the scene (0.08 -> 0.12)
        tl.to(
          aboutRoomRef.current,
          { opacity: 0, ease: "power1.inOut", duration: 0.04 },
          0.08
        );

        // 3. Phase 2: Slow crawl/deceleration when train fits the screen wholly (0.12 -> 0.18)
        tl.to(
          trainRef.current,
          { xPercent: 14, ease: "none", duration: 0.06 },
          0.12
        );

        // 4. Phase 3: Train smoothly departs OUT to the right (0.18 -> 0.25)
        tl.to(
          trainRef.current,
          { xPercent: 170, ease: "power1.in", duration: 0.07 },
          0.18
        );

        // 5. Scroll the timeline dynamically AFTER the train is fully gone (0.25 -> 1.0)
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
            duration: 0.75,
          },
          0.25
        );
        // Pull the web upwards exactly as the next section slides over it
        // This ensures the web perfectly visually sticks to the PrizesSection without any scrub delay
        gsap.to(".timeline-web-strand", {
          y: "-250vh",
          ease: "power1.in",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 200%", // exactly 100vh before the bottom hits the screen
            end: "bottom bottom",
            scrub: true, // no trailing lag
          }
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[700vh] w-full bg-black -mt-px -mb-[100vh]"
    >
      <h2 className="sr-only">About Us & Hackathon Timeline</h2>

      {/* Sticky Stage Container */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {/* 
          ══════════════════════════════════════════════════════════════
          LAYER 0 (Base): The Timeline Section
          - Revealed in place directly as the train passes from left to right
          ══════════════════════════════════════════════════════════════
        */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-auto overflow-hidden bg-[#fcd49b]">
          <div ref={timelineScrollRef} className="relative w-full">
            <TimelineSection />
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
            className="absolute inset-0 h-full will-change-transform"
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={bgAboutUs}
                alt="About Us Room Background"
                fill
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
            </div>
          </div>

          {/* Stationary Miles on Sofa */}
          <div className="absolute inset-x-0 -bottom-10 sm:-bottom-14 md:-bottom-20 z-10 flex w-full justify-center items-end px-2 pb-0">
            <div className="relative flex max-h-[82vh] md:max-h-[88vh] w-[min(96vw,1320px)] scale-95 md:scale-105 origin-bottom items-end justify-center">
              <Image
                src={milesSofa}
                alt="Miles Morales on Sofa"
                priority
                sizes="(max-width: 768px) 96vw, 1320px"
                className="h-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* 
          ══════════════════════════════════════════════════════════════
          LAYER 2 (Top): Subway Train (bigtrain-tight.png)
          - Drives from left to right on scroll, wiping from About into Timeline
          - Top roof & lights fully visible; wheels pushed cleanly below viewport
          ══════════════════════════════════════════════════════════════
        */}
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

            {/* Exactly 2 Real Looking Headlights */}
            <div
              ref={headlightsRef}
              className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
            >
              {/* --- HEADLIGHT 1 (Bottom Left / Inner Lamp: left: 87.5%, top: 59.5%) --- */}
              <div
                className="absolute"
                style={{ left: "87.5%", top: "59.5%" }}
              >
                {/* Wide Volumetric Forward Beam Cone */}
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

                {/* Soft Bulb Glow */}
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

              {/* --- HEADLIGHT 2 (Bottom Right / Outer Lamp: left: 97.2%, top: 59.0%) --- */}
              <div
                className="absolute"
                style={{ left: "97.2%", top: "59.0%" }}
              >
                {/* Wide Volumetric Forward Beam Cone */}
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

                {/* Soft Bulb Glow */}
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

      </div>
    </section>
  );
}
