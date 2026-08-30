"use client";

import { motion } from "framer-motion";
import { Squada_One } from "next/font/google";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

/* ── Main Timeline Section ────────────────────────────────────────────── */
export default function TimelineSection() {
  const events = [
    {
      title: "REGISTRATIONS",
      date: "15TH AUGUST - 25TH SEPTEMBER",
    },
    {
      title: "INTERNAL STATE ROUNDS",
      date: "30TH AUGUST - 28TH SEPTEMBER",
    },
    {
      title: "MAHARASHTRA STATE ROUND",
      date: "3RD OCTOBER - 4TH OCTOBER",
    },
    {
      title: "FINAL ROUND",
      date: "31ST OCTOBER - 1ST NOVEMBER",
    },
    {
      title: "HACKATHON BEGINS",
      date: "31ST OCTOBER - 9:00 AM",
    },
    {
      title: "MENTORING SESSION",
      date: "31ST OCTOBER - 3:00 PM",
    },
    {
      title: "JUDGING ROUNDS 1 & 2",
      date: "31ST OCTOBER - 1ST NOVEMBER",
    },
    {
      title: "HACKATHON ENDS",
      date: "1ST NOVEMBER - 9:00 AM",
    },
    {
      title: "RESULT DECLARATION",
      date: "1ST NOVEMBER - 12:00 PM",
    },
  ];

  return (
    <section className="relative w-full min-h-[100vh] bg-black flex flex-col transform-gpu" id="timeline">
      {/* Background Image - Absolute and stretched to cover the entire div height */}
      <img
        src="/images/Timeline/TimelineSection.png"
        alt="Timeline Background"
        className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
      />

      {/* Timeline Title Logo (Moved up into the green band) */}
      <div className="absolute top-2 sm:top-2 md:top-4 lg:top-4 left-1/2 -translate-x-1/2 z-30 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[58%] max-w-[850px] pointer-events-none select-none">
        <motion.img
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src="/timelinelogo.png"
          alt="Timeline"
          className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* Foreground Container */}
      <div className="relative z-10 w-full pt-[28vw] sm:pt-[22vw] md:pt-[18vw] lg:pt-[15vw] pb-36 sm:pb-44 md:pb-52 px-3 sm:px-6">
        {/* Pavitr Prabhakar (Positioned at top left) */}
        <motion.div
          initial={{ opacity: 0, x: -40, y: 40 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute top-[32vw] sm:top-[28vw] md:top-[22vw] lg:top-[16vw] left-[1%] sm:left-[2%] md:left-[3%] w-[25%] sm:w-[22%] md:w-[18%] lg:w-[15%] pointer-events-auto z-10 select-none transform-gpu will-change-transform"
        >
          <img
            src="/images/Timeline/PavitrPrabhakr.png"
            alt="Spider-Man Pavitr Prabhakar"
            className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
          />
        </motion.div>

        {/* Web Strand — Continuous silk line shooting directly from Pavitr's wrist down the full height */}
        <div className="timeline-web-strand absolute bottom-0 z-[5] transform-gpu top-[46vw] sm:top-[41vw] md:top-[33vw] lg:top-[25vw] left-[17.5%] sm:left-[16%] md:left-[14%] lg:left-[12.5%] w-[10%] sm:w-[8%] md:w-[7%] lg:w-[5%] pointer-events-none">
          {/* Scroll-driven height container */}
          <div
            className="timeline-web-clip relative w-full h-full overflow-hidden will-change-[height]"
            style={{
              height: "100%",
            }}
          >
            <div
              className="w-full flex flex-col items-center transform-gpu"
              style={{
                mixBlendMode: "screen",
              }}
            >
              {Array.from({ length: 80 }).map((_, i) => (
                <img
                  key={i}
                  src="/images/Timeline/web.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full block select-none pointer-events-none scale-140 sm:scale-150"
                  style={{
                    transform: i % 2 === 1 ? "scaleY(-1) scaleX(1.4)" : "scaleX(1.4)",
                    marginTop: i === 0 ? "0" : "-4px",
                  }}
                />
              ))}
            </div>

            {/* Spider-Hand attached directly at the bottom where the webs terminate */}
            <div className="absolute -bottom-8 sm:-bottom-12 md:-bottom-14 left-1/2 -translate-x-1/2 w-[190%] sm:w-[220%] z-20 pointer-events-none select-none flex justify-center">
              <img
                src="/spiderhand.png"
                alt="Spider-Man Web Hand"
                className="w-full h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Timeline Events Container — Larger text sizes and generous spacing */}
        <div className="relative mt-[15vw] sm:mt-16 md:mt-24 lg:mt-32 left-[32%] sm:left-[30%] md:left-[28%] lg:left-[26%] w-[65%] sm:w-[68%] md:w-[70%] lg:w-[72%] flex flex-col gap-10 sm:gap-14 md:gap-18 lg:gap-22 pointer-events-auto z-20">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: 0.04, ease: "easeOut" }}
              className="w-full flex flex-col items-start justify-start py-1 sm:py-2.5 transform-gpu"
            >
              <h3
                className={`${squada.className} font-bold text-3xl min-[400px]:text-4xl min-[500px]:text-5xl sm:text-6xl md:text-7xl lg:text-[4.8rem] leading-tight sm:leading-none tracking-normal uppercase cursor-default hover:scale-[1.02] transition-transform duration-300 origin-left`}
                style={{
                  color: "#ffd369",
                  WebkitTextStroke: "1.5px #4a154b",
                  textShadow: `
                    -1px 1px 0 #7b165d,
                    -2px 2px 0 #691765,
                    -3px 3px 0 #58186e,
                    -4px 4px 0 #461976,
                    -5px 5px 0 #351a7f,
                    -6px 6px 0 #231b87,
                    -7px 7px 0 #121c90,
                    -8px 7px 0 #1a0526,
                    -7px 8px 0 #1a0526,
                    -8px 8px 0 #1a0526
                  `,
                }}
              >
                {event.title}
              </h3>

              {/* Date Badge Container */}
              <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[6px] sm:rounded-[7px] bg-[#220a27] border-[1.5px] sm:border-2 border-[#fdb827] shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#9f1361] shrink-0" />
                <span className={`${squada.className} text-sm min-[400px]:text-base sm:text-xl md:text-2xl text-[#ffd369] tracking-[0.06em] uppercase leading-none pt-0.5`}>
                  {event.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
