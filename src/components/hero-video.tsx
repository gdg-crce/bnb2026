"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import HeroGlitchReveal from "@/components/hero-glitch-reveal";
import beforeHeroImg from "../../public/images/beforehero.jpg";
import heroBgImg from "../../public/images/herobg.png";
import logoImg from "../../public/images/logo.png";

/**
 * Cinematic Hero Sequence:
 * 1. Fullscreen isolated preloader video plays first 5 seconds with scroll locked.
 * 2. Reveals full-screen `beforehero.jpg`.
 * 3. On scroll, ultra-smooth fluid zoom directly into the center of the right eye lens (70% 48%).
 * 4. Reveals `herobg.png` fitted cleanly across the screen.
 * 5. `logo.png` glides in from the TOP, and Spider-Verse yellow CTA box glides in from the BOTTOM smoothly.
 * 6. Uses native CSS sticky pinning to guarantee zero DOM reparenting or hydration conflicts.
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

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });

        // 1. Zoom into right eye lens (anchored at 70% 48%)
        tl.to(
          heroImageRef.current,
          {
            scale: 36,
            ease: "power2.inOut",
            duration: 0.32,
          },
          0,
        );

        // 2. Early reveal of hero background: dissolves beforehero as zoom begins
        tl.to(
          heroImageRef.current,
          {
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.16,
          },
          0.14,
        );

        // 3. Fade out corner chrome during initial zoom
        tl.to(
          ".hero-chrome",
          {
            opacity: 0,
            ease: "power1.out",
            duration: 0.10,
          },
          0.04,
        );

        // 4. Logo fades and glides down from the TOP with buttery smooth ease
        tl.fromTo(
          logoRef.current,
          {
            opacity: 0,
            y: -60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.24,
          },
          0.22,
        );

        // 5. CTA fades and glides up from the BOTTOM smoothly
        tl.fromTo(
          ctaRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.24,
          },
          0.26,
        );

        // 6. Snappy Hold: comfortable pause on hero before quickly scrolling to next section
        tl.to({}, { duration: 0.38 }, 0.50);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] w-full bg-black"
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
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black halftone">
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

        {/* Layer 1: logo.png (Fades in from top, positioned lower into hero focal area) */}
        <div
          ref={logoRef}
          className="pointer-events-none absolute inset-x-0 top-[18vh] z-10 flex justify-center opacity-0 sm:top-[22vh] md:top-[25vh] transform-gpu will-change-transform"
        >
          <div className="relative flex max-h-[46vh] w-[min(92vw,780px)] items-center justify-center">
            <Image
              src={logoImg}
              alt="Bit N Build Logo"
              priority
              className="h-auto w-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* Layer 2: Spider-Verse Yellow Dialogue Box CTA (Moved higher upwards) */}
        <div
          ref={ctaRef}
          className="pointer-events-none absolute inset-x-0 bottom-[18vh] z-10 flex justify-center opacity-0 sm:bottom-[22vh] md:bottom-[25vh] lg:bottom-[26vh] transform-gpu will-change-transform"
        >
          <div className="pointer-events-auto">
            <a
              href="https://unstop.com/hackathons/bit-n-build-around-the-world-2026-fr-conceicao-rodrigues-college-of-engineering-frcrce-bandra-1743581"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 -rotate-1 border-[2.5px] border-black bg-[#FFE600] px-7 py-3 font-mono text-sm font-black uppercase tracking-wider text-black shadow-[5px_5px_0px_#000000] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:rotate-0 hover:bg-[#FFF033] hover:shadow-[7px_7px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000000] md:px-9 md:py-3.5 md:text-base"
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

        {/* Layer 3: beforehero.jpg (Zooms directly into eye) */}
        <div
          ref={heroImageRef}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full origin-[70%_48%] transform-gpu will-change-transform"
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

        {/* Hero Chrome */}
        <div className="hero-chrome pointer-events-none absolute inset-0 z-40 flex items-start justify-between p-6 transition-opacity duration-700 md:p-10">
          <span className="eyebrow">Google Developer Groups</span>
          <span className="eyebrow hidden sm:block">Ed. 2026</span>
        </div>
      </div>
    </section>
  );
}

