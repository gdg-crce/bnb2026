"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

import eventSectionImage from "../../public/images/EventSection.jpg";
import eventAboutImage from "../../public/images/EventAbout.png";
import eventMapImage from "../../public/images/EventMap.png";
import eventTextImage from "../../public/images/EventText.png";

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

        gsap.from(".event-text", {
          opacity: 0,
          y: 44,
          duration: 1.2,
          scrollTrigger: { trigger: ".event-text", start: "top 88%" },
        });

        gsap.from(".event-map", {
          opacity: 0,
          x: -48,
          duration: 1.3,
          scrollTrigger: { trigger: ".event-map", start: "top 85%" },
        });

        gsap.from(".event-about", {
          opacity: 0,
          x: 48,
          duration: 1.3,
          scrollTrigger: { trigger: ".event-about", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="halftone relative z-10 overflow-hidden">
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

      {/* Top section: EventText */}
      <div className="absolute top-[8vh] left-6 md:left-12 z-20 w-[70%] max-w-sm md:max-w-md lg:max-w-lg">
        <div className="event-text">
          <Image
            src={eventTextImage}
            alt="Event Begins In"
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Spacer to delay map appearance until after fade transition */}
      <div className="h-[35vh]" />

      <div className="relative px-6 pb-32 md:px-10 md:pb-44 mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-[180px] lg:gap-x-[350px] items-center -translate-y-[40px]">
          <div className="event-map flex justify-center md:justify-end">
            <Image
              src={eventMapImage}
              alt="Event Map"
              className="h-auto w-full max-w-[90%] md:max-w-[120%] lg:max-w-[140%] object-contain drop-shadow-xl"
            />
          </div>

          <div className="event-about flex justify-center md:justify-start">
            <Image
              src={eventAboutImage}
              alt="Event About"
              className="h-auto w-full max-w-[90%] md:max-w-lg object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
