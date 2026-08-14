"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const panels = [
  { title: "Smooth scroll", body: "Lenis drives the page from GSAP's ticker." },
  { title: "ScrollTrigger", body: "Every reveal below is a scrubbed trigger." },
  { title: "Ready to build", body: "Delete this file and start the real work." },
];

export default function ScrollDemo() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-line", {
        yPercent: 120,
        stagger: 0.08,
        duration: 1.2,
      });

      // Animate transform + opacity only. Anything that touches layout
      // (width, top, margin) forces a reflow every frame and will stutter no
      // matter how well Lenis is tuned.
      gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
        gsap.from(panel, {
          opacity: 0,
          y: 60,
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            end: "top 45%",
            // `scrub: 1` eases 1s behind the scrollbar. `scrub: true` is
            // pinned exactly to it, which looks mechanical next to Lenis.
            scrub: 1,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="flex h-screen flex-col justify-center px-8">
        <h1 className="text-6xl font-semibold tracking-tight md:text-8xl">
          <span className="block overflow-hidden">
            <span className="hero-line block">bitNbuild</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block text-muted">scroll down</span>
          </span>
        </h1>
      </section>

      {panels.map((panel) => (
        <section
          key={panel.title}
          className="panel flex h-screen flex-col justify-center px-8"
        >
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
            {panel.title}
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">{panel.body}</p>
        </section>
      ))}
    </div>
  );
}
