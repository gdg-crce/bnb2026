"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TimelineSection() {
  const events = [
    "/images/Timeline/20.png",
    "/images/Timeline/21.png",
    "/images/Timeline/22.png",
    "/images/Timeline/23.png",
    "/images/Timeline/24.png",
    "/images/Timeline/25.png",
    "/images/Timeline/26.png",
    "/images/Timeline/27.png",
    "/images/Timeline/28.png",
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
        <div className="relative left-[30%] md:left-[25%] lg:left-[20%] w-[65%] md:w-[60%] lg:w-[50%] flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-4 pointer-events-auto z-20">
          {events.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="w-full flex justify-start"
            >
              <img
                src={src}
                alt={`Timeline Event ${index + 1}`}
                className="h-14 sm:h-16 md:h-24 lg:h-32 w-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 origin-left"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
