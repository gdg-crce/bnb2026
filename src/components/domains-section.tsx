"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { CORNER_SPANS, CORNER_SPOKES, CORNER_VIEW_BOX } from "@/lib/corner-web";
import { ChainGlyph, NeuralGlyph, WebGlyph } from "@/components/domain-glyphs";
import domainsImage from "../../public/images/domains.png";

/*
 * The floor matters more than the ceiling. "Domains" is set nowrap, so the
 * clamp's minimum is what decides whether the last letter survives on the
 * narrowest phone: the word measures about 4.83× its font size, and 320px
 * less the 3rem of gutter leaves 272 — which a 3.5rem floor fills to within
 * a pixel. That is close enough that a different font build tips it over the
 * edge and into the section's own overflow, so the floor is 3rem and the
 * 16vw preferred size is what actually runs on anything larger.
 */
const MARK_SIZE =
  "text-[clamp(3rem,16vw,5.5rem)] md:text-[clamp(4rem,9vw,8rem)]";

/*
 * The three tracks.
 *
 * `accent` is sampled off the wall in domains.png rather than picked from a
 * palette: the magenta of the throw-up in the top-left, the cyan of the piece
 * in the top-right, the acid lime scattered through both bands. One hue per
 * panel, used for that panel's bloom, top edge, glyph tile and ghost — enough
 * to tell three identical cards apart without turning the page into a rainbow.
 *
 * The blurbs are deliberately within a few characters of each other. The cards
 * are the same height regardless, but three paragraphs of wildly different
 * length inside three identical boxes is what makes a row look untidy even
 * when it is perfectly aligned.
 */
const DOMAINS = [
  {
    index: "01",
    title: "Web & App",
    accent: "#e5308c",
    Glyph: WebGlyph,
    blurb:
      "Something a stranger can open and understand in ten seconds. Web, mobile, or both — the interface is the product.",
    tags: ["Next.js", "Flutter", "Realtime", "APIs"],
  },
  {
    index: "02",
    title: "Blockchain",
    accent: "#22b6d6",
    Glyph: ChainGlyph,
    blurb:
      "Trust built into the thing itself. Contracts, wallets, and the plumbing that decides if anyone outside the demo uses it.",
    tags: ["Solidity", "Contracts", "Wallets", "DeFi"],
  },
  {
    index: "03",
    title: "AI & ML",
    accent: "#8fc63d",
    Glyph: NeuralGlyph,
    blurb:
      "A model that earns what it costs to run. Train one, fine-tune one, or wire one into something measurably better for it.",
    tags: ["LLMs", "Vision", "RAG", "Agents"],
  },
];

/**
 * Domains.
 *
 * Sits on its own photograph of a graffiti wall, scrimmed back to the middle
 * of the value range — see `.domains-scrim` in globals.css for how the stops
 * are matched to the picture's own bands. It returns to void at both ends, so
 * it follows About Us without a seam and hands the next section black.
 */
export default function DomainsSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the wall — 8% of its own height across the section,
        // the same treatment the mural gets in About. yPercent only, so it
        // never touches layout.
        gsap.fromTo(
          ".domains-backdrop",
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

        // Same chromatic split as the About wordmark, so the two headings are
        // recognisably the same object. The ghosts converge and stop just shy
        // of alignment, then never move again.
        gsap.fromTo(
          ".domains-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".domains-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".domains-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.045,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".domains-mark", start: "top 84%" },
        });

        gsap.from(".domains-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".domains-mark", start: "top 84%" },
        });

        // Panels deal in like cards. Now that they are all the same size and
        // on the same line, the stagger is the only thing left saying they are
        // an ordered set — 01, 02, 03 — rather than three things at once.
        gsap.from(".domain-card", {
          opacity: 0,
          y: 48,
          stagger: 0.14,
          duration: 1.1,
          scrollTrigger: { trigger: ".domains-grid", start: "top 82%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="domains"
      ref={root}
      className="halftone relative z-10 overflow-hidden px-6 pt-32 pb-32 md:px-10 md:pt-44 md:pb-44"
    >
      {/* The wall. 112% tall so the parallax has somewhere to travel without
          ever exposing an edge. */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={domainsImage}
          alt=""
          aria-hidden="true"
          placeholder="blur"
          sizes="100vw"
          className="domains-backdrop h-[112%] w-full object-cover"
        />
      </div>
      <div className="domains-scrim absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Three tracks</p>

        <div className="domains-mark relative mt-6">
          {/* Decorative misregistration; only the face is read. */}
          <span
            aria-hidden="true"
            className={`domains-ghost display absolute inset-0 whitespace-nowrap text-red/40 mix-blend-screen ${MARK_SIZE}`}
          >
            Domains
          </span>
          <span
            aria-hidden="true"
            className={`domains-ghost display absolute inset-0 whitespace-nowrap text-sand/30 mix-blend-screen ${MARK_SIZE}`}
          >
            Domains
          </span>
          <h2
            className={`domains-mark-face display relative whitespace-nowrap text-paper ${MARK_SIZE}`}
          >
            Domains
          </h2>
        </div>

        <p className="domains-lede mt-8 max-w-xl text-lg leading-relaxed text-paper/85 md:text-xl">
          Pick the one your idea already belongs to. Judging happens inside the
          track, so you are only ever measured against people who took on the
          same kind of problem you did.
        </p>

        {/* `items-stretch` is the grid default and is what equalises the three
            heights; every card then runs `h-full` so the panel fills the cell
            it was given rather than shrinking to its own copy. */}
        <ul className="domains-grid mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {DOMAINS.map(({ index, title, accent, Glyph, blurb, tags }) => (
            <li key={title} className="domain-card h-full">
              <article
                className="domain-panel halftone flex h-full flex-col overflow-hidden p-8"
                style={{ ["--accent" as string]: accent }}
              >
                {/*
                  Quarter web, strung on hover. It sits under the content and
                  is fully dashed out at rest, so it costs the resting state
                  nothing and arrives only when the panel is addressed.
                */}
                <svg
                  viewBox={CORNER_VIEW_BOX}
                  aria-hidden="true"
                  focusable="false"
                  preserveAspectRatio="none"
                  className="domain-web pointer-events-none absolute top-0 right-0 h-32 w-32 text-paper/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                >
                  {CORNER_SPOKES.map((d) => (
                    <path key={d} d={d} pathLength={1} />
                  ))}
                  {CORNER_SPANS.map((d) => (
                    <path key={d} d={d} pathLength={1} />
                  ))}
                </svg>

                {/* Header row: tile left, index right, both on one baseline
                    across all three cards because the tile is a fixed size. */}
                <div className="relative flex items-center justify-between">
                  <span className="domain-tile flex h-16 w-16 shrink-0 items-center justify-center rounded-sm">
                    <Glyph />
                  </span>
                  <span
                    className="font-mono text-2xl leading-none"
                    style={{ color: accent }}
                  >
                    {index}
                  </span>
                </div>

                <div className="domain-rule relative mt-7" />

                {/* Three stacked copies again — the panel's own small echo of
                    the heading, so hovering a card does in miniature what the
                    section did on the way in. */}
                <div className="relative mt-6">
                  <span
                    aria-hidden="true"
                    className="domain-ghost domain-ghost-a display absolute inset-0 text-2xl whitespace-nowrap text-red/70 mix-blend-screen"
                  >
                    {title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="domain-ghost domain-ghost-b display absolute inset-0 text-2xl whitespace-nowrap mix-blend-screen"
                    style={{ color: accent }}
                  >
                    {title}
                  </span>
                  <h3 className="display relative text-2xl whitespace-nowrap text-paper">
                    {title}
                  </h3>
                </div>

                <p className="relative mt-4 leading-relaxed text-paper/75">
                  {blurb}
                </p>

                {/* mt-auto: the tag rows sit on one baseline across the three
                    panels however the blurbs happen to wrap. */}
                <ul className="relative mt-auto flex flex-wrap gap-2 pt-8">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="domain-tag rounded-full px-3 py-1.5 font-mono text-[0.6875rem] tracking-wider text-muted uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
