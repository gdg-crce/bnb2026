/**
 * Single source of truth for the countdown.
 *
 * `START` is what the timer counts down to; `DURATION_HOURS` is the length of
 * the event itself and is only ever displayed as a label. Change these two and
 * the whole page follows.
 */
export const EVENT = {
  /** ISO 8601 with an explicit offset — never rely on the server's timezone. */
  START: "2026-10-31T09:00:00+05:30",
  DURATION_HOURS: 24,
} as const;

export const EVENT_START_MS = Date.parse(EVENT.START);
