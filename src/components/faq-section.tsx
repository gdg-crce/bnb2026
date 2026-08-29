"use client";

import { useState } from "react";
import { Squada_One } from "next/font/google";

const squada = Squada_One({
  weight: "400",
  subsets: ["latin"],
});

interface BubbleFAQ {
  id: number;
  question: string;
  answer: string;
  left: string;
  top: string;
  width: string;
  height: string;
  borderRadius?: string;
}

const FAQ_BUBBLES: BubbleFAQ[] = [
  {
    id: 1,
    question: "WHO CAN JOIN?",
    answer: "Open to all students! Coders, designers & thinkers welcome.",
    left: "23.3%",
    top: "3.4%",
    width: "18.0%",
    height: "31.8%",
    borderRadius: "50%",
  },
  {
    id: 2,
    question: "TEAM SIZE?",
    answer: "Teams of 2 to 4 members for balanced collaboration.",
    left: "77.3%",
    top: "4.9%",
    width: "18.5%",
    height: "40.7%",
    borderRadius: "50%",
  },
  {
    id: 3,
    question: "REGISTRATION FEE?",
    answer: "₹200 per team, covering tools, swag & prize eligibility.",
    left: "0.3%",
    top: "24.2%",
    width: "15.7%",
    height: "34.1%",
    borderRadius: "50%",
  },
  {
    id: 4,
    question: "MEALS & FOOD?",
    answer: "Complimentary meals, snacks & drinks provided 24/7.",
    left: "16.5%",
    top: "27.3%",
    width: "17.5%",
    height: "34.2%",
    borderRadius: "50%",
  },
  {
    id: 5,
    question: "WHAT IS A HACKATHON?",
    answer: "A 24-hour sprint to build innovative tech solutions.",
    left: "53.3%",
    top: "45.3%",
    width: "16.8%",
    height: "34.6%",
    borderRadius: "50%",
  },
  {
    id: 6,
    question: "WHEN & WHERE?",
    answer: "Oct 31 - Nov 1 in Mumbai! 24h of non-stop hacking & innovation.",
    left: "69.1%",
    top: "45.8%",
    width: "19.4%",
    height: "43.2%",
    borderRadius: "50%",
  },
  {
    id: 7,
    question: "WHO ARE JUDGES?",
    answer: "Top industry leaders, engineers & tech founders.",
    left: "85.0%",
    top: "57.0%",
    width: "14.5%",
    height: "35.5%",
    borderRadius: "50%",
  },
];

export default function FAQSection() {
  const [activeBubble, setActiveBubble] = useState<number | null>(null);

  const toggleBubble = (id: number) => {
    setActiveBubble((curr) => (curr === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none py-8 sm:py-16 md:py-24 px-2 sm:px-4"
    >
      <h2 className="sr-only">Frequently Asked Questions</h2>

      {/* Main Spot Artwork Stage - Responsive Aspect Ratio Locked Canvas */}
      <div className="relative w-full max-w-[1150px] aspect-[1366/768] overflow-hidden flex items-center justify-center">
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
                className={`absolute inset-0 transition-opacity duration-300 pointer-events-none overflow-hidden ${
                  isActive ? "opacity-100" : "opacity-0"
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
                className={`absolute inset-0 z-10 w-full h-full transition-all duration-300 flex items-center justify-center text-center p-2 sm:p-3 ${
                  isActive ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
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
                className={`absolute inset-0 z-20 w-full h-full flex items-center justify-center p-2 min-[400px]:p-2.5 sm:p-3.5 md:p-4 text-center transition-all duration-300 overflow-hidden ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
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
