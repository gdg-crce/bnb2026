"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Permanent_Marker } from "next/font/google";
import { EVENT_START_MS } from "@/lib/event";
import pipemImg from "../../public/pipem.png";
import textsImg from "../../public/texts-pipe.png";

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
});

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const PLACEHOLDER: TimeLeft = {
  days: "--",
  hours: "--",
  minutes: "--",
  seconds: "--",
};

function getTimeLeft(): TimeLeft {
  const pad = (n: number) => String(n).padStart(2, "0");
  const diff = EVENT_START_MS - Date.now();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

/**
 * Pipes Transition Section:
 * Full-vibrant undimmed pipem.png connecting Hero to About,
 * with texts-pipe.png and real-time DAYS, HOURS, MINUTES, SECONDS digits
 * aligned directly over each corresponding label.
 */
export default function PipesSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(PLACEHOLDER);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft());
    tick();

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        tick();
        schedule();
      }, 1000 - (Date.now() % 1000));
    };
    schedule();

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative z-10 w-full overflow-hidden bg-black">
      <h2 className="sr-only">Multiverse Conduit Countdown Transition</h2>

      {/* Pipem Background Image defining the exact section height */}
      <div className="relative w-full overflow-hidden flex items-center justify-center">
        <Image
          src={pipemImg}
          alt="Multiverse Conduit Pipes Transition"
          priority
          sizes="100vw"
          className="h-auto w-full block select-none"
        />

        {/* Texts Graphic & Live Digits Container (1:1 with pipem.png, shifted cleanly downwards) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center translate-y-[6%]">
          <div className="relative w-full h-full">
            {/* Base Texts Graphic ("EVENT BEGINS IN", "DAYS", "HOURS", "MINUTES", "SECONDS") */}
            <Image
              src={textsImg}
              alt="Event Begins In"
              priority
              sizes="100vw"
              className="h-full w-full block select-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
            />

            {/* Live Countdown Digits Placed In Exact Vertical Line With 'EVENT BEGINS IN' */}
            <div className="absolute inset-0 select-none">
              {/* DAYS Digit - Center: 52.0%, Vertical Center: 31.5% */}
              <div
                className="absolute top-[31.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: "52.0%" }}
              >
                <span
                  className={`${marker.className} font-bold text-white text-[clamp(0.85rem,4.8vw,3.6rem)] leading-none tracking-tight`}
                  style={{
                    WebkitTextStroke: "1.5px #000000",
                    textShadow:
                      "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 4px 14px rgba(0,0,0,0.95)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timeLeft.days}
                </span>
              </div>

              {/* HOURS Digit - Center: 62.1%, Vertical Center: 31.5% */}
              <div
                className="absolute top-[31.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: "62.1%" }}
              >
                <span
                  className={`${marker.className} font-bold text-white text-[clamp(0.85rem,4.8vw,3.6rem)] leading-none tracking-tight`}
                  style={{
                    WebkitTextStroke: "1.5px #000000",
                    textShadow:
                      "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 4px 14px rgba(0,0,0,0.95)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timeLeft.hours}
                </span>
              </div>

              {/* MINUTES Digit - Center: 72.9%, Vertical Center: 31.5% */}
              <div
                className="absolute top-[31.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: "72.9%" }}
              >
                <span
                  className={`${marker.className} font-bold text-white text-[clamp(0.85rem,4.8vw,3.6rem)] leading-none tracking-tight`}
                  style={{
                    WebkitTextStroke: "1.5px #000000",
                    textShadow:
                      "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 4px 14px rgba(0,0,0,0.95)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timeLeft.minutes}
                </span>
              </div>

              {/* SECONDS Digit - Center: 84.8%, Vertical Center: 31.5% */}
              <div
                className="absolute top-[31.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ left: "84.8%" }}
              >
                <span
                  className={`${marker.className} font-bold text-white text-[clamp(0.85rem,4.8vw,3.6rem)] leading-none tracking-tight`}
                  style={{
                    WebkitTextStroke: "1.5px #000000",
                    textShadow:
                      "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0 4px 14px rgba(0,0,0,0.95)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timeLeft.seconds}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
