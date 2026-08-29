"use client";

import Image from "next/image";
import Countdown from "@/components/countdown";
import pipemImg from "../../public/pipem.png";

/**
 * Pipes Transition Section:
 * Full-vibrant undimmed pipem.png connecting Hero to About,
 * with the bitNbuild countdown timer centered cleanly on top.
 */
export default function PipesSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-black flex flex-col items-center justify-center py-12 md:py-20">
      <h2 className="sr-only">Countdown & Conduit Transition</h2>

      {/* Pipem Background — placed as-is, no filters */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src={pipemImg}
          alt="Multiverse Conduit Pipes Transition"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      {/* Countdown Timer Centered On Top */}
      <div className="relative z-10 w-full px-6 md:px-10 pointer-events-auto">
        <Countdown />
      </div>
    </section>
  );
}
