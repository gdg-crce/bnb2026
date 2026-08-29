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
    "REGISTRATIONS",
    "INTERNAL STATE ROUNDS",
    "MAHARASHTRA STATE ROUND",
    "FINAL ROUND",
    "HACKATHON BEGINS",
    "MENTORING SESSION",
    "JUDGING ROUNDS 1 & 2",
    "HACKATHON ENDS",
    "RESULT DECLARATION",
  ];

  return (
    <section className="relative w-full min-h-[100vh] bg-[#fcd49b] flex flex-col" id="timeline">
      {/* Background Image - Absolute and stretched to cover the entire div height */}
      <img
        src="/images/Timeline/TimelineSection.png"
        alt="Timeline Background"
        className="absolute inset-0 w-full h-full object-fill z-0"
      />

      {/* Foreground Container */}
      <div className="relative z-10 w-full pt-[18vw] sm:pt-[16vw] md:pt-[14vw] lg:pt-[12vw] pb-28 px-4">
        {/* Pavitr Prabhakar (Bigger, Lower & Heroic) */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-[13vw] sm:top-[11vw] md:top-[9vw] lg:top-[7.5vw] xl:top-[6.5vw] left-[1.5%] sm:left-[2%] md:left-[2.5%] w-[42%] sm:w-[35%] md:w-[28%] lg:w-[23%] xl:w-[21%] pointer-events-auto z-10 select-none"
        >
          <img
            src="/images/Timeline/PavitrPrabhakr.png"
            alt="Spider-Man Pavitr Prabhakar"
            className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
          />
        </motion.div>

        {/* Web Strand — continuous silk line shooting directly from Pavitr's wrist down the full height */}
        <div className="timeline-web-strand absolute top-[34vw] sm:top-[28vw] md:top-[23vw] lg:top-[19vw] xl:top-[17.5vw] bottom-[40px] left-[25%] sm:left-[21%] md:left-[17%] lg:left-[14.2%] xl:left-[13%] w-[26%] sm:w-[22%] md:w-[17%] lg:w-[13.5%] xl:w-[12%] pointer-events-none z-[5]">
          {/* Scroll-driven height container (Reveals from Pavitr's wrist downwards as user scrolls) */}
          <div
            className="timeline-web-clip relative w-full h-full overflow-hidden will-change-[height]"
            style={{
              height: "0%",
            }}
          >
            <div
              className="w-full flex flex-col items-center"
              style={{
                mixBlendMode: "screen",
                filter: "drop-shadow(0 0 2px rgba(26,5,38,0.9)) drop-shadow(0 0 5px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(34,182,214,0.9))",
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <img
                  key={i}
                  src="/images/Timeline/web.png"
                  alt=""
                  className="w-full block select-none pointer-events-none scale-110"
                  style={{
                    transform: i % 2 === 1 ? "scaleY(-1) scaleX(1.1)" : "scaleX(1.1)",
                    marginTop: i === 0 ? "0" : "-3px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Events Container (Shifted down for clean spacing below the arch) */}
        <div className="relative mt-28 sm:mt-36 md:mt-44 lg:mt-52 xl:mt-60 left-[38%] sm:left-[34%] md:left-[29%] lg:left-[25%] xl:left-[23%] w-[60%] md:w-[68%] lg:w-[73%] flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-20 pointer-events-auto z-20">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="w-full flex justify-start py-1"
            >
              <h3
                className={`${squada.className} font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] leading-none tracking-normal uppercase cursor-default hover:scale-[1.02] transition-transform duration-300 origin-left`}
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
                {event}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
