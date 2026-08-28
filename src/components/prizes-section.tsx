"use client";

import { motion } from "framer-motion";
import { Bangers } from "next/font/google";
import Image from "next/image";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

/**
 * Prizes Section:
 * Note: Temporary representation / mobile version layout for current milestone.
 */
export default function PrizesSection() {
  return (
    <section
      id="prizes"
      className={`${bangers.variable} s-prizes relative z-10 overflow-hidden px-4 py-16 sm:py-24 md:px-8 md:py-32`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >


          <div className="relative mt-3 sm:mt-4 flex flex-wrap items-baseline gap-4">
            <h2
              className="font-mono text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#f4f2ee] drop-shadow-[4px_4px_0px_#000]"
              style={{ fontFamily: "var(--font-bangers), cursive" }}
            >
              PRIZES
            </h2>
            <div className="inline-flex items-center gap-2 border-[2.5px] border-[#0a0a10] bg-[#f7d117] px-3.5 py-1.5 font-mono text-xs sm:text-sm font-black uppercase text-[#0a0a10] shadow-[4px_4px_0px_#000] -rotate-1">
              <span>TOTAL POOL: ₹1,00,000+ CASH</span>
            </div>
          </div>


        </motion.div>

        {/* Punk Spider-Verse Comic Cover Prize Grid */}
        <div className="prize-grid">
          {/* Cover P2: 1ST RUNNER UP (Cyan Tone) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="cover p2 order-2 md:order-1"
          >
            <div className="mast">
              <span>ISSUE #02</span>
              <span>EARTH-65 // GWEN</span>
            </div>

            <div className="rank">
              <span>2ND<br />PLACE</span>
            </div>

            <div className="cover-img">
              <img
                src="/images/Prizes/second_prize.jpg"
                alt="1st Runner Up Cover Art"
              />
            </div>

            <div className="body">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0a0a10]/70 block">
                DIMENSIONAL FINALIST
              </span>
              <div className="amount text-[#0a0a10]">₹30,000</div>
              <h3 className="font-mono text-xs font-black uppercase text-[#0a0a10] tracking-wide mt-0.5">
                1ST RUNNER UP
              </h3>


            </div>
          </motion.div>

          {/* Cover P1: GRAND CHAMPION (Pink Tone with Yellow Starburst Rank) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.0 }}
            className="cover p1 order-1 md:order-2"
          >
            <div className="mast">
              <span>ISSUE #01</span>
              <span>EARTH-1610 // MILES</span>
            </div>

            <div className="rank">
              <span>1ST<br />PLACE</span>
            </div>

            <div className="cover-img">
              <img
                src="/images/Prizes/first_prize.jpg"
                alt="Grand Champion Cover Art"
              />
            </div>

            <div className="body">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0a0a10]/70 block">
                SPIDERVERSE CONQUEROR
              </span>
              <div className="amount text-[#ff2e88]">₹50,000</div>
              <h3 className="font-mono text-xs font-black uppercase text-[#0a0a10] tracking-wide mt-0.5">
                GRAND CHAMPION
              </h3>


            </div>
          </motion.div>

          {/* Cover P3: 2ND RUNNER UP (Sepia Tone) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="cover p3 order-3 md:order-3"
          >
            <div className="mast">
              <span>ISSUE #03</span>
              <span>EARTH-50101 // PAVITR</span>
            </div>

            <div className="rank">
              <span>3RD<br />PLACE</span>
            </div>

            <div className="cover-img">
              <img
                src="/images/Prizes/third_prize.jpg"
                alt="2nd Runner Up Cover Art"
              />
            </div>

            <div className="body">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0a0a10]/70 block">
                INNOVATION VANGUARD
              </span>
              <div className="amount text-[#0a0a10]">₹20,000</div>
              <h3 className="font-mono text-xs font-black uppercase text-[#0a0a10] tracking-wide mt-0.5">
                2ND RUNNER UP
              </h3>


            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
