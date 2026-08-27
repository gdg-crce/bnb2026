"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import sponsorsBg from "../../public/images/sponsors-bg.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const PLATINUM_SPONSORS = [
  { name: "Google Cloud", tier: "CLOUD ALLY", role: "Infrastructure & Vertex AI Credits", accent: "#FFE600" },
  { name: "GitHub", tier: "DEV PLATFORM", role: "Developer Tools & Copilot Access", accent: "#22b6d6" },
  { name: "Devfolio", tier: "PORTAL PARTNER", role: "Hackathon Management & Judging Engine", accent: "#e5308c" },
  { name: "Polygon", tier: "WEB3 ALLY", role: "Decentralized Track & Ecosystem Grants", accent: "#8fc63d" },
];

const GOLD_SPONSORS = [
  { name: "Postman", role: "API Testing & Workspaces", tag: "APIs" },
  { name: "MongoDB", role: "Atlas Cloud Database & Vector Search", tag: "DATA" },
  { name: "Vercel", role: "Frontend Cloud & Edge Deployment", tag: "DEPLOY" },
  { name: "JetBrains", role: "All Products IDE Pack Licenses", tag: "TOOLING" },
  { name: "Streamlit", role: "Rapid Python ML Interface Framework", tag: "AI/ML" },
  { name: "Auth0", role: "Universal Authentication & Security", tag: "AUTH" },
];

const COMMUNITY_PARTNERS = [
  "GDG On Campus CRCE",
  "Google Developer Student Clubs India",
  "Mumbai Tech Community",
  "Open Source Guild",
  "DevsUnite Global",
  "Web3 Multiverse Society",
];

export default function SponsorsSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the sponsors backdrop
        gsap.fromTo(
          ".sponsors-backdrop",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Chromatic split on header
        gsap.fromTo(
          ".sponsors-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".sponsors-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".sponsors-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".sponsors-mark", start: "top 84%" },
        });

        gsap.from(".sponsors-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".sponsors-mark", start: "top 84%" },
        });

        // Sponsor cards animation
        gsap.from(".sponsor-tile", {
          opacity: 0,
          scale: 0.94,
          y: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sponsors-container", start: "top 82%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="sponsors"
      ref={root}
      className="halftone relative z-10 overflow-hidden bg-void px-6 py-28 md:px-10 md:py-36"
    >
      {/* Real Spider-Society Lab Holographic Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="sponsors-backdrop absolute -top-[10%] -left-[5%] h-[120%] w-[110%]">
          <Image
            src={sponsorsBg}
            alt="Spider-Society Tech Lab Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-30 brightness-90 contrast-125"
          />
        </div>
        {/* Scrim blending into void */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="sponsors-mark relative mb-20 flex flex-col items-start md:mb-24">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#22b6d6] shadow-[0_0_10px_#22b6d6]" />
            <span className="eyebrow text-[#22b6d6]">Spider-Society // Allies & Sponsors</span>
          </div>

          <div className="relative mt-4">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`sponsors-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              Sponsors
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`sponsors-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              Sponsors
            </span>
            {/* Front Face */}
            <h2
              className={`sponsors-mark-face display relative text-paper ${MARK_SIZE}`}
            >
              Sponsors
            </h2>
          </div>

          <p className="sponsors-lede mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Backed by global technology leaders and developer communities
            powering builders across the multiverse.
          </p>
        </div>

        {/* Sponsors Container */}
        <div className="sponsors-container space-y-16 md:space-y-20">
          {/* Platinum / Tier 1 Partners */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFE600]">
                // Key Allies & Platinum Partners
              </span>
              <span className="h-px flex-1 bg-paper/10" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PLATINUM_SPONSORS.map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="sponsor-tile group relative flex flex-col justify-between rounded-xl border-2 border-paper/20 bg-ink/90 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-paper/60 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.9)] md:p-8"
                  style={{
                    borderTopColor: sponsor.accent,
                    borderTopWidth: "3.5px",
                  }}
                >
                  <div>
                    <span
                      className="font-mono text-[0.625rem] font-black uppercase tracking-widest"
                      style={{ color: sponsor.accent }}
                    >
                      {sponsor.tier}
                    </span>
                    <h3 className="mt-4 font-mono text-2xl font-black text-paper transition-colors duration-200 group-hover:text-white">
                      {sponsor.name}
                    </h3>
                  </div>
                  <p className="mt-6 border-t border-paper/10 pt-4 text-xs font-medium text-muted">
                    {sponsor.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Gold / Tier 2 Partners */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#22b6d6]">
                // Platform & Developer Tooling
              </span>
              <span className="h-px flex-1 bg-paper/10" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {GOLD_SPONSORS.map((sponsor) => (
                <div
                  key={sponsor.name}
                  className="sponsor-tile group relative flex items-center justify-between rounded-lg border border-paper/15 bg-ink/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#22b6d6] hover:bg-ink"
                >
                  <div>
                    <span className="font-mono text-lg font-bold text-paper transition-colors group-hover:text-white">
                      {sponsor.name}
                    </span>
                    <p className="text-xs text-muted">{sponsor.role}</p>
                  </div>
                  <span className="rounded bg-paper/5 px-2 py-0.5 font-mono text-[0.625rem] text-[#22b6d6]">
                    {sponsor.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Community & Ecosystem */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                // Community & Ecosystem Networks
              </span>
              <span className="h-px flex-1 bg-paper/10" />
            </div>

            <div className="flex flex-wrap gap-3">
              {COMMUNITY_PARTNERS.map((partner) => (
                <span
                  key={partner}
                  className="sponsor-tile inline-flex items-center rounded border border-paper/15 bg-paper/5 px-4 py-2 font-mono text-xs font-medium text-paper/90 backdrop-blur-sm transition-colors hover:border-paper/40 hover:text-white"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Sponsor Prospectus CTA Banner */}
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-paper/25 bg-ink/70 p-8 text-center backdrop-blur-md md:p-12">
            <div className="relative z-10 mx-auto max-w-xl">
              <span className="eyebrow text-[0.6875rem] text-[#FFE600]">
                Partnership Opportunities
              </span>
              <h3 className="mt-3 text-2xl font-bold text-paper md:text-3xl">
                Empower 500+ Top Developers Worldwide
              </h3>
              <p className="mt-3 text-sm text-muted">
                Support hackathon tracks, mentor top engineering talent, and
                showcase your APIs and developer tools to the global community.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:gdg@frcrce.ac.in?subject=Bit%20N%20Build%202026%20Sponsorship"
                  className="inline-flex items-center gap-2 border-[2.5px] border-black bg-[#FFE600] px-6 py-2.5 font-mono text-sm font-black uppercase text-black shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5"
                >
                  <span>SPONSOR THE HACKATHON</span>
                  <span>➔</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
