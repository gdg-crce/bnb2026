"use client";

import Image from "next/image";

export default function PrizesMobileSection() {
  return (
    <section id="prizes" className="md:hidden relative z-10 w-full bg-black py-16 px-4 flex flex-col items-center select-none overflow-hidden -mt-px -mb-px">
      {/* High-Resolution Prizes Title Banner */}
      <div className="relative z-10 w-full max-w-[280px] flex justify-center shrink-0 mb-12">
        <img
          src="/prizestitle.png"
          alt="PRIZES"
          className="w-60 h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
          draggable={false}
        />
      </div>

      {/* Vertical Stack of All 3 Prizes (Each on its own line, Huge Trophies & Comic Boxes) */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-16 pb-8">
        
        {/* ── 1ST PLACE (Grand Winner - ₹50,000) ── */}
        <div className="w-full flex flex-col items-center">
          {/* Big Clean 1st Place Trophy */}
          <div className="relative z-10 h-60 w-full flex items-center justify-center">
            <img
              src="/assets/trophy_04_clean.png"
              alt="Grand Winner 1st Place Trophy"
              className="h-full w-auto max-w-full object-contain mx-auto transform-gpu select-none filter drop-shadow-[0_16px_32px_rgba(255,230,0,0.7)]"
              draggable={false}
            />
          </div>

          {/* 1st Place Comic Dialogue Box */}
          <div className="relative z-20 w-full max-w-[300px] bg-[#FFE600] text-black rounded-2xl border-[3px] border-black px-5 py-3.5 flex flex-col items-center text-center shadow-[6px_6px_0px_#000000] -rotate-1 mt-3">
            {/* Comic Speech Pointer pointing up to trophy */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[14px] border-b-black" />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#FFE600]" />

            {/* Ben-Day Halftone Dot Overlay */}
            <span className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:5px_5px] rounded-2xl" />

            <span className="relative z-10 inline-block bg-black text-[#FFE600] font-mono font-black text-xs uppercase px-3 py-1 rounded-md tracking-wider leading-tight">
              ★ 1ST PLACE // GRAND WINNER ★
            </span>
            <div className="relative z-10 font-sans font-black text-4xl text-black tracking-tight leading-none mt-2">
              ₹50,000
            </div>
            <div className="relative z-10 text-[10px] font-mono font-black uppercase text-black/85 mt-1.5 leading-tight">
              &ldquo;THE ULTIMATE BIT N BUILD CHAMPION!&rdquo;
            </div>
          </div>
        </div>

        {/* ── 2ND PLACE (Runner Up - ₹30,000) ── */}
        <div className="w-full flex flex-col items-center">
          {/* Big Clean 2nd Place Trophy */}
          <div className="relative z-10 h-56 w-full flex items-center justify-center">
            <img
              src="/assets/trophy_05_clean.png"
              alt="Runner Up 2nd Place Trophy"
              className="h-full w-auto max-w-full object-contain mx-auto transform-gpu select-none filter drop-shadow-[0_16px_32px_rgba(0,240,255,0.7)]"
              draggable={false}
            />
          </div>

          {/* 2nd Place Comic Dialogue Box */}
          <div className="relative z-20 w-full max-w-[290px] bg-[#00F0FF] text-black rounded-2xl border-[3px] border-black px-5 py-3.5 flex flex-col items-center text-center shadow-[6px_6px_0px_#000000] rotate-1 mt-3">
            {/* Comic Speech Pointer pointing up to trophy */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[14px] border-b-black" />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#00F0FF]" />

            {/* Ben-Day Halftone Dot Overlay */}
            <span className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:5px_5px] rounded-2xl" />

            <span className="relative z-10 inline-block bg-black text-[#00F0FF] font-mono font-black text-xs uppercase px-3 py-1 rounded-md tracking-wider leading-tight">
              ◆ 2ND PLACE // RUNNER UP ◆
            </span>
            <div className="relative z-10 font-sans font-black text-4xl text-black tracking-tight leading-none mt-2">
              ₹30,000
            </div>
            <div className="relative z-10 text-[10px] font-mono font-black uppercase text-black/85 mt-1.5 leading-tight">
              &ldquo;OUTSTANDING MULTIVERSE INNOVATION!&rdquo;
            </div>
          </div>
        </div>

        {/* ── 3RD PLACE (2nd Runner Up - ₹20,000) ── */}
        <div className="w-full flex flex-col items-center">
          {/* Big Clean 3rd Place Trophy */}
          <div className="relative z-10 h-56 w-full flex items-center justify-center">
            <img
              src="/assets/trophy_03_clean.png"
              alt="2nd Runner Up 3rd Place Trophy"
              className="h-full w-auto max-w-full object-contain mx-auto transform-gpu select-none filter drop-shadow-[0_16px_32px_rgba(255,0,85,0.7)]"
              draggable={false}
            />
          </div>

          {/* 3rd Place Comic Dialogue Box */}
          <div className="relative z-20 w-full max-w-[290px] bg-[#FF0055] text-white rounded-2xl border-[3px] border-black px-5 py-3.5 flex flex-col items-center text-center shadow-[6px_6px_0px_#000000] -rotate-1 mt-3">
            {/* Comic Speech Pointer pointing up to trophy */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[14px] border-b-black" />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[12px] border-b-[#FF0055]" />

            {/* Ben-Day Halftone Dot Overlay */}
            <span className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:5px_5px] rounded-2xl" />

            <span className="relative z-10 inline-block bg-black text-[#FF0055] font-mono font-black text-xs uppercase px-3 py-1 rounded-md tracking-wider leading-tight">
              ▲ 3RD PLACE // 2ND RUNNER UP ▲
            </span>
            <div className="relative z-10 font-sans font-black text-4xl text-white tracking-tight leading-none mt-2 drop-shadow-[2px_2px_0px_#000]">
              ₹20,000
            </div>
            <div className="relative z-10 text-[10px] font-mono font-black uppercase text-white/95 mt-1.5 leading-tight">
              &ldquo;EXCEPTIONAL TECHNICAL CRAFT!&rdquo;
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
