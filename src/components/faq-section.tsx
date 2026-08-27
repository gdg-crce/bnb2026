"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import faqBg from "../../public/images/faq-bg.jpg";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

const FAQS = [
  {
    question: "Who is eligible to participate in Bit N Build 2026?",
    answer:
      "Bit N Build is open to all enrolled college students, recent graduates, developers, and designers globally. Whether you are a first-year undergraduate or a seasoned builder, you are welcome to participate.",
    category: "ELIGIBILITY",
    accent: "#FFE600",
  },
  {
    question: "What is the team size and squad composition?",
    answer:
      "Teams can consist of 2 to 4 members. You can register with a pre-formed squad, or register individually and find teammates in our dedicated Discord matchmaking channels prior to Phase 01.",
    category: "TEAMS",
    accent: "#22b6d6",
  },
  {
    question: "Is there any registration fee or hidden cost?",
    answer:
      "Zero. Bit N Build is 100% free of cost for all participants. For the shortlisted offline grand finale, all meals, energy snacks, high-speed connectivity, and official swag kits are fully sponsored.",
    category: "COST",
    accent: "#8fc63d",
  },
  {
    question: "Can we use pre-existing code or side projects?",
    answer:
      "All code, designs, and prototypes must be authored during the official 36-hour hackathon period. You are freely encouraged to use publicly available open-source libraries, APIs, and starter templates.",
    category: "RULES",
    accent: "#e5308c",
  },
  {
    question: "What if this is my very first hackathon?",
    answer:
      "You are in the right place! We have dedicated beginner-friendly tracks, 1-on-1 mentoring sessions with engineers from Google and industry leaders, and technical workshops to help you ship your dream project.",
    category: "BEGINNERS",
    accent: "#FFE600",
  },
  {
    question: "What is the hackathon format (Online vs Offline)?",
    answer:
      "Round 1 (Ideation & Prototype Screening) is held online globally. The Top 50 shortlisted squads advance to the 36-hour physical hackathon finale hosted on campus at CRCE Bandra, Mumbai.",
    category: "FORMAT",
    accent: "#22b6d6",
  },
  {
    question: "How are projects evaluated and judged?",
    answer:
      "Projects are evaluated by a panel of industry veterans and VC leaders based on four core criteria: Innovation & Creativity (25%), Technical Complexity & Execution (30%), Design & User Experience (25%), and Real-World Impact (20%).",
    category: "JUDGING",
    accent: "#d6070c",
  },
];

export default function FAQSection() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow parallax on the FAQ backdrop
        gsap.fromTo(
          ".faq-backdrop",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

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

        // FAQ accordion items stagger in
        gsap.from(".faq-item", {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-accordion", start: "top 82%" },
        });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      id="faq"
      ref={root}
      className="halftone relative z-10 overflow-hidden bg-void px-6 py-28 md:px-10 md:py-36"
    >
      {/* Real Comic Rooftop Sunset Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="faq-backdrop absolute -top-[10%] -left-[5%] h-[120%] w-[110%]">
          <Image
            src={faqBg}
            alt="FAQ Rooftop Sunset Backdrop"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-30 brightness-90 contrast-125"
          />
        </div>
        {/* Scrim blending into void */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/75 to-void" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="faq-mark relative mb-16 flex flex-col items-start md:mb-20">
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
            Got questions before you take the leap? Here is everything you need
            to know about the multiverse hackathon.
          </p>
        </div>

        {/* Accordion List */}
        <div className="faq-accordion space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className={`faq-item overflow-hidden rounded-xl border-2 backdrop-blur-md transition-all duration-300 ${
                  isOpen
                    ? "border-paper/40 bg-ink shadow-[8px_8px_0px_rgba(0,0,0,0.9)]"
                    : "border-paper/15 bg-ink/75 hover:border-paper/35 hover:bg-ink"
                }`}
                style={{
                  borderLeftColor: isOpen ? faq.accent : undefined,
                  borderLeftWidth: isOpen ? "4px" : "2px",
                }}
              >
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left focus:outline-none md:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="hidden font-mono text-[0.625rem] font-bold uppercase tracking-wider sm:inline-block"
                      style={{ color: faq.accent }}
                    >
                      [{faq.category}]
                    </span>
                    <h3 className="text-base font-bold text-paper transition-colors duration-200 hover:text-white md:text-lg">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Comic Toggle Icon */}
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-black font-mono text-sm font-black transition-transform duration-300 ${
                      isOpen
                        ? "rotate-45 bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                        : "bg-paper/10 text-paper"
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Accordion Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-paper/10 p-6 pt-4 text-sm leading-relaxed text-muted md:p-7 md:pt-4 md:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
