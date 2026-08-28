"use client";

import Image from "next/image";
import Countdown from "@/components/countdown";
import pipesImg from "../../public/images/pipes.png";

/**
 * Pipes Transition Section:
 * Full-vibrant undimmed pipes.png connecting Hero to About,
 * with the bitNbuild countdown timer centered cleanly on top.
 * Features a feathered mask gradient to blend smoothly into adjacent black sections.
 */
export default function PipesSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-black flex flex-col items-center justify-center py-12 md:py-20">
      <h2 className="sr-only">Countdown & Conduit Transition</h2>

      {/* Vibrant High-Brightness Conduit Pipes Background */}
      <div 
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <Image
          src={pipesImg}
          alt="Multiverse Conduit Pipes Transition"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-bottom brightness-[1.5] contrast-[1.15] saturate-[1.3]"
        />
        {/* Soft electrical conduit ambience */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 mix-blend-screen" />
      </div>

      {/* Countdown Timer Centered On Top */}
      <div className="relative z-10 w-full px-6 md:px-10 pointer-events-auto">
        <Countdown />
      </div>
    </section>
  );
}
