import {
  MINUTES_RING,
  RINGS,
  SECONDS_RING,
  SPOKES,
  VIEW_BOX,
} from "@/lib/orb-web";

/**
 * The countdown's backdrop: an orb web that is also the clock face.
 *
 * A clock is radial and a web is radial, which is the only reason this belongs
 * here — it is a dial that happens to be built the way a web is, rather than a
 * web stuck on for the theme. The strands sit at low opacity and hold two
 * hands: the outermost carries the seconds, one strand in carries the minutes.
 *
 * Both hands are drawn by normalising a strand to `pathLength={1}` and dashing
 * it, so their positions are exact arithmetic on the fraction elapsed rather
 * than trigonometry. Minutes accumulate as an arc; seconds are a short travelling
 * segment rather than a filling one, because a ring that ends up almost entirely
 * red at 59s is a large red shape, and this needs a single moving accent instead.
 * Both step once a second, the way a mechanical hand does — a smooth sweep would
 * need a frame loop to buy a worse-looking result.
 */
export default function WebDial({
  seconds,
  minutes,
}: {
  seconds: number;
  minutes: number;
}) {
  return (
    <svg
      viewBox={VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      className="web-dial pointer-events-none absolute top-1/2 left-1/2 w-[clamp(26rem,72vw,48rem)] -translate-x-1/2 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <g className="text-paper opacity-[0.1]">
        {SPOKES.map((d) => (
          <path key={d} d={d} strokeWidth={0.35} />
        ))}
        {RINGS.map((d) => (
          <path key={d} d={d} strokeWidth={0.38} />
        ))}
      </g>

      <path
        d={MINUTES_RING}
        className="text-paper opacity-25"
        strokeWidth={0.6}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - minutes / 60}
      />

      <path
        d={SECONDS_RING}
        className="text-red"
        strokeWidth={1.1}
        pathLength={1}
        // A dash of one twelfth followed by the remaining eleven, walked around
        // the rim by the offset: one lit strand, travelling.
        strokeDasharray="0.085 0.915"
        strokeDashoffset={-(seconds / 60)}
      />
    </svg>
  );
}
