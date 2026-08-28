"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const SponsorCard = ({ sponsor, className = "h-32 sm:h-36", tileClass = "sponsor-tile" }: any) => (
  <div className={`${tileClass} group relative p-1 bg-white/5 backdrop-blur-md rounded-2xl border-2 border-red-500/30 hover:border-[#22b6d6] transform-gpu transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,182,214,0.35)] hover:-translate-y-1.5 opacity-0 translate-y-8`}>
    <div className={`relative w-full ${className} bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-4 transform-gpu`}>
      <Image
        src={sponsor.image}
        alt={sponsor.name}
        fill
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
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#22b6d6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {/* Shimmer sweep */}
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-700 ease-out"></div>
    </div>
  </div>
);

const SectionTitle = ({ children, className = "" }: any) => (
  <h3 className={`section-title mb-6 text-2xl md:text-3xl font-bold font-mono tracking-wider opacity-0 translate-y-6 ${className}`}>
    {children}
  </h3>
);

export default function SponsorsSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Titles animation
      gsap.to(".section-title", {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });

      gsap.to(".sponsor-tile", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        },
      });
      
      gsap.to(".prev-sponsor-tile", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".prev-sponsors-container",
          start: "top 80%",
        },
      });
    },
    { scope: root }
  );

  const titleSponsors = {name: "IDFC First Bank", image: "/sponsors/idfc.png"}
  const poweredBySponsor = { name: "Unstop", image: "/sponsors/unstop.png" };

  const currentSponsors = [
    { name: "Mehr", image: "/sponsors/mehr.png" },
    { name: "Ezpac", image: "/sponsors/ezpac.png" },
    { name: "Unstop", image: "/sponsors/unstop.png" },
    { name: "Klaw Chips", image: "/sponsors/klaw-chips.png" },
    { name: "Interview Buddy", image: "/sponsors/interview-buddy.png" },
    { name: "Davat Beverages", image: "/sponsors/davat-beverages.png" },
    { name: "Jimmy's Beverages", image: "/sponsors/jimmys-beverages.png" },
    { name: "Kitabby", image: "/sponsors/kitabby.png" },
    { name: "NordVPN", image: "/sponsors/nordvpn.png" },
    { name: "Image Master", image: "/sponsors/image-master.png" },
    { name: "Imagicaa", image: "/sponsors/imagicaa.png" },
    { name: "Startup News FYI", image: "/sponsors/startup-news-fyi.png" },
    { name: "Cruising Cuisine", image: "/sponsors/cruising-cuisine.png" },
  ];

  const prevSponsors = [
    {
      name: "Bassein Catholic Bank",
      image: "/sponsors/Bassein-catholic-bank.png",
    },
    { name: "Unstop", image: "/sponsors/unstop.png" },
    { name: "RedBull", image: "/sponsors/red-bull.png" },
    { name: "368", image: "/sponsors/368.png" },
    { name: "Edusphere", image: "/sponsors/edussphere.png" },
    { name: "GeeksforGeeks", image: "/sponsors/gfg.jpg" },
    { name: "JDoodle", image: "/sponsors/jdoodle.png" },
    { name: "Give My Certificate", image: "/sponsors/gmc.png" },
    { name: "noescape", image: "/sponsors/noescape.jpg" },
    { name: "Postman", image: "/sponsors/postman.jpg" },
    { name: "Simply Gaming", image: "/sponsors/simplygameing.png" },
    { name: "Startup News", image: "/sponsors/startup-news.png" },
    { name: "Flatlogic", image: "/sponsors/flatlogic.png" },
    { name: "Ettara", image: "/sponsors/ettara.png" },
    { name: "XYZ", image: "/sponsors/xyz.png" },
    { name: "Quilbot", image: "/sponsors/quilbot.png" },
  ];

  return (
    <section
      id="sponsors"
      ref={root}
      className="relative py-20 md:py-32 z-10 overflow-hidden bg-void"
    >
      {/* Spiderverse Theme Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                #020617 0%,
                #0f172a 25%,
                #4c0519 60%,
                #7f1d1d 85%,
                #000000 100%
              )
            `,
          }}
        />

        {/* Smooth transition overlays */}
        <div
          className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom,
              #020617 0%,
              rgba(2, 6, 23, 0.9) 25%,
              rgba(2, 6, 23, 0.7) 50%,
              rgba(2, 6, 23, 0.5) 75%,
              transparent 100%
            )`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top,
              #000000 0%,
              rgba(0, 0, 0, 0.9) 25%,
              rgba(0, 0, 0, 0.7) 50%,
              rgba(0, 0, 0, 0.5) 75%,
              transparent 100%
            )`,
          }}
        />

        {/* Halftone / Spiderverse Texture Pattern */}
        <div className="absolute inset-0 opacity-[0.15] halftone mix-blend-screen pointer-events-none"></div>

        {/* Subtle Radial Glows for Spiderverse Vibe */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.2)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,182,214,0.15)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,transparent_100%)] pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 section-title opacity-0 translate-y-6">
          <h2 className="text-4xl md:text-5xl font-black font-mono tracking-tighter uppercase mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">Our</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22b6d6] to-cyan-400 drop-shadow-[0_0_15px_rgba(34,182,214,0.5)]"> Sponsors</span>
          </h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-[#22b6d6] via-red-500 to-red-600 mx-auto rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
        </div>

        {/* --- Current Sponsors --- */}
        <div className="space-y-16">
          
          <div className="text-center">
            <SectionTitle className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
              <span className="mr-2 text-3xl">⭐</span>
              TITLE SPONSOR
            </SectionTitle>
            <div className="max-w-md mx-auto">
              <SponsorCard
                sponsor={titleSponsors}
                className="h-40 sm:h-48"
              />
            </div>
          </div>

          {/* Powered By Section */}
          <div className="text-center">
            <SectionTitle className="text-[#22b6d6] drop-shadow-[0_0_8px_rgba(34,182,214,0.4)]">
              <span className="mr-2 text-3xl">⚡</span>
              POWERED BY
            </SectionTitle>
            <div className="max-w-md mx-auto">
              <SponsorCard
                sponsor={poweredBySponsor}
                className="h-40 sm:h-48"
              />
            </div>
          </div>

          {/* Current Sponsors Section */}
          <div className="text-center">
            <SectionTitle className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              <span className="text-[#22b6d6] mr-2">🤝</span> 
              CURRENT SPONSORS
            </SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {currentSponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.name}
                  sponsor={sponsor}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- Previous Sponsors --- */}
        <div className="mt-24 md:mt-32 prev-sponsors-container">
          <div className="max-w-4xl mx-auto text-center mb-12 section-title opacity-0 translate-y-6">
            <h2 className="text-3xl md:text-4xl font-black font-mono tracking-tighter uppercase mb-4">
              <span className="text-paper">Previous</span>
              <span className="text-paper"> Sponsors</span>
            </h2>
            <div className="h-1 w-24 bg-paper/20 mx-auto rounded-full"></div>
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
