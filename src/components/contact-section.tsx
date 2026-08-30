"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, Copy, Check } from "lucide-react";

interface CardItem {
  id: string;
  name: string;
  role: string;
  value: string;
  href: string;
  type: "phone" | "email";
  copyLabel: string;
  accent: string;
}

const CARDS: CardItem[] = [
  {
    id: "shalom",
    name: "SHALOM MENDES",
    role: "VICE CHAIRPERSON",
    value: "+91 75069 69477",
    href: "tel:+917506969477",
    type: "phone",
    copyLabel: "COPY NUMBER",
    accent: "#ff2e88",
  },
  {
    id: "kevin",
    name: "KEVIN SYNET",
    role: "HEAD OF OPERATIONS",
    value: "+91 84468 58648",
    href: "tel:+918446858648",
    type: "phone",
    copyLabel: "COPY NUMBER",
    accent: "#ff2e88",
  },
  {
    id: "laksh",
    name: "LAKSH SHIVALKAR",
    role: "JOINT LEAD",
    value: "+91 99872 56773",
    href: "tel:+919987256773",
    type: "phone",
    copyLabel: "COPY NUMBER",
    accent: "#ff2e88",
  },
  {
    id: "abhishek",
    name: "ABHISHEK JOSE",
    role: "TECHNICAL LEAD",
    value: "+91 77389 69557",
    href: "tel:+917738969557",
    type: "phone",
    copyLabel: "COPY NUMBER",
    accent: "#ff2e88",
  },
  {
    id: "email",
    name: "EMAIL US",
    role: "OFFICIAL INQUIRIES",
    value: "gdgcrce@gmail.com",
    href: "mailto:gdgcrce@gmail.com",
    type: "email",
    copyLabel: "COPY EMAIL",
    accent: "#ff2e88",
  },
];

export default function ContactSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none pt-2 pb-6 sm:py-6"
    >
      <h2 className="sr-only">Contact Us</h2>

      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE CONTACT VIEW (< 768px)                               */}
      {/* ========================================================================= */}
      <div className="md:hidden relative w-full flex flex-col items-center px-4 pt-4 pb-8 z-10">
        {/* Header Title Image - Dead Centered & Clean */}
        <div className="w-full flex items-center justify-center mb-5">
          <img
            src="/contactuslogo.png"
            alt="Contact Us"
            className="w-[80vw] max-w-[330px] h-auto object-contain block mx-auto select-none pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="relative w-full max-w-sm flex flex-col items-center">
          {/* 2-Column Responsive Comic Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {CARDS.map((card) => (
              <div
                key={card.id}
                style={{
                  fontFamily: '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                }}
                className={`relative w-full bg-[#faf8f5] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col items-center text-center p-2.5 select-none ${card.id === "email" ? "col-span-2 max-w-[260px] mx-auto" : ""
                  }`}
              >
                {/* 1. Name */}
                <h4
                  className="font-black text-black text-[12px] uppercase tracking-tight leading-tight mt-0.5"
                  style={{
                    fontFamily: '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                  }}
                >
                  {card.name}
                </h4>

                {/* 2. Role Pill */}
                <div
                  className="mt-1 px-2 py-0.5 rounded-full border border-[#d2d0cc] bg-[#eae8e4] text-[#ff2e88] text-[7.5px] font-bold tracking-widest uppercase leading-none"
                  style={{
                    fontFamily: '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                  }}
                >
                  {card.role}
                </div>

                {/* 3. Pink Underline Bar */}
                <div className="w-8 h-[2px] bg-[#ff2e88] rounded-full mt-1 mb-1.5" />

                {/* 4. Contact Pill Button */}
                <a
                  href={card.href}
                  className="relative w-full bg-white border-[1.5px] border-black rounded-full py-1 px-2 flex items-center justify-center gap-1 shadow-[1px_1px_0px_#000] hover:bg-gray-50 transition-colors mb-1.5"
                >
                  {card.type === "phone" ? (
                    <Phone className="w-2.5 h-2.5 fill-[#ff2e88] text-[#ff2e88] shrink-0" />
                  ) : (
                    <Mail className="w-2.5 h-2.5 text-[#ff2e88] stroke-[2.2] shrink-0" />
                  )}

                  <span
                    className="font-bold text-black text-[9px] tracking-tight truncate max-w-[85%]"
                    style={{
                      fontFamily:
                        '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                    }}
                  >
                    {card.value}
                  </span>
                </a>

                {/* 5. Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(card.value, card.id)}
                  className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 border border-black rounded-full px-2.5 py-0.5 shadow-[1px_1px_0px_#000] cursor-pointer transition-transform active:scale-95"
                >
                  {copiedKey === card.id ? (
                    <>
                      <Check className="w-2 h-2 text-green-600 stroke-[2.5]" />
                      <span
                        className="font-bold text-green-600 text-[7.5px] tracking-wider uppercase"
                        style={{
                          fontFamily:
                            '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                        }}
                      >
                        COPIED!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2 h-2 text-black stroke-[2]" />
                      <span
                        className="font-bold text-black text-[7.5px] tracking-wider uppercase"
                        style={{
                          fontFamily:
                            '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                        }}
                      >
                        {card.copyLabel}
                      </span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP CONTACT SECTION ARTWORK VIEW (>= 768px)                         */}
      {/* ========================================================================= */}
      <div className="hidden md:flex relative w-full aspect-[1366/680] max-w-[1920px] mx-auto overflow-hidden items-center justify-center">
        {/* Background Graphic */}
        <Image
          src="/contactus/contactusbg.png"
          alt="Contact Us Background"
          fill
          priority={false}
          sizes="100vw"
          className="w-full h-full object-cover object-top select-none pointer-events-none"
          draggable={false}
        />

        {/* Contact Cards arranged in grid */}
        <div
          className="absolute z-10 grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3"
          style={{
            left: "4%",
            width: "44%",
            bottom: "8%",
          }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`relative w-full bg-[#faf8f5] rounded-[10px] sm:rounded-[14px] border-[1.5px] sm:border-[2px] border-black shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] flex flex-col items-center text-center p-1.5 sm:p-2 md:p-2.5 select-none transition-transform duration-200 hover:scale-[1.02] ${card.id === "email" ? "col-span-2 max-w-[280px] mx-auto" : ""
                }`}
            >
              {/* 1. Name */}
              <h3 className="font-black text-black text-[clamp(11px,1.45vw,20px)] uppercase tracking-tight leading-none font-sans mt-0.5">
                {card.name}
              </h3>

              {/* 2. Role Pill */}
              <div className="mt-1 px-2.5 sm:px-3.5 py-0.5 rounded-full border border-[#d2d0cc] bg-[#eae8e4] text-[#ff2e88] text-[clamp(5.5px,0.65vw,9.5px)] font-bold tracking-[0.14em] uppercase leading-none">
                {card.role}
              </div>

              {/* 3. Pink Underline Bar */}
              <div className="w-10 sm:w-14 h-[2px] sm:h-[2.5px] bg-[#ff2e88] rounded-full mt-1 mb-1.5" />

              {/* 4. Contact Pill Button */}
              <a
                href={card.href}
                className="relative w-[94%] sm:w-[90%] bg-white border-[1.5px] sm:border-[2px] border-black rounded-full py-0.5 sm:py-1 px-3 flex items-center justify-center gap-1.5 sm:gap-2 shadow-[1px_1px_0px_#000] hover:bg-gray-50 transition-colors mb-1"
              >
                {/* Icon */}
                {card.type === "phone" ? (
                  <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#ff2e88] text-[#ff2e88] shrink-0" />
                ) : (
                  <Mail className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#ff2e88] stroke-[2.2] shrink-0" />
                )}

                {/* Value in Comic Sans */}
                <span
                  className="font-bold text-black text-[clamp(7px,0.92vw,13px)] tracking-tight truncate max-w-full"
                  style={{
                    fontFamily:
                      '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                  }}
                >
                  {card.value}
                </span>
              </a>

              {/* 5. Copy Pill Button */}
              <button
                type="button"
                onClick={() => handleCopy(card.value, card.id)}
                className="inline-flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-gray-50 border-[1.5px] border-black rounded-full px-2.5 sm:px-3 py-0.5 shadow-[1px_1px_0px_#000] cursor-pointer transition-transform active:scale-95"
              >
                {copiedKey === card.id ? (
                  <>
                    <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-600 stroke-[2.5]" />
                    <span
                      className="font-bold text-green-600 text-[clamp(5.5px,0.65vw,9px)] tracking-wider uppercase"
                      style={{
                        fontFamily:
                          '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                      }}
                    >
                      COPIED!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-black stroke-[2]" />
                    <span
                      className="font-bold text-black text-[clamp(5.5px,0.65vw,9px)] tracking-wider uppercase"
                      style={{
                        fontFamily:
                          '"Comic Sans MS", "Comic Sans", "Comic Neue", cursive, sans-serif',
                      }}
                    >
                      {card.copyLabel}
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
