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
    <section className="relative w-full bg-[#fcd49b]" id="timeline">
      {/* Background Image - Width 100%, Height auto to preserve ratio and allow scrolling */}
      <img
        src="/images/Timeline/TimelineSection.png"
        alt="Timeline Background"
        className="w-full h-auto block"
      />

      {/* Foreground Container absolutely positioned over the background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Pavitr Prabhakar */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-[20%] left-[2%] w-[25%] md:w-[18%] lg:w-[15%] pointer-events-auto z-10"
        >
          <img
            src="/images/Timeline/PavitrPrabhakr.png"
            alt="Spider-Man"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Web Line */}
        <div
          className="absolute top-[23%] bottom-[8%] left-[17%] md:left-[15%] lg:left-[13%] w-[5%] md:w-[3.5%] lg:w-[2.5%] pointer-events-none z-[30]"
        >
          <div className="w-full h-full relative flex justify-center opacity-60 mix-blend-screen">
            {/* The actual web image */}
            <img
              src="/images/Timeline/web.png"
              alt="Web"
              className="w-full h-full object-cover object-top drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
            />
          </div>
        </div>

        {/* Timeline Events Container */}
        <div className="absolute top-[32%] left-[30%] md:left-[25%] lg:left-[20%] w-[65%] md:w-[60%] lg:w-[50%] flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 pointer-events-auto z-20 pb-20">
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
