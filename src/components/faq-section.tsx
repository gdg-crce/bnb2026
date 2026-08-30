"use client";

import { useState } from "react";
import { Squada_One, Montserrat, Orbitron } from "next/font/google";
import { Plus, Minus, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
});

interface BubbleFAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  accent?: string;
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

const FAQ_BUBBLES: BubbleFAQ[] = [
  {
    id: 1,
    question: "WHO CAN JOIN?",
    answer: "Open to all college students across all disciplines! Coders, designers, innovators and enthusiastic thinkers are welcome.",
    category: "ELIGIBILITY",
    accent: "#ff2e88",
    left: "23.3%",
    top: "3.4%",
    width: "18.0%",
    height: "31.8%",
    borderRadius: "50%",
  },
  {
    id: 2,
    question: "TEAM SIZE?",
    answer: "Teams of 2 to 4 members are required for balanced collaboration across development, UI/UX and presentation.",
    category: "TEAMS",
    accent: "#00f0ff",
    left: "77.3%",
    top: "4.9%",
    width: "18.5%",
    height: "40.7%",
    borderRadius: "50%",
  },
  {
    id: 3,
    question: "REGISTRATION FEE?",
    answer: "₹200 per team, which covers mentor support, development APIs, exclusive hackathon swag, and grand prize eligibility.",
    category: "ENTRY",
    accent: "#ffd369",
    left: "0.3%",
    top: "24.2%",
    width: "15.7%",
    height: "34.1%",
    borderRadius: "50%",
  },
  {
    id: 4,
    question: "MEALS & FOOD?",
    answer: "Complimentary hearty meals, midnight snacks, caffeine boosts, and energy drinks provided 24/7 at the venue.",
    category: "HOSPITALITY",
    accent: "#ff2e88",
    left: "16.5%",
    top: "27.3%",
    width: "17.5%",
    height: "34.2%",
    borderRadius: "50%",
  },
  {
    id: 5,
    question: "WHAT IS A HACKATHON?",
    answer: "An intense 24-hour sprint where you collaborate with peers to build real-world software or hardware prototypes from scratch.",
    category: "EVENT FORMAT",
    accent: "#00f0ff",
    left: "53.3%",
    top: "45.3%",
    width: "16.8%",
    height: "34.6%",
    borderRadius: "50%",
  },
  {
    id: 6,
    question: "WHEN & WHERE?",
    answer: "October 31 - November 1 in Mumbai (CRCE Bandra West)! 24 hours of non-stop hacking, mentoring, and networking.",
    category: "LOGISTICS",
    accent: "#ffd369",
    left: "69.1%",
    top: "45.8%",
    width: "19.4%",
    height: "43.2%",
    borderRadius: "50%",
  },
  {
    id: 7,
    question: "WHO ARE JUDGES?",
    answer: "Top industry engineering leaders, seasoned startup founders, and veteran developers.",
    category: "EVALUATION",
    accent: "#ff2e88",
    left: "85.0%",
    top: "57.0%",
    width: "14.5%",
    height: "35.5%",
    borderRadius: "50%",
  },
];

export default function FAQSection() {
  const [activeBubble, setActiveBubble] = useState<number | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<number | null>(1);

  const toggleBubble = (id: number) => {
    setActiveBubble((curr) => (curr === id ? null : id));
  };

  const toggleMobileAccordion = (id: number) => {
    setMobileOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none py-10 sm:py-16 md:py-24 px-4 sm:px-6"
    >
      <h2 className="sr-only">Frequently Asked Questions</h2>

      {/* ========================================================================= */}
      {/* 1. MOBILE-ONLY SPIDER-VERSE COMIC FAQ (visible on screens < 768px)         */}
      {/* ========================================================================= */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center md:hidden z-10">
        {/* Multiverse Dimension Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161022] border border-[#ff2e88]/40 shadow-[0_0_15px_rgba(255,46,136,0.3)] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#ff2e88] animate-pulse" />
          <span className={`${orbitron.className} text-[10px] font-black tracking-widest text-[#ff2e88] uppercase`}>
            DIMENSION // 1610 • INTEL
          </span>
        </div>

        {/* Section Title with Comic Shadow */}
        <div className="text-center mb-6">
          <h3
            className={`${squada.className} text-4xl sm:text-5xl text-white tracking-wider uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]`}
            style={{
              textShadow: "2px 2px 0px #ff2e88, -2px -2px 0px #00f0ff",
            }}
          >
            FREQUENTLY ASKED
          </h3>
          <h4
            className={`${squada.className} text-3xl sm:text-4xl text-[#ffd369] tracking-wider uppercase leading-none mt-0.5`}
          >
            QUESTIONS
          </h4>
          <p className={`${montserrat.className} text-xs text-white/60 font-medium mt-2`}>
            Tap any record to decrypt details
          </p>
        </div>

        {/* Comic FAQ Accordion Cards Stack */}
        <div className="w-full space-y-3.5">
          {FAQ_BUBBLES.map((item, idx) => {
            const isOpen = mobileOpenId === item.id;
            const accentColor = item.accent || "#ff2e88";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => toggleMobileAccordion(item.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${isOpen
                    ? "bg-[#140f20] border-[#ff2e88] shadow-[3px_3px_0px_#ff2e88]"
                    : "bg-[#0d0a14]/90 border-white/15 hover:border-white/40 shadow-[3px_3px_0px_#000]"
                  }`}
              >
                {/* Comic Card Header Row */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Index Tag */}
                    <span
                      className={`${orbitron.className} text-[10px] font-black px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-[#00f0ff] shrink-0`}
                    >
                      0{item.id}
                    </span>

                    {/* Question Title */}
                    <h5
                      className={`${squada.className} text-lg sm:text-xl text-white tracking-wide uppercase leading-tight truncate`}
                    >
                      {item.question}
                    </h5>
                  </div>

                  {/* Toggle Button Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${isOpen
                        ? "bg-[#ff2e88] border-black text-black rotate-180 shadow-[1px_1px_0px_#000]"
                        : "bg-white/10 border-white/20 text-white"
                      }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </div>
                </div>

                {/* Animated Accordion Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-white/10 bg-black/40"
                    >
                      <div className="p-3.5 pt-3">
                        {/* Category Pill */}
                        <div className="inline-block mb-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase bg-white/10 text-[#ffd369]">
                          {item.category}
                        </div>

                        {/* Answer Text */}
                        <p
                          className={`${montserrat.className} text-xs sm:text-sm text-white/90 leading-relaxed font-normal`}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP INTERACTIVE THE SPOT FAQ STAGE (visible on md+ screens)          */}
      {/* ========================================================================= */}
      <div className="hidden md:flex relative w-full max-w-[1150px] aspect-[1366/768] overflow-hidden items-center justify-center">
        {/* Background Spot Artwork */}
        <img
          src="/spot.png"
          alt="The Spot FAQ"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          draggable={false}
        />

        {/* Interactive White Circles / Ovals */}
        {FAQ_BUBBLES.map((bubble) => {
          const isActive = activeBubble === bubble.id;

          return (
            <div
              key={bubble.id}
              onClick={() => toggleBubble(bubble.id)}
              onMouseEnter={() => setActiveBubble(bubble.id)}
              onMouseLeave={() => setActiveBubble((curr) => (curr === bubble.id ? null : curr))}
              className="absolute cursor-pointer transition-transform duration-300 transform-gpu overflow-hidden hover:scale-[1.02] flex items-center justify-center"
              style={{
                left: bubble.left,
                top: bubble.top,
                width: bubble.width,
                height: bubble.height,
                borderRadius: bubble.borderRadius || "50%",
              }}
            >
              {/* Halftone RGB Glitch Texture Layer (Clipped to exact oval shape) */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 pointer-events-none overflow-hidden ${isActive ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  backgroundImage: "url('/faq-glitch.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: bubble.borderRadius || "50%",
                }}
              >
                {/* Dark Contrast Vignette for pristine text readability */}
                <div
                  className="absolute inset-0 bg-black/65 backdrop-blur-[1px]"
                  style={{
                    borderRadius: bubble.borderRadius || "50%",
                  }}
                />
              </div>

              {/* Question Text (Straight, Horizontal & Dead-Centered) */}
              <div
                className={`absolute inset-0 z-10 w-full h-full transition-all duration-300 flex items-center justify-center text-center p-2 sm:p-3 ${isActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                  }`}
              >
                <span
                  className={`${squada.className} font-bold text-[10px] min-[400px]:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#0d0410] leading-tight tracking-normal uppercase max-w-[85%]`}
                >
                  {bubble.question}
                </span>
              </div>

              {/* Answer Text (Straight, Horizontal & Dead-Centered) */}
              <div
                className={`absolute inset-0 z-20 w-full h-full flex items-center justify-center p-2 min-[400px]:p-2.5 sm:p-3.5 md:p-4 text-center transition-all duration-300 overflow-hidden ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                  }`}
              >
                <span
                  className={`${squada.className} font-bold text-[8px] min-[400px]:text-[9px] min-[500px]:text-[10px] sm:text-xs md:text-sm lg:text-[15px] xl:text-base text-white leading-snug tracking-wide uppercase max-w-[82%]`}
                  style={{
                    textShadow: "0 2px 8px rgba(0,0,0,1), 0 0 12px rgba(255,255,255,0.4)",
                  }}
                >
                  {bubble.answer}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
