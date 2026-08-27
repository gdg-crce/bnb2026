"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import bgAboutUs from "../../public/images/bg-aboutus.png";
import milesSofa from "../../public/images/milessofa.png";
import bigTrainImg from "../../public/bigtrain.jpg";

/**
 * About & Domains Section:
 * 1. Single pristine background room with smooth mouse parallax on the room.
 * 2. Stationary Miles Morales on sofa anchored firmly to the floor.
 * 3. On scroll, the full bigtrain.jpg subway train slowly rolls across in full view,
 *    showing the entire train (roof, wheels, Domains graffiti, front cab),
 *    and exits completely to the right to reveal the Timeline section.
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
          gsap.set(trainRef.current, { xPercent: -150 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        // 1. Hold on About room during first 12% of scroll (0.0 -> 0.12)
        // 2. Full bigtrain.jpg slowly rolls in from left to center (0.12 -> 0.50)
        tl.to(
          trainRef.current,
          {
            xPercent: 0,
            ease: "power1.out",
            duration: 0.38,
          },
          0.12,
        );

        // 3. Train cruises/holds in full uncropped view (0.50 -> 0.64)

        // 4. Train slowly accelerates and drives completely OUT to the right (0.64 -> 0.98)
        tl.to(
          trainRef.current,
          {
            xPercent: 150,
            ease: "power1.in",
            duration: 0.34,
          },
          0.64,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[680vh] w-full bg-black -mt-px"
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
          Layer 2: Full Subway Train (bigtrain.jpg)
          - 100% complete train visible (roof, wheels, Domains graffiti, front cab)
          - Rolls across slowly and exits completely to the right to reveal the Timeline
        */}
        <div
          ref={trainRef}
          className="pointer-events-none absolute inset-0 z-30 flex h-full w-full items-center justify-center overflow-visible will-change-transform"
        >
          <div className="relative flex h-full w-full max-h-[92vh] max-w-[96vw] items-center justify-center sm:max-h-[95vh] sm:max-w-[98vw] md:max-w-[1600px] lg:max-w-[1850px]">
            <Image
              src={bigTrainImg}
              alt="Domains Subway Train"
              priority
              sizes="100vw"
              className="h-auto w-full max-h-[90vh] object-contain drop-shadow-[0_45px_120px_rgba(0,0,0,0.98)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}




