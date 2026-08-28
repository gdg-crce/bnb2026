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
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
          className="absolute top-[28%] bottom-[8%] left-[13%] md:left-[10%] lg:left-[8%] w-[1.5%] md:w-[1%] lg:w-[0.8%] pointer-events-auto origin-top z-0 bg-white/20 rounded-full"
        >
          <img
            src="/images/Timeline/web.png"
            alt="Web"
            className="w-full h-full object-cover object-top opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
          />
        </motion.div>

        {/* Timeline Events Container */}
        <div className="absolute top-[32%] left-[25%] md:left-[20%] lg:left-[15%] w-[65%] md:w-[60%] lg:w-[50%] flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12 pointer-events-auto z-20 pb-20">
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
                className="w-full md:w-[85%] lg:w-[75%] h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 origin-left"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
