"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const SponsorCard = ({ sponsor, className = "h-32 sm:h-36", tileClass = "prev-sponsor-tile" }: any) => (
  <div className={`${tileClass} group relative p-1 bg-[#100e18]/85 rounded-2xl border-2 border-red-500/30 hover:border-[#22b6d6] transform-gpu transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,182,214,0.35)] hover:-translate-y-1.5 opacity-0 translate-y-8 will-change-transform`}>
    <div className={`relative w-full ${className} bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 transform-gpu`}>
      <Image
        src={sponsor.image}
        alt={sponsor.name}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-contain transition-transform duration-300 ease-out drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:saturate-125 group-hover:brightness-110 ${
          sponsor.invert ? "filter invert" : ""
        }`}
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/200x100/1a1a1a/ffffff?text=${sponsor.name.replace(
            /\s+/g,
            "+"
          )}`;
          e.currentTarget.onerror = null;
        }}
      />
      {/* Spiderverse Glitch / Glow overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#22b6d6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Shimmer sweep */}
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-700 ease-out"></div>
    </div>
  </div>
);

const SectionTitle = ({ children, className = "" }: any) => (
  <h3 className={`section-title mb-6 text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-wider opacity-0 translate-y-6 ${className}`}>
    {children}
  </h3>
);

export default function SponsorsSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
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

        // Subsection titles animation
        gsap.to(".section-title", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        });

        // Previous Sponsor cards animation
        gsap.to(".prev-sponsor-tile", {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.7,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".prev-sponsors-container",
            start: "top 80%",
          },
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  const prevSponsors = [
    { name: "IDFC First Bank", image: "/sponsors/idfc.png" },
    { name: "Unstop", image: "/sponsors/unstop.png" },
    { name: "Red Bull", image: "/sponsors/red-bull.png" },
    { name: "Bassein Catholic Bank", image: "/sponsors/Bassein-catholic-bank.png" },
    { name: "Postman", image: "/sponsors/postman.jpg" },
    { name: "GeeksforGeeks", image: "/sponsors/gfg.jpg" },
    { name: "NordVPN", image: "/sponsors/nordvpn.png" },
    { name: "QuillBot", image: "/sponsors/quilbot.png" },
    { name: ".XYZ", image: "/sponsors/xyz.png" },
    { name: "Ethereum", image: "/sponsors/eth.png" },
    { name: "Mehr", image: "/sponsors/mehr.PNG" },
    { name: "Ezpac", image: "/sponsors/ezpac.png" },
    { name: "Klaw Chips", image: "/sponsors/klaw-chips.png" },
    { name: "Interview Buddy", image: "/sponsors/interview-buddy.png" },
    { name: "Imagicaa", image: "/sponsors/imagicaa.png" },
    { name: "Davat Beverages", image: "/sponsors/davat-beverages.png" },
    { name: "Jimmy's Beverages", image: "/sponsors/jimmys-beverages.png" },
    { name: "Kitabby", image: "/sponsors/kitabby.png" },
    { name: "JDoodle", image: "/sponsors/jdoodle.png" },
    { name: "Give My Certificate", image: "/sponsors/gmc.png" },
    { name: "Flatlogic", image: "/sponsors/flatlogic.png" },
    { name: "368", image: "/sponsors/368.png" },
    { name: "Edusphere", image: "/sponsors/edussphere.png" },
    { name: "No Escape", image: "/sponsors/noescape.jpg" },
    { name: "Image Master", image: "/sponsors/image-master.png" },
    { name: "Cruising Cuisine", image: "/sponsors/cruising-cuisine.png" },
    { name: "Pop Potion", image: "/sponsors/pop potion.png" },
    { name: "Startup News FYI", image: "/sponsors/startup-news-fyi.png" },
    { name: "Simply Gaming", image: "/sponsors/simplygameing.png" },
    { name: "Ettara", image: "/sponsors/ettara.png" },
  ];

  return (
    <section
      id="sponsors"
      ref={root}
      className="relative z-10 overflow-x-clip bg-black py-24 md:py-36 px-6"
    >

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Section Header with Chromatic Split Typography */}
        <div className="sponsors-mark relative mb-16 flex flex-col items-start md:mb-20">
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
            Backed by global technology leaders and developer communities powering builders across the multiverse.
          </p>
        </div>

        {/* --- Previous Years Sponsors --- */}
        <div className="prev-sponsors-container">
          <div className="text-left mb-10">
            <SectionTitle className="text-paper">
              <span className="text-[#22b6d6] mr-2 font-mono">⚡</span>
              PREVIOUS SPONSORS
            </SectionTitle>
            <div className="h-0.5 w-24 bg-[#22b6d6]/40 rounded-full mt-2 mb-8"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {prevSponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                tileClass="prev-sponsor-tile"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
