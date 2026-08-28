"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const FAQS = [
  {
    question: "How many members can be in a team?",
    answer: "Teams can range anywhere from 2 to 4 members, allowing for flexibility in group size while ensuring effective collaboration and balanced participation from all members.",
    accent: "#f4f2ee", // paper
    rotate: "-rotate-2",
  },
  {
    question: "Will there be food?",
    answer: "Yes! We will provide delicious meals, and snacks throughout the event to keep everyone energized.",
    accent: "#FFE600", // yellow
    rotate: "rotate-3",
  },
  {
    question: "What does it cost?",
    answer: "Registration for Bit N Build costs just ₹200. Your participation includes access to tools, swag, and exciting prizes.",
    accent: "#e5308c", // magenta
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
    accent: "#22b6d6", // cyan
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
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Chromatic split on header
        gsap.fromTo(
          ".faq-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: { trigger: ".faq-mark", start: "top 84%" },
          },
        );

        const split = new SplitText(".faq-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".faq-mark", start: "top 84%" },
        });

        gsap.from(".faq-lede", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          scrollTrigger: { trigger: ".faq-mark", start: "top 84%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="faq"
      className="halftone relative z-10 w-full overflow-hidden bg-void py-24 md:py-32 font-sans"
    >
      {/* Dynamic Spider-Verse Atmospheric Glow & Halftone Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,48,140,0.12)_0%,transparent_65%)] pointer-events-none" />
      
      {/* Decorative animated elements */}
      <div className="absolute -top-10 -left-10 w-64 h-64 border-4 border-dashed border-[#22b6d6] rounded-full animate-spin-slow opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 border-8 border-dotted border-[#FFE600] rounded-full opacity-15 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header with Chromatic Split Typography from Commit 353bd25 */}
        <div className="faq-mark relative mb-16 flex flex-col items-center text-center md:mb-20">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-red shadow-[0_0_10px_#d6070c]" />
            <span className="eyebrow text-red">Earth-65 // Mission Briefing</span>
          </div>

          <div className="relative mt-4">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`faq-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              FAQ
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`faq-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              FAQ
            </span>
            {/* Front Face */}
            <h2
              className={`faq-mark-face display relative text-paper ${MARK_SIZE}`}
            >
              FAQ
            </h2>
          </div>

          <p className="faq-lede mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Got questions before you take the leap? Here is everything you need to know about the multiverse hackathon.
          </p>
        </div>
      </div>

      {/* Mobile Layout (Stacked Zigzag with Glitch Portal) */}
      <div className="md:hidden relative z-10 mx-auto flex max-w-md flex-col items-center gap-8 px-6 pb-20">
        {/* Central Portal for Mobile */}
        <div className="relative w-64 h-64 aspect-square mb-4 group">
          <div className="absolute inset-0 bg-[#22b6d6] rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
          <Image
            src="/images/faq-portal.jpg"
            alt="Glitch Portal"
            fill
            className="object-cover rounded-full border-4 border-black shadow-[0_0_40px_rgba(34,182,214,0.5)] z-10"
          />
        </div>

        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const num = String(idx + 1).padStart(2, "0");
          return (
            <div
              key={idx}
              className={`relative w-full ${faq.rotate} transition-transform duration-300`}
            >
              <div
                className="relative border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{ backgroundColor: faq.accent }}
                onClick={() => toggle(idx)}
              >
                {/* Inner dashed border */}
                <div className="absolute inset-1 border-2 border-dashed border-black/30 pointer-events-none" />

                {/* Number Tag */}
                <div className="absolute -top-3 -left-3 border-3 border-black bg-white px-2.5 py-0.5 font-mono text-sm font-black text-black rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] z-20">
                  {num}
                </div>
                
                <h3 className="relative z-10 font-mono text-sm font-black uppercase text-black mt-2 pr-8 leading-snug">
                  {faq.question}
                </h3>
                
                <div
                  className={`relative z-10 mt-3 overflow-hidden text-sm font-bold text-black/85 transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-3 border-t-2 border-black/20 font-sans font-medium text-xs leading-relaxed text-black/90">
                    {faq.answer}
                  </div>
                </div>

                {/* Plus button */}
                <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-black text-white shadow-[2px_2px_0px_rgba(255,255,255,0.5)] group-hover:bg-[#e5308c] transition-all duration-300 z-20">
                  <span className={`text-base font-black leading-none transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Layout (Radial around central Glitch Portal) */}
      <div className="hidden md:flex relative z-10 mx-auto max-w-[1200px] h-[850px] items-center justify-center">
        {/* Central Glitch Portal */}
        <div className="relative w-[380px] h-[380px] z-20 group">
          <div className="absolute inset-0 bg-[#e5308c] rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
          <Image
            src="/images/faq-portal.jpg"
            alt="Glitch Portal"
            fill
            className="object-cover rounded-full border-6 border-black shadow-[0_0_50px_rgba(229,48,140,0.5)] z-10 hover:rotate-6 transition-transform duration-700"
            style={{ clipPath: 'polygon(40% 0%, 100% 20%, 80% 100%, 0% 80%, 20% 10%)' }}
          />
        </div>

        {/* Positioned FAQ Cards */}
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const num = String(idx + 1).padStart(2, "0");
          
          const isLeft = idx < 4;
          const verticalPos = isLeft ? (idx * 23) + 6 : ((idx - 4) * 27) + 12;
          const horizontalOffset = isLeft ? (idx === 1 || idx === 2 ? '3%' : '8%') : (idx === 5 ? '3%' : '8%');
          
          return (
            <div
              key={idx}
              className={`absolute w-[300px] z-30 ${faq.rotate} hover:scale-105 hover:z-50 transition-all duration-300`}
              style={{
                top: `${verticalPos}%`,
                [isLeft ? 'left' : 'right']: horizontalOffset,
              }}
            >
              <div
                className="relative border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_rgba(0,0,0,1)] cursor-pointer group"
                style={{ backgroundColor: faq.accent }}
                onClick={() => toggle(idx)}
                onMouseEnter={() => setOpenIndex(idx)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                {/* Inner dashed border */}
                <div className="absolute inset-1 border-2 border-dashed border-black/30 pointer-events-none" />

                <div className="absolute -top-3.5 -left-3.5 border-3 border-black bg-white px-2.5 py-0.5 font-mono text-sm font-black text-black -rotate-6 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {num}
                </div>
                
                <h3 className="relative z-10 font-mono text-sm font-black uppercase text-black mt-2 pr-6 leading-tight">
                  {faq.question}
                </h3>
                
                <div
                  className={`relative z-10 overflow-hidden text-xs font-medium text-black/90 transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-60 mt-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-2.5 border-t-2 border-black/20 font-sans leading-relaxed">
                    {faq.answer}
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-black text-white shadow-[2px_2px_0px_rgba(255,255,255,0.8)] group-hover:bg-[#22b6d6] transition-colors duration-300">
                  <span className={`text-base font-black leading-none transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
              </div>
              
              {/* SVG connection line to center */}
              <svg className="absolute top-1/2 w-40 h-2 overflow-visible -z-10 opacity-50 group-hover:opacity-100 transition-opacity" style={{ [isLeft ? 'left' : 'right']: '90%' }}>
                <path d={`M 0 0 Q ${isLeft ? '60 30 120' : '-60 30 -120'} ${isLeft ? '60' : '60'}`} fill="transparent" stroke={faq.accent} strokeWidth="3" strokeDasharray="8,6" />
                <path d={`M 0 0 Q ${isLeft ? '60 30 120' : '-60 30 -120'} ${isLeft ? '60' : '60'}`} fill="transparent" stroke="black" strokeWidth="1.5" strokeDasharray="8,6" />
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
}
