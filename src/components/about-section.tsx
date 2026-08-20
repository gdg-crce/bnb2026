"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import Countdown from "@/components/countdown";
import aboutImage from "../../public/images/about.png";
import worldMap from "../../public/images/worldmap.webp";

/*
 * Wordmark size, shared by the face and both ghosts. They are absolutely
 * positioned copies of the same two words, so the moment the three disagree
 * the misregistration stops being an effect and becomes a bug. It has to hold
 * "About Us" on one line inside half a column, which is why it is smaller here
 * than it would be running the full width.
 */
const MARK_SIZE =
  "text-[clamp(3rem,13vw,4.5rem)] md:text-[clamp(3rem,7vw,6rem)]";

/**
 * Everything below the fold. It scrolls up over the sticky hero, and its own
 * leading edge is masked from transparent to opaque across the first ~95vh —
 * so for that whole band the mural and the held title card share the same
 * pixels, and the dissolve line travels up the screen as you scroll. The
 * countdown sits inside that band, where the two pictures are still mixing.
 *
 * Below it the section splits down the middle: the map holds one half and the
 * copy the other.
 */
export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the mural — 8% of its own height across the section.
        // yPercent only, so it never touches layout.
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

        gsap.from(".countdown", {
          opacity: 0,
          y: 44,
          duration: 1.2,
          scrollTrigger: { trigger: ".countdown", start: "top 88%" },
        });

        // Chromatic split on the wordmark: the intro's own glitch language,
        // used once. The red and warm ghosts converge as it settles and stop
        // just short of alignment, leaving the sliver of misregistration you
        // get off a cheap four-colour press. Then they never move again.
        gsap.fromTo(
          ".about-ghost",
          { xPercent: (i: number) => (i === 0 ? -4 : 4), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.45 : 0.45),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".about-mark", start: "top 82%" },
          },
        );

        const split = new SplitText(".about-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.045,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".about-mark", start: "top 82%" },
        });

        gsap.from(".about-copy > *", {
          opacity: 0,
          y: 28,
          stagger: 0.12,
          duration: 0.9,
          scrollTrigger: { trigger: ".about-copy", start: "top 85%" },
        });

        // The map settles in place rather than sliding in from the side: it is
        // the other half of the spread, not an object entering it.
        gsap.from(".about-map", {
          opacity: 0,
          scale: 0.96,
          duration: 1.3,
          scrollTrigger: { trigger: ".about-map", start: "top 85%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="halftone relative z-10 overflow-hidden">
      {/* The mural and its scrim fade in together as one picture. */}
      <div className="blend-mask absolute inset-0 -z-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={aboutImage}
            alt=""
            aria-hidden="true"
            placeholder="blur"
            sizes="100vw"
            className="about-backdrop h-[112%] w-full object-cover"
          />
        </div>
        <div className="about-scrim absolute inset-0" />
      </div>

      {/* Colour bridge across the overlap only. */}
      <div className="blend-mask blend-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-[95vh]" />

      <div className="flex min-h-[120svh] flex-col justify-end px-6 pb-[26svh] md:px-10">
        <Countdown />
      </div>

      <div className="relative px-6 pb-32 md:px-10 md:pb-44">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.4fr_1fr] md:gap-12 lg:gap-16">
          {/* The map takes the larger share of the split — seven columns to
              the copy's five. It is the thing worth looking at, and at an even
              50/50 it read as an inset rather than as half the spread. Not
              wider than this, though: the source is 778px across, so past
              roughly 700 on screen it starts to go soft on a retina display.

              It also runs out past its column into the page margin, which is
              where the rest of the width came from — the copy could not give
              any up, because the wordmark is set to stay on one line and its
              own width is what holds that column open.

              On a phone there is no share to take, so it drops below the copy
              rather than shrinking into a thumbnail nobody can read. */}
          <div className="about-map order-2 md:order-1 md:-ml-12 md:w-[calc(100%+3rem)] lg:-ml-16 lg:w-[calc(100%+4rem)]">
            <Image
              src={worldMap}
              alt="A dotted world map marking the cities bitNbuild runs in, with a callout on India."
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="about-mark relative">
              {/* Decorative misregistration; only the face is read. */}
              <span
                aria-hidden="true"
                className={`about-ghost display absolute inset-0 whitespace-nowrap text-red/40 mix-blend-screen ${MARK_SIZE}`}
              >
                About Us
              </span>
              <span
                aria-hidden="true"
                className={`about-ghost display absolute inset-0 whitespace-nowrap text-sand/30 mix-blend-screen ${MARK_SIZE}`}
              >
                About Us
              </span>
              <h2
                className={`about-mark-face display relative whitespace-nowrap text-paper ${MARK_SIZE}`}
              >
                About Us
              </h2>
            </div>

            <div className="about-copy mt-10 flex flex-col gap-8 md:mt-12">
              <p className="text-xl leading-relaxed text-paper/90 md:text-[1.625rem] md:leading-[1.45]">
                bitNbuild is a 50-hour build run by Google Developer Groups. One
                room, one clock, and whatever you can ship before it runs out.
              </p>

              <p className="max-w-xl leading-relaxed text-muted">
                Teams of up to four. Bring an idea or find one here. Mentors
                from across the community sit in through the night, and
                everything made over the weekend is demoed on stage at the end
                of it.
              </p>

              <div>
                <div className="hairline max-w-xs" />
                <dl className="grid grid-cols-3 gap-6 pt-8">
                  {[
                    ["50", "Hours"],
                    ["4", "Per team"],
                    ["1", "Weekend"],
                  ].map(([value, label]) => (
                    <div key={label} className="flex flex-col gap-2">
                      <dt className="font-mono text-3xl leading-none text-paper md:text-4xl">
                        {value}
                      </dt>
                      <dd className="eyebrow text-[0.5625rem]">{label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
