"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import beforeHeroImg from "../../public/images/beforehero.jpg";
import cityBgImg from "../../public/images/city-bg.jpg";
import logoImg from "../../public/images/logo.png";

/**
 * Cinematic Hero Sequence:
 * 1. Preloader video dynamically centered to viewport on pure black.
 * 2. Plays first 7 seconds, then smoothly reveals full-screen `beforehero.jpg`.
 * 3. On scroll, ultra-smooth fluid zoom directly into the center of the right eye lens (70% 48%).
 * 4. Reveals city background image fitted to the screen.
 * 5. BnB logo fades in centered on screen, and Spider-Verse yellow CTA box glides in from the BOTTOM.
 * 6. Both stay in place for an extended buffer before scrolling continues.
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const preloaderVideoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);

  useEffect(() => {
    const video = preloaderVideoRef.current;

    const dismissPreloader = () => {
      setIsPreloaderActive(false);
    };

    if (video) {
      const handleTimeUpdate = () => {
        // Play only the first 7 seconds of the preloader video
        if (video.currentTime >= 6.8) {
          dismissPreloader();
          video.pause();
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", dismissPreloader);
      video.play().catch(() => {
        // Fallback if browser policy restricts autoplay
        dismissPreloader();
      });

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", dismissPreloader);
      };
    }

    // Failsafe timeout: dismiss at 7.5 seconds
    const failsafeTimer = setTimeout(dismissPreloader, 7500);

    // If user starts scrolling, dismiss preloader immediately
    const handleScroll = () => {
      if (window.scrollY > 15) {
        dismissPreloader();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(failsafeTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=520%",
            scrub: 1.2, // Buttery smooth scroll damping
            pin: true,
            anticipatePin: 1,
          },
        });

        // 1. Ultra-smooth continuous zoom directly into the center of the right eye lens (anchored at 70% 48%)
        tl.to(
          heroImageRef.current,
          {
            scale: 36,
            ease: "power1.inOut",
            duration: 0.32,
          },
          0,
        );

        // 2. Early reveal of city background: dissolves beforehero as zoom begins
        tl.to(
          heroImageRef.current,
          {
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.16,
          },
          0.12,
        );

        // 3. Fade out corner chrome during initial zoom
        tl.to(
          ".hero-chrome",
          {
            opacity: 0,
            ease: "power1.out",
            duration: 0.1,
          },
          0.04,
        );

        // 4. BnB Logo fades and glides down from the TOP into center
        tl.fromTo(
          logoRef.current,
          {
            opacity: 0,
            y: -120,
            scale: 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.14,
          },
          0.3,
        );

        // 5. CTA fades and glides up from the BOTTOM
        tl.fromTo(
          ctaRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.14,
          },
          0.36,
        );

        // 6. Long stay buffer: from 0.50 to 1.0 (50% of the entire timeline), the hero section stays completely in place
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="halftone relative h-screen w-full overflow-hidden bg-black"
    >
      <h1 className="sr-only">bitNbuild</h1>

      {/* Layer 0: City Background (revealed when zoom enters the eyes) */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black">
        <Image
          src={cityBgImg}
          alt="City Background"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
        {/* Subtle ambient gradient overlay to seat the logo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>

      {/* Layer 1: BnB Logo (Centered on screen, fades in from the TOP) */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0"
      >
        <div className="relative flex max-h-[50vh] w-[min(85vw,620px)] items-center justify-center">
          <Image
            src={logoImg}
            alt="Bit N Build Logo"
            priority
            className="h-auto w-full object-contain drop-shadow-[0_16px_50px_rgba(0,0,0,0.95)]"
          />
        </div>
      </div>

      {/* Layer 2: Spider-Verse Yellow Dialogue Box CTA (Positioned more upwards, fades in from the BOTTOM) */}
      <div
        ref={ctaRef}
        className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex justify-center opacity-0 md:bottom-24"
      >
        <div className="pointer-events-auto">
          <a
            href="#about"
            className="group relative inline-flex items-center gap-3 -rotate-1 border-[2.5px] border-black bg-[#FFE600] px-7 py-3 font-mono text-sm font-black uppercase tracking-wider text-black shadow-[5px_5px_0px_#000000] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:rotate-0 hover:bg-[#FFF033] hover:shadow-[7px_7px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000000] md:px-9 md:py-3.5 md:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>REGISTER NOW</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                ➔
              </span>
            </span>
            {/* Subtle halftone comic dot pattern */}
            <span className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:6px_6px]" />
          </a>
        </div>
      </div>

      {/* Layer 3: beforehero.jpg (Full screen cover, zooms directly into the center of right eye at 70% 48%) */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 z-20 h-full w-full origin-[70%_48%]"
      >
        <Image
          src={beforeHeroImg}
          alt="Hero Visual"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Layer 4: preloader.mp4 (Dynamically centered to screen) */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center bg-black transition-opacity duration-1000 ${
          isPreloaderActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="relative flex max-h-[45vh] w-[min(72vw,440px)] items-center justify-center overflow-hidden">
          <video
            ref={preloaderVideoRef}
            src="/preloader.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="aspect-[876/432] h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Hero Chrome (Corner metadata) */}
      <div className="hero-chrome pointer-events-none absolute inset-0 z-40 flex items-start justify-between p-6 transition-opacity duration-700 md:p-10">
        <span className="eyebrow">Google Developer Groups</span>
        <span className="eyebrow hidden sm:block">Ed. 2026</span>
      </div>
    </section>
  );
}









