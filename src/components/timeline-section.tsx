"use client";

import { motion } from "framer-motion";
import { Squada_One } from "next/font/google";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

function TimelineItem({
  date,
  isSpecial,
}: {
  date: string;
  isSpecial: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 mt-1 sm:mt-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md font-mono text-xs sm:text-sm md:text-base font-bold tracking-wide uppercase border-2 shadow-[2px_2px_0px_#000] select-none ${
        isSpecial
          ? "bg-[#4a154b] text-[#ffd369] border-[#ffd369]/90 shadow-[0_0_14px_rgba(255,211,105,0.4),2px_2px_0px_#000]"
          : "bg-[#1a0526]/90 text-[#fcd49b] border-[#4a154b]"
      }`}
    >
      {isSpecial && (
        <span className="w-2 h-2 rounded-full bg-[#e5308c] shadow-[0_0_8px_#e5308c] animate-pulse" />
      )}
      <span>{date}</span>
    </div>
  );
}

const TIMELINE_DATA = [
  {
    title: "Registrations",
    date: "Live - 19th September",
    isSpecial: true,
  },
  {
    title: "Internal State Rounds",
    date: "30th August - 28th September",
    isSpecial: true,
  },
  {
    title: "Maharashtra State Round",
    date: "3rd October - 4th October",
    isSpecial: true,
  },
  {
    title: "Final Round",
    date: "31st October - 1st November",
    isSpecial: true,
  },
  {
    title: "Hackathon Begins",
    date: "31st October 5:00 PM",
    isSpecial: true,
  },
  {
    title: "Mentoring Session Begins",
    date: "31st October 9:00 PM",
    isSpecial: true,
  },
  {
    title: "Judging Rounds 1 & 2",
    date: "1st November 9:00 AM",
    isSpecial: true,
  },
  {
    title: "Result Declaration",
    date: "1st November 5:00 PM",
    isSpecial: true,
  },
  {
    title: "Hackathon Ends",
    date: "1st November 6:00 PM",
    isSpecial: true,
  },
];

/* ── Main Timeline Section ────────────────────────────────────────────── */
export default function TimelineSection() {
  return (
    <section className="relative w-full min-h-[100vh] bg-[#fcd49b] flex flex-col transform-gpu" id="timeline">
      {/* Background Image - Absolute and stretched to cover the entire div height */}
      <img
        src="/images/Timeline/TimelineSection.png"
        alt="Timeline Background"
        className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
      />

      {/* Timeline Title Logo (Enlarged) */}
      <div className="absolute top-4 sm:top-7 md:top-10 lg:top-12 xl:top-14 left-1/2 -translate-x-1/2 z-30 w-[92%] sm:w-[82%] md:w-[72%] lg:w-[62%] xl:w-[54%] max-w-[920px] pointer-events-none select-none">
        <motion.img
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src="/timelinelogo.png"
          alt="Timeline"
          className="w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* Foreground Container */}
      <div className="relative z-10 w-full pt-[18vw] sm:pt-[16vw] md:pt-[14vw] lg:pt-[12vw] pb-6 sm:pb-8 px-4">
        {/* Pavitr Prabhakar (Shifted slightly right into arch center) */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-[13vw] sm:top-[11vw] md:top-[9vw] lg:top-[7.5vw] xl:top-[6.5vw] -left-[4.5%] sm:-left-[3.2%] md:-left-[2%] lg:-left-[1%] xl:-left-[0.5%] w-[38%] sm:w-[32%] md:w-[26%] lg:w-[21%] xl:w-[19%] pointer-events-auto z-10 select-none transform-gpu will-change-transform"
        >
          <img
            src="/images/Timeline/PavitrPrabhakr.png"
            alt="Spider-Man Pavitr Prabhakar"
            className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
          />
        </motion.div>

        {/* Web Strand — continuous silk line shooting directly from Pavitr's wrist down the full height */}
        <div className="timeline-web-strand absolute top-[33vw] sm:top-[28vw] md:top-[22.8vw] lg:top-[18.6vw] xl:top-[16.5vw] bottom-0 left-[21.5%] sm:left-[18.5%] md:left-[15.5%] lg:left-[13%] xl:left-[12.2%] w-[10%] sm:w-[8.5%] md:w-[7%] lg:w-[5.8%] xl:w-[5.2%] pointer-events-none z-[5] transform-gpu">
          {/* Scroll-driven height container (Reveals from Pavitr's wrist downwards as user scrolls) */}
          <div
            className="timeline-web-clip relative w-full h-full overflow-hidden will-change-[height]"
            style={{
              height: "0%",
            }}
          >
            <div
              className="w-full flex flex-col items-center transform-gpu"
              style={{
                mixBlendMode: "screen",
              }}
            >
              {Array.from({ length: 70 }).map((_, i) => (
                <img
                  key={i}
                  src="/images/Timeline/web.png"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full block select-none pointer-events-none scale-135 sm:scale-145 md:scale-150"
                  style={{
                    transform: i % 2 === 1 ? "scaleY(-1) scaleX(1.35)" : "scaleX(1.35)",
                    marginTop: i === 0 ? "0" : "-4px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Events Container (Shifted right for clean generous spacing from web) */}
        <div className="relative mt-24 sm:mt-36 md:mt-44 lg:mt-52 xl:mt-60 left-[38%] sm:left-[33%] md:left-[29%] lg:left-[24.5%] xl:left-[22.5%] w-[58%] sm:w-[65%] md:w-[69%] lg:w-[73%] flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-14 pointer-events-auto z-20">
          {TIMELINE_DATA.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
              className="w-full flex flex-col items-start py-1 sm:py-2 transform-gpu group"
            >
              <h3
                className={`${squada.className} font-bold text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] leading-none tracking-normal uppercase cursor-default group-hover:scale-[1.02] transition-transform duration-300 origin-left`}
                style={{
                  color: "#ffd369",
                  WebkitTextStroke: "2px #4a154b",
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
                {item.title}
              </h3>
              <TimelineItem date={item.date} isSpecial={item.isSpecial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

