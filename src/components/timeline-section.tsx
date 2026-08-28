"use client";

import { motion } from "framer-motion";

import { Squada_One } from "next/font/google";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

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
      <div className="relative z-10 w-full pt-[14vw] pb-20 px-4">
        {/* Pavitr Prabhakar */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-[11vw] left-[2%] w-[25%] md:w-[18%] lg:w-[15%] pointer-events-auto z-10"
        >
          <img
            src="/images/Timeline/PavitrPrabhakr.png"
            alt="Spider-Man"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Web Line */}
        <div
          className="absolute top-[13vw] bottom-[20px] left-[17%] md:left-[15%] lg:left-[13%] w-[5%] md:w-[3.5%] lg:w-[2.5%] pointer-events-none z-[30]"
        >
          <div className="w-full h-full relative flex justify-center">
            {/* The actual web image */}
            <img
              src="/images/Timeline/web.png"
              alt="Web"
              className="w-full h-full object-cover object-top drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
            />
          </div>
        </div>

        {/* Timeline Events Container - NOW RELATIVE to push the section height naturally */}
        <div className="relative mt-12 sm:mt-16 md:mt-20 lg:mt-28 left-[30%] md:left-[25%] lg:left-[20%] w-[65%] md:w-[60%] lg:w-[50%] flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-20 pointer-events-auto z-20">
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
