"use client";

import { useState } from "react";
import Image from "next/image";
import { Bangers } from "next/font/google";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const FAQS = [
  {
    question: "How many members can be in a team?",
    answer: "Teams can range anywhere from 2 to 4 members, allowing for flexibility in group size while ensuring effective collaboration and balanced participation from all members.",
    accent: "#f4f2ee",
    rotate: "-rotate-2",
  },
  {
    question: "Will there be food?",
    answer: "Yes! We will provide delicious meals, and snacks throughout the event to keep everyone energized.",
    accent: "#FFE600",
    rotate: "rotate-3",
  },
  {
    question: "What does it cost?",
    answer: "Registration for Bit N Build costs just ₹200. Your participation includes access to tools, swag, and exciting prizes.",
    accent: "#e5308c",
    rotate: "-rotate-3",
  },
  {
    question: "Who can participate? Are there any required skills?",
    answer: "Anyone is welcome to participate in this event. While experience in coding and programming is a huge plus, teams will also need people with strong presentation skills and brilliant ideas.",
    accent: "#f4f2ee",
    rotate: "rotate-2",
  },
  {
    question: "What is a hackathon?",
    answer: "A hackathon is an event where individuals come together to collaborate on software projects, typically over a short period of time (like 24 hours). Participants can work in teams to create innovative solutions, learn new skills, and showcase their work.",
    accent: "#22b6d6",
    rotate: "-rotate-2",
  },
  {
    question: "When and where?",
    answer: "October 11th-12th, 2025 in Mumbai! 24 hours of non-stop coding, learning, and fun. Check our website for exact venue details and schedule.",
    accent: "#FFE600",
    rotate: "rotate-4",
  },
  {
    question: "Who will be judging?",
    answer: "Judges will be announced closer to the date of the hackathon.",
    accent: "#e5308c",
    rotate: "-rotate-1",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className={`${bangers.variable} relative z-10 w-full overflow-hidden bg-[#0a0a10] py-20 md:py-32 font-sans`}
    >
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,48,140,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 sv-comic-halftone opacity-40 pointer-events-none" />
      <div className="absolute inset-0 sv-ink-lines opacity-20 pointer-events-none" />
      
      {/* Decorative animated elements */}
      <div className="absolute -top-10 -left-10 w-64 h-64 border-4 border-dashed border-[#22b6d6] rounded-full neon-web-glowing opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 border-8 border-dotted border-[#FFE600] rounded-full neon-web-glowing opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 text-center mb-16">
        <h2
          className="text-7xl md:text-9xl text-[#e5308c] uppercase tracking-wider drop-shadow-[6px_6px_0px_#22b6d6] sv-glitch-magenta"
          style={{ fontFamily: "var(--font-bangers), cursive" }}
        >
          FAQ
        </h2>
        <div className="inline-block bg-[#FFE600] px-6 py-2 text-black font-black text-lg md:text-2xl uppercase shadow-[4px_4px_0px_#0a0a10] -rotate-3 mt-4 border-2 border-black">
          Got Questions? We've got answers.
        </div>
      </div>

      {/* Mobile Layout (Stacked Zigzag) */}
      <div className="md:hidden relative z-10 mx-auto flex max-w-md flex-col items-center gap-8 px-6 pb-20">
        {/* Central Portal for Mobile */}
        <div className="relative w-full aspect-square mb-6 group">
          <div className="absolute inset-0 bg-[#22b6d6] rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/images/faq-portal.jpg"
            alt="Glitch Portal"
            fill
            className="object-cover rounded-full border-8 border-black shadow-[0_0_40px_rgba(34,182,214,0.6)] z-10"
          />
        </div>

        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const num = String(idx + 1).padStart(2, "0");
          return (
            <div
              key={idx}
              className={`relative w-full ${faq.rotate} hover:scale-105 transition-all duration-300`}
            >
              <div
                className="relative border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{ backgroundColor: faq.accent }}
                onClick={() => toggle(idx)}
              >
                {/* Inner dashed border */}
                <div className="absolute inset-1 border-2 border-dashed border-black/30 pointer-events-none" />

                {/* Number Tag */}
                <div className="absolute -top-4 -left-4 border-4 border-black bg-white px-3 py-1 font-mono text-lg font-black text-black rotate-6 shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20">
                  {num}
                </div>
                
                <h3 className="relative z-10 font-mono text-base font-black uppercase text-black mt-3 pr-8 leading-tight">
                  {faq.question}
                </h3>
                
                <div
                  className={`relative z-10 mt-3 overflow-hidden text-sm font-bold text-black/80 transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-3 border-t-2 border-black/20">
                    {faq.answer}
                  </div>
                </div>

                {/* Plus button */}
                <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white shadow-[2px_2px_0px_rgba(255,255,255,0.5)] group-hover:bg-[#e5308c] group-hover:scale-110 transition-all duration-300 z-20">
                  <span className={`text-xl font-black leading-none transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Layout (Radial around central image) */}
      <div className="hidden md:flex relative z-10 mx-auto max-w-[1200px] h-[900px] items-center justify-center">
        {/* Central Image */}
        <div className="relative w-[450px] h-[450px] z-20 group">
          <div className="absolute inset-0 bg-[#e5308c] rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
          <Image
            src="/images/faq-portal.jpg"
            alt="Glitch Portal"
            fill
            className="object-cover rounded-full border-8 border-black shadow-[0_0_60px_rgba(229,48,140,0.5)] z-10 hover:rotate-6 transition-transform duration-700"
            style={{ clipPath: 'polygon(40% 0%, 100% 20%, 80% 100%, 0% 80%, 20% 10%)' }} // chaotic jagged clip
          />
        </div>

        {/* Positioned FAQ Cards */}
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const num = String(idx + 1).padStart(2, "0");
          
          const isLeft = idx < 4;
          // Space them out more elegantly
          const verticalPos = isLeft ? (idx * 24) + 8 : ((idx - 4) * 24) + 8;
          const horizontalOffset = isLeft ? (idx === 1 || idx === 2 ? '2%' : '8%') : (idx === 5 || idx === 6 ? '2%' : '8%');
          
          return (
            <div
              key={idx}
              className={`absolute w-[320px] z-30 ${faq.rotate} hover:scale-110 hover:z-50 transition-all duration-300`}
              style={{
                top: `${verticalPos}%`,
                [isLeft ? 'left' : 'right']: horizontalOffset,
              }}
            >
              <div
                className="relative border-4 border-black p-5 shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] cursor-pointer group bg-white"
                style={{ backgroundColor: faq.accent }}
                onClick={() => toggle(idx)}
                onMouseEnter={() => setOpenIndex(idx)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                {/* Inner dashed border */}
                <div className="absolute inset-1 border-2 border-dashed border-black/30 pointer-events-none" />

                <div className="absolute -top-4 -left-4 border-4 border-black bg-white px-3 py-1 font-mono text-lg font-black text-black -rotate-6 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  {num}
                </div>
                
                <h3 className="relative z-10 font-mono text-lg font-black uppercase text-black mt-3 pr-8 leading-tight">
                  {faq.question}
                </h3>
                
                <div
                  className={`relative z-10 overflow-hidden text-sm font-bold text-black/90 transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-60 mt-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-3 border-t-2 border-black/20">
                    {faq.answer}
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-black text-white shadow-[2px_2px_0px_rgba(255,255,255,0.8)] group-hover:bg-[#22b6d6] transition-colors duration-300">
                  <span className={`text-xl font-black leading-none transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
              
              {/* SVG connection line to center */}
              <svg className="absolute top-1/2 w-48 h-2 overflow-visible -z-10 opacity-60 group-hover:opacity-100 transition-opacity" style={{ [isLeft ? 'left' : 'right']: '90%' }}>
                <path d={`M 0 0 Q ${isLeft ? '80 40 160' : '-80 40 -160'} ${isLeft ? '80' : '80'}`} fill="transparent" stroke={faq.accent} strokeWidth="4" strokeDasharray="10,8" />
                <path d={`M 0 0 Q ${isLeft ? '80 40 160' : '-80 40 -160'} ${isLeft ? '80' : '80'}`} fill="transparent" stroke="black" strokeWidth="2" strokeDasharray="10,8" />
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
}
