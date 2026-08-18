/*
 * Geometry for an orb web, generated once at module load — none of it depends
 * on state, so there is nothing to recompute per render.
 *
 * Real webs are not concentric circles: the spiral strands hang in shallow
 * catenaries between the radial spokes. Drawing them as straight-sided polygons
 * looks like a wireframe and drawing them as true circles looks like a target,
 * so each span is a quadratic with its control point pulled slightly inward.
 * That sag is the entire difference between "web" and "dial".
 *
 * Everything is expressed in a 210-unit square centred on the origin, so the
 * SVG can be scaled to any size by its container.
 */

const SPOKE_COUNT = 16;
/** Radii of the spiral strands, outermost last. */
/* Spacing tightens toward the rim, the way a real spiral does. */
const RING_RADII = [34, 46, 58, 70, 81, 91, 100];
/** Spokes stop short of the centre, leaving a void for the numerals. */
const SPOKE_INNER = 20;
/** How far each span is pulled toward the centre. 1 would be a plain circle. */
const SAG = 0.9;

export const VIEW_BOX = "-105 -105 210 210";

/** Angles run from twelve o'clock and increase clockwise (SVG y points down). */
function point(radius: number, index: number, offset = 0) {
  const angle = ((index + offset) / SPOKE_COUNT) * Math.PI * 2 - Math.PI / 2;
  return [radius * Math.cos(angle), radius * Math.sin(angle)] as const;
}

const round = (n: number) => Math.round(n * 100) / 100;

function ring(radius: number) {
  const [sx, sy] = point(radius, 0);
  let d = `M ${round(sx)} ${round(sy)}`;

  for (let i = 1; i <= SPOKE_COUNT; i += 1) {
    const [cx, cy] = point(radius * SAG, i, -0.5);
    const [x, y] = point(radius, i);
    d += ` Q ${round(cx)} ${round(cy)} ${round(x)} ${round(y)}`;
  }

  return `${d} Z`;
}

export const RINGS = RING_RADII.map(ring);

export const SPOKES = Array.from({ length: SPOKE_COUNT }, (_, i) => {
  const [x1, y1] = point(SPOKE_INNER, i);
  const [x2, y2] = point(RING_RADII[RING_RADII.length - 1], i);
  return `M ${round(x1)} ${round(y1)} L ${round(x2)} ${round(y2)}`;
});

/** The two strands that carry a hand, outermost first. */
export const SECONDS_RING = RINGS[RINGS.length - 1];
export const MINUTES_RING = RINGS[3];
