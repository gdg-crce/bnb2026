"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroGlitchReveal from "@/components/hero-glitch-reveal";
import heroBgImg from "../../public/images/herobg.png";
import logoImg from "../../public/images/logo.png";
import blackLogoImg from "../../public/images/blacklogo.png";

/**
 * Cinematic Hero Sequence:
 * 1. Fullscreen isolated preloader video plays first 5 seconds with scroll locked.
 * 2. Reveals the hero immediately after preloader dismisses.
 * 3. Shows herobg.png, large dynamic Bit N Build logo, and the Spider-Verse yellow CTA button.
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const preloaderVideoRef = useRef<HTMLVideoElement>(null);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);

  useEffect(() => {
    const video = preloaderVideoRef.current;

    // Lock scrolling while preloader runs so no other section is visible or scrollable
    const lockScroll = () => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    };

    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    lockScroll();

    const dismissPreloader = () => {
      setIsPreloaderActive(false);
      unlockScroll();
    };

    // Prevent wheel/touch scrolling during preloader
    const preventScroll = (e: Event) => {
      if (isPreloaderActive) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    if (video) {
      const handleTimeUpdate = () => {
        // Play the first 5 seconds precisely
        if (video.currentTime >= 5.0) {
          dismissPreloader();
          video.pause();
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", dismissPreloader);
      video.play().catch(() => {
        dismissPreloader();
      });

      const failsafeTimer = setTimeout(dismissPreloader, 5000);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", dismissPreloader);
        clearTimeout(failsafeTimer);
        unlockScroll();
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
      };
    }

    const failsafeTimer = setTimeout(dismissPreloader, 5000);

    return () => {
      clearTimeout(failsafeTimer);
      unlockScroll();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [isPreloaderActive]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-black"
    >
      <h1 className="sr-only">bitNbuild</h1>

      {/* Layer 0: Fullscreen Dedicated Preloader Overlay (Locks viewport, cursor visible) */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-default transition-opacity duration-1000 ease-out ${
          isPreloaderActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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

      {/* Sticky Stage Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black halftone md:cursor-none">
        {/* Layer 0: herobg.png (with Spider-Verse B&W Glitch Hover Reveal) */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black">
          <HeroGlitchReveal
            src={heroBgImg}
            alt="Hero Background Visual"
            priority
            revealSize={300}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.38)_100%)]" />
          {/* Feather the bottom edge to blend seamlessly into the black pipes section below */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
        </div>

        {/* Layer 1: Base Red Logo */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[8vh] z-10 flex justify-center opacity-100 sm:top-[20vh] md:top-[24vh] transform-gpu will-change-transform px-1 sm:px-4"
        >
          <div className="relative flex max-h-[62vh] w-[min(98vw,920px)] scale-[1.18] origin-center items-center justify-center sm:scale-100">
            <Image
              src={logoImg}
              alt="Bit N Build Logo"
              priority
              className="h-auto w-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* Layer 1b: Black Logo Mask Reveal Layer (Reveals blacklogo.png inside the liquid spline mask) */}
        <div
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden"
          style={{
            clipPath: "url(#sv-liquid-spline-clip)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-[8vh] flex justify-center opacity-100 sm:top-[20vh] md:top-[24vh] transform-gpu will-change-transform px-1 sm:px-4"
          >
            <div className="relative flex max-h-[62vh] w-[min(98vw,920px)] scale-[1.18] origin-center items-center justify-center sm:scale-100">
              <Image
                src={blackLogoImg}
                alt="Bit N Build Black Logo"
                priority
                className="h-auto w-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        </div>

        {/* Layer 2: Spider-Verse Yellow Dialogue Box CTA (Shifted upwards on mobile) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[28vh] z-20 flex justify-center opacity-100 sm:bottom-[24vh] md:bottom-[25vh] lg:bottom-[26vh] transform-gpu will-change-transform"
        >
          <div className="pointer-events-auto">
            <a
              href="https://unstop.com/hackathons/bit-n-build-around-the-world-2026-fr-conceicao-rodrigues-college-of-engineering-frcrce-bandra-1743581"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 -rotate-1 border-[2.5px] border-black bg-[#FFE600] px-8 py-3.5 text-base font-mono font-black uppercase tracking-wider text-black shadow-[6px_6px_0px_#000000] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:rotate-0 hover:bg-[#FFF033] hover:shadow-[8px_8px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000000] sm:px-9 sm:py-3.5 md:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>REGISTER NOW</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  ➔
                </span>
              </span>
              <span className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:6px_6px]" />
            </a>
          </div>
        </div>

        {/* Hero Chrome */}
        <div className="hero-chrome pointer-events-none absolute inset-0 z-40 flex items-start justify-between p-6 transition-opacity duration-700 md:p-10">
          <span className="eyebrow">Google Developer Groups</span>
          <span className="eyebrow hidden sm:block">Ed. 2026</span>
        </div>
      </div>
    </section>
  );
}

