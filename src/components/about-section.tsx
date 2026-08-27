"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

import eventSectionImage from "../../public/images/EventSection.png";
import eventMilesImage from "../../public/images/EventMiles.png";

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".about-backdrop",
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

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
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // POV Mouse Interaction for the whole section
        const rotXTo = gsap.quickTo(".about-pov-container", "rotationX", { duration: 0.8, ease: "power3.out" });
        const rotYTo = gsap.quickTo(".about-pov-container", "rotationY", { duration: 0.8, ease: "power3.out" });

        const onMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const xPos = (e.clientX / innerWidth - 0.5) * 2;
          const yPos = (e.clientY / innerHeight - 0.5) * 2;

          rotXTo(-yPos * 3); // Subtle 3deg tilt
          rotYTo(xPos * 3);
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="halftone relative z-10 overflow-hidden min-h-screen" style={{ perspective: "1500px" }}>
      <div className="about-pov-container w-full h-full min-h-screen relative origin-center scale-[1.05]" style={{ transformStyle: 'preserve-3d' }}>

        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute inset-0 h-[112%] w-full overflow-hidden">
            <Image
              src={eventSectionImage}
              alt=""
              aria-hidden="true"
              placeholder="blur"
              fill
              sizes="100vw"
              className="about-backdrop object-cover object-center"
            />
          </div>
        </div>

        {/* Bottom center section: EventMiles */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 z-20 w-[110%] max-w-sm md:max-w-md lg:max-w-lg event-miles" style={{ transform: "translateZ(150px)" }}>
          <div className="event-miles-3d">
            <Image
              src={eventMilesImage}
              alt="Miles Morales"
              className="w-full h-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] scale-[3] origin-bottom"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
