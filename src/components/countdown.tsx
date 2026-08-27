"use client";

import { Fragment, useEffect, useState } from "react";
import { EVENT, EVENT_START_MS } from "@/lib/event";
import WebDial from "@/components/web-dial";

type Column = { value: string; label: string; short: string };

type Clock = {
  columns: Column[];
  /** Fractions of the current minute and hour, for the dial's two hands. */
  seconds: number;
  minutes: number;
};

const PLACEHOLDER: Clock = {
  columns: [
    { value: "--", label: "Hours", short: "Hrs" },
    { value: "--", label: "Minutes", short: "Min" },
    { value: "--", label: "Seconds", short: "Sec" },
  ],
  seconds: 0,
  minutes: 0,
};

/**
 * Hours deliberately run past 24 rather than always rolling into a days
 * column — a hackathon is counted in hours, and "62:14:09" says more about the
 * shape of the weekend than "2 days" does. A days column only appears when
 * hours alone would need three digits, which keeps every column two wide so
 * the row never resizes under itself as the clock runs down.
 */
function read(remaining: number): Clock {
  const total = Math.max(0, Math.floor(remaining / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");

  const seconds = total % 60;
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600);

  const tail = [
    { value: pad(minutes), label: "Minutes", short: "Min" },
    { value: pad(seconds), label: "Seconds", short: "Sec" },
  ];

  const columns =
    hours < 100
      ? [{ value: pad(hours), label: "Hours", short: "Hrs" }, ...tail]
      : [
          { value: pad(Math.floor(hours / 24)), label: "Days", short: "Days" },
          { value: pad(hours % 24), label: "Hours", short: "Hrs" },
          ...tail,
        ];

  return { columns, seconds, minutes };
}

function useCountdown(): Clock | null {
  // Null until mounted. The server has no "now", so rendering a real figure
  // during SSR guarantees a hydration mismatch a second later.
  const [clock, setClock] = useState<Clock | null>(null);

  useEffect(() => {
    const tick = () => setClock(read(EVENT_START_MS - Date.now()));
    tick();

    // Realign to the wall clock every tick. A bare 1000ms interval drifts, and
    // a drifted clock visibly skips a second every minute or so.
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          tick();
          schedule();
        },
        1000 - (Date.now() % 1000),
      );
    };
    schedule();

    return () => clearTimeout(timer);
  }, []);

  return clock;
}

export default function Countdown() {
  const clock = useCountdown();
  const { columns, seconds, minutes } = clock ?? PLACEHOLDER;

  return (
    <div className="countdown relative flex w-full flex-col items-center">
      <div
        aria-hidden="true"
        className="countdown-halo pointer-events-none absolute -inset-x-[20%] -inset-y-[35%] -z-10 opacity-40"
      />

      <span className="eyebrow">{EVENT.DURATION_HOURS} hours of building</span>

      {/* No rule between the label and the digits: the web already supplies
          the structure, and a red hairline next to a red second hand is two
          accents doing one job. */}
      <div className="relative mt-12 md:mt-16">
        <WebDial seconds={seconds} minutes={minutes} />

        <div
          className="relative flex items-stretch justify-center"
          role="timer"
          aria-live="off"
          aria-label={
            clock
              ? `${columns.map((c) => `${c.value} ${c.label.toLowerCase()}`).join(", ")} until bitNbuild begins`
              : "Counting down to bitNbuild"
          }
        >
          {columns.map((column, index) => (
            <Fragment key={column.label}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-4 w-px self-stretch bg-paper/15 sm:mx-6 md:mx-8"
                />
              )}
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <span
                  className="font-mono text-[clamp(2.25rem,8.5vw,5rem)] leading-none font-medium text-paper"
                  // Locks the glyph advance so digits sit still while they change.
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {column.value}
                </span>
                {/* Full words need more room than a two-digit column gives on
                    a phone; the abbreviations keep every label inside its own
                    column instead of colliding with the next one. */}
                <span className="eyebrow text-[0.5625rem] whitespace-nowrap md:text-[0.625rem]">
                  <span className="sm:hidden">{column.short}</span>
                  <span className="hidden sm:inline">{column.label}</span>
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
