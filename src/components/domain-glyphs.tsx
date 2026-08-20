/*
 * One line-drawn glyph per domain, on a shared 48-unit square.
 *
 * They are drawn rather than illustrated, and they are drawn to one spec —
 * same box, same 1.5 stroke, same round joins, no fill — so the three read as
 * a set. The reference site used emoji here, which is why its three cards
 * never sat on the same baseline or the same weight.
 *
 * `currentColor` throughout: the panel tints them on hover by changing one
 * colour, and nothing in here needs to know which domain it belongs to.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className="h-12 w-12"
      {...STROKE}
    >
      {children}
    </svg>
  );
}

/** A window with its chrome, and code inside it. */
export function WebGlyph() {
  return (
    <Frame>
      <rect x="4" y="8" width="40" height="32" rx="3.5" />
      <path d="M4 17.5h40" />
      <path d="M9 12.75h.01M14 12.75h.01M19 12.75h.01" strokeWidth="2.4" />
      <path d="M19.5 24.5 14.5 29.5l5 5" />
      <path d="M28.5 24.5l5 5-5 5" />
    </Frame>
  );
}

/** Three blocks and the links between them — a chain, not a coin. */
export function ChainGlyph() {
  return (
    <Frame>
      <rect x="18" y="5" width="12" height="12" rx="2.5" />
      <rect x="4" y="31" width="12" height="12" rx="2.5" />
      <rect x="32" y="31" width="12" height="12" rx="2.5" />
      <path d="M21.5 17.2 13.2 30.6" />
      <path d="M26.5 17.2l8.3 13.4" />
      <path d="M16.4 37h15.2" />
    </Frame>
  );
}

/*
 * A three-layer net. The edges are generated rather than typed out: there are
 * eighteen of them, and hand-writing eighteen coordinate pairs is how one ends
 * up subtly wrong and nobody notices.
 */
const LAYERS = [
  { x: 8, ys: [15, 24, 33] },
  { x: 24, ys: [9.5, 19, 29, 38.5] },
  { x: 40, ys: [19, 29] },
];

const EDGES = LAYERS.slice(0, -1).flatMap((layer, i) =>
  layer.ys.flatMap((y) =>
    LAYERS[i + 1].ys.map((ny) => `M${layer.x} ${y}L${LAYERS[i + 1].x} ${ny}`),
  ),
);

export function NeuralGlyph() {
  return (
    <Frame>
      <g strokeWidth="0.8" opacity="0.55">
        {EDGES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {LAYERS.map((layer) =>
        layer.ys.map((y) => (
          <circle key={`${layer.x}-${y}`} cx={layer.x} cy={y} r="2.6" />
        )),
      )}
    </Frame>
  );
}
