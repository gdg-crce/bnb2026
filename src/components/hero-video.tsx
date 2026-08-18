"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import lastFrame from "../../public/images/hero-last.jpg";

/**
 * Seconds into the intro at which the logo card cuts to the skyline. Measured
 * off the file: mean frame brightness jumps from 5 to 32 at frame 60 of 377.
 * Before it, the frame is black and so is anything left over around a
 * letterboxed frame; after it, that gap has to be filled.
 */
const SCENE_STARTS_AT = 2;

/**
 * The landing stage. The intro plays through once and then holds on its final
 * frame — the title card — which is where the page settles, rather than a loop
 * the eye keeps getting dragged back to.
 *
 * It is `sticky`, not just tall: the section below scrolls up over it and
 * dissolves the mural in on top, so this frame has to stay on screen for the
 * whole transition instead of scrolling away.
 *
 * The hold is belt-and-braces. `ended` pauses the element (browsers already
 * park on the last decoded frame, but a few blank it) and a still of that exact
 * frame fades in over the top. Because the still *is* the last frame, the swap
 * is invisible — it just guarantees something is on screen when playback never
 * started, which is what happens when a browser refuses to autoplay.
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [held, setHeld] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hold = () => {
      video.pause();
      setHeld(true);
      setLit(true);
    };

    // Only relevant where the frame is letterboxed; on a landscape display the
    // bed is display:none and this just flips a class nothing reads.
    const light = () => {
      if (video.currentTime < SCENE_STARTS_AT) return;
      setLit(true);
      video.removeEventListener("timeupdate", light);
    };

    video.addEventListener("ended", hold);
    video.addEventListener("timeupdate", light);
    // Autoplay can be refused (low power mode, a data-saver setting). The
    // rejection is expected, not an error — fall through to the still.
    video.play().catch(() => setHeld(true));

    return () => {
      video.removeEventListener("ended", hold);
      video.removeEventListener("timeupdate", light);
    };
  }, []);

  // The section below dissolves in over this one while it is still on screen,
  // so the corner labels would otherwise sit half-visible under the mural for
  // most of the transition. Retire them before the blend starts.
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-chrome", {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  const heldOpacity = held ? "opacity-100" : "opacity-0";

  return (
    <section
      ref={sectionRef}
      className="halftone sticky top-0 h-stage w-full overflow-hidden bg-void"
    >
      <h1 className="sr-only">bitNbuild</h1>

      {/* Ambient bed. Black through the intro, which is itself on black. */}
      <Image
        src={lastFrame}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        loading="eager"
        className={`film-bed transition-opacity duration-[1200ms] ${
          lit ? "opacity-100" : "opacity-0"
        }`}
      />

      <video
        ref={videoRef}
        className="film-frame"
        src="/1.mp4"
        poster="/images/hero-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <Image
        src={lastFrame}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        // Eager, despite being invisible for the first twelve seconds: it has
        // to be decoded and ready the instant the video hands over to it.
        loading="eager"
        className={`film-frame transition-opacity duration-300 ${heldOpacity}`}
      />

      {/* Just enough to seat the corner labels — light enough that it never
          dulls the title card underneath. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/45 via-transparent to-void/60" />

      <div className="hero-chrome pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between">
          <span className="eyebrow">Google Developer Groups</span>
          <span className="eyebrow hidden sm:block">Ed. 2026</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="eyebrow">Scroll</span>
          <span className="relative h-10 w-px bg-paper/15">
            <span className="scroll-cue-line absolute inset-0 block bg-red" />
          </span>
        </div>
      </div>
    </section>
  );
}
