/*
 * A quarter web, for the corner of a panel.
 *
 * Same construction as the countdown's orb — radials first, then spans that
 * sag between them — cut to 90° and anchored at the top-right of a 100-unit
 * square. It is a separate module rather than a parameter on `orb-web` because
 * the orb is centred on the origin and this is not; sharing the geometry would
 * mean threading an anchor through every function to save nothing.
 *
 * Generated once at module load. None of it depends on state.
 */

/** Angles across the quarter, as fractions of 90°. Unevenly spaced on purpose:
 *  a real web's spokes are not laid out with a protractor. */
const ANCHORS = [0, 0.22, 0.46, 0.71, 1].map((t) => (t * Math.PI) / 2);
const RADII = [30, 57, 84];
/** How far each span is pulled toward the corner. 1 would be a plain arc. */
const SAG = 0.9;

export const CORNER_VIEW_BOX = "0 0 100 100";

/** Angle 0 runs straight down the right edge and sweeps to the left edge. */
function point(radius: number, angle: number) {
  return [100 - radius * Math.sin(angle), radius * Math.cos(angle)] as const;
}

const round = (n: number) => Math.round(n * 100) / 100;

export const CORNER_SPOKES = ANCHORS.map((angle) => {
  const [x, y] = point(RADII[RADII.length - 1], angle);
  return `M 100 0 L ${round(x)} ${round(y)}`;
});

export const CORNER_SPANS = RADII.map((radius) => {
  const [sx, sy] = point(radius, ANCHORS[0]);
  let d = `M ${round(sx)} ${round(sy)}`;

  for (let i = 1; i < ANCHORS.length; i += 1) {
    const mid = (ANCHORS[i - 1] + ANCHORS[i]) / 2;
    const [cx, cy] = point(radius * SAG, mid);
    const [x, y] = point(radius, ANCHORS[i]);
    d += ` Q ${round(cx)} ${round(cy)} ${round(x)} ${round(y)}`;
  }

  return d;
});
