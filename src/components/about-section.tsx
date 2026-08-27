"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import bgAboutUs from "../../public/images/bg-aboutus.png";
import milesSofa from "../../public/images/milessofa.png";
import bigTrainImg from "../../public/bigtrain-tight.png";

/**
 * About & Domains Section:
 * 1. Single pristine background room with smooth mouse parallax on the room (Zero duplicate overlays or seams).
 * 2. Stationary Miles Morales on sofa anchored firmly to the floor.
 * 3. On scroll, the massive train (pure transparent background) rolls across in huge scale,
 *    holds in full view, and drives completely OUT to the right.
 */
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);

  // Smooth mouse parallax on the room (Miles remains 100% stationary)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!wallRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5

    // Move smoothly just a little left and right
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
        // Initialize big train completely offscreen to the left
        if (trainRef.current) {
          gsap.set(trainRef.current, { xPercent: -145 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });

        // 1. Hold on About room during first 18% of scroll (0.0 -> 0.18)
        // 2. Massive transparent train rolls in from left to center (0.18 -> 0.48)
        tl.to(
          trainRef.current,
          {
            xPercent: -6,
            ease: "power1.out",
            duration: 0.30,
          },
          0.18,
        );

        // 3. Train holds / cruises in massive uncropped view (0.48 -> 0.65)

        // 4. Train accelerates and drives completely OUT to the right (0.65 -> 0.98)
        tl.to(
          trainRef.current,
          {
            xPercent: 145,
            ease: "power1.in",
            duration: 0.33,
          },
          0.65,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[360vh] w-full bg-black -mt-px"
    >
      <h2 className="sr-only">About Us & Domains</h2>

      {/* Sticky Stage Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
      >
        {/* 
          Layer 0: Pristine Background Room (bg-aboutus.png)
          - Single clean layer (NO duplicate overlays, NO stacked gradient seams)
          - Smooth subtle horizontal parallax
        */}
        <div
          ref={wallRef}
          className="pointer-events-none absolute -inset-x-6 inset-y-0 z-0 h-full will-change-transform"
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
            {/* Smooth Edge Ambience */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.45)_100%)]" />
          </div>
        </div>

        {/* 
          Layer 1: Foreground Miles on Sofa (milessofa.png)
          - Completely stationary (Zero parallax - Miles never moves)
          - Anchored firmly to the bottom floor
        */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex w-full justify-center items-end px-2 pb-0 md:pb-2">
          <div className="relative flex max-h-[78vh] w-[min(96vw,1200px)] items-end justify-center">
            <Image
              src={milesSofa}
              alt="Miles Morales on Sofa"
              priority
              sizes="(max-width: 768px) 96vw, 1200px"
              className="h-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* 
          Layer 2: Massive Big Subway Train Overlay (Transparent Background)
          - Pure transparent background layered directly on top of About
          - Scaled up to massive proportion across the screen
          - Rolls across the screen and exits completely to the right
        */}
        <div
          ref={trainRef}
          className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-hidden will-change-transform flex items-center justify-center"
        >
          <div className="relative flex w-[124vw] min-w-[1200px] max-w-none items-center justify-center scale-110 md:scale-120 lg:scale-125">
            <Image
              src={bigTrainImg}
              alt="Domains Massive Subway Train"
              priority
              sizes="130vw"
              className="h-auto w-full max-h-[96vh] object-contain drop-shadow-[0_35px_100px_rgba(0,0,0,0.99)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}




