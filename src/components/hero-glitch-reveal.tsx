"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";

interface HeroGlitchRevealProps {
  src: StaticImageData | string;
  alt?: string;
  priority?: boolean;
  className?: string;
  revealSize?: number;
}

const NUM_POINTS = 8;

/**
 * Spider-Verse Authentic Fluid Dimension Tear Reveal
 *
 * Architecture:
 *  - 100% Smooth Organic Liquid Spline: Computes an 8-point quadratic Bezier
 *    closed spline in real time with liquid surface tension and velocity teardrop stretch.
 *  - SVG ClipPath: Clips the full-resolution layer with zero subpixel blur or raster scaling.
 *  - Spider-Verse Alternate Dimension Styling: Gritty noir comic grading (deep ink shadows,
 *    rich midtones, no blown-out white flash), cyan & magenta misregistered fluid boundary strokes,
 *    and comic halftone print overlay.
 */
export default function HeroGlitchReveal({
  src,
  alt = "",
  priority = true,
  className = "",
  revealSize = 260,
}: HeroGlitchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cyanPathRef = useRef<SVGPathElement>(null);
  const magentaPathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);

  // Liquid spring & physics state
  const target = useRef({ x: -500, y: -500 });
  const current = useRef({ x: -500, y: -500 });
  const velocity = useRef({ vx: 0, vy: 0, speed: 0 });
  const currentScale = useRef(0);
  const targetScale = useRef(0);
  const isHovered = useRef(false);
  const timeRef = useRef(0);

  const [isActive, setIsActive] = useState(false);

  const baseRadius = revealSize / 2;

  // Build quadratic smooth spline string from N points
  const computeSpline = useCallback(
    (cx: number, cy: number, scale: number, time: number, vx: number, vy: number, offsetX = 0, offsetY = 0) => {
      const pts: { x: number; y: number }[] = [];
      const speed = Math.hypot(vx, vy);
      const moveAngle = Math.atan2(vy, vx);

      for (let i = 0; i < NUM_POINTS; i++) {
        const angle = (i * 2 * Math.PI) / NUM_POINTS;

        // Organic undulating liquid surface harmonic waves
        const wave =
          Math.sin(time * 2.2 + i * 1.5) * 14 +
          Math.cos(time * 1.8 + i * 2.4) * 10 +
          Math.sin(time * 3.1 + i * 3.1) * 6;

        // Fluid teardrop stretch along velocity vector (trailing points extend, leading points round)
        const dot = Math.cos(angle - moveAngle);
        const velocityStretch = -dot * Math.min(speed * 0.45, 45);

        const r = Math.max(10, (baseRadius + wave + velocityStretch) * scale);
        pts.push({
          x: cx + offsetX + Math.cos(angle) * r,
          y: cy + offsetY + Math.sin(angle) * r,
        });
      }

      if (pts.length < 3) return "";

      // Quadratic Bezier through midpoints for guaranteed C1 liquid continuity
      const midpoints = pts.map((p, i) => {
        const next = pts[(i + 1) % NUM_POINTS];
        return {
          x: (p.x + next.x) / 2,
          y: (p.y + next.y) / 2,
        };
      });

      let d = `M ${midpoints[0].x.toFixed(1)} ${midpoints[0].y.toFixed(1)} `;
      for (let i = 0; i < NUM_POINTS; i++) {
        const nextIdx = (i + 1) % NUM_POINTS;
        d += `Q ${pts[nextIdx].x.toFixed(1)} ${pts[nextIdx].y.toFixed(1)}, ${midpoints[nextIdx].x.toFixed(1)} ${midpoints[nextIdx].y.toFixed(1)} `;
      }
      d += "Z";
      return d;
    },
    [baseRadius],
  );

  /* ── Liquid Physics & RAF Animation Loop ── */
  const tick = useCallback(() => {
    timeRef.current += 0.025;

    // Spring lerp cursor tracking
    const k = 0.14;
    const dx = target.current.x - current.current.x;
    const dy = target.current.y - current.current.y;
    current.current.x += dx * k;
    current.current.y += dy * k;

    // Velocity tracking for fluid stretch
    velocity.current.vx = velocity.current.vx * 0.8 + dx * 0.2;
    velocity.current.vy = velocity.current.vy * 0.8 + dy * 0.2;

    // Smooth expansion & collapse
    const scaleK = 0.12;
    currentScale.current += (targetScale.current - currentScale.current) * scaleK;

    const scale = currentScale.current;
    const cx = current.current.x;
    const cy = current.current.y;
    const time = timeRef.current;
    const vx = velocity.current.vx;
    const vy = velocity.current.vy;

    // Update main liquid mask path
    if (pathRef.current) {
      const d = computeSpline(cx, cy, scale, time, vx, vy);
      pathRef.current.setAttribute("d", d);
    }

    // Update Cyan chromatic liquid perimeter stroke (offset top-left)
    if (cyanPathRef.current) {
      const dCyan = computeSpline(cx, cy, scale, time, vx, vy, -3, -1);
      cyanPathRef.current.setAttribute("d", dCyan);
    }

    // Update Magenta chromatic liquid perimeter stroke (offset bottom-right)
    if (magentaPathRef.current) {
      const dMagenta = computeSpline(cx, cy, scale, time, vx, vy, 3, 1);
      magentaPathRef.current.setAttribute("d", dMagenta);
    }

    const isIdle = !isHovered.current && currentScale.current < 0.01;

    if (!isIdle) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      currentScale.current = 0;
      setIsActive(false);
      rafRef.current = null;
    }
  }, [computeSpline]);

  const startLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  /* ── Pointer Event Handlers ── */
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      target.current = { x, y };

      if (!isHovered.current) {
        isHovered.current = true;
        targetScale.current = 1;
        setIsActive(true);
        if (currentScale.current < 0.05) {
          current.current = { x, y };
        }
      }
      startLoop();
    },
    [startLoop],
  );

  const onEnter = useCallback(
    (e: React.PointerEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      target.current = { x, y };
      current.current = { x, y };
      isHovered.current = true;
      targetScale.current = 1;
      setIsActive(true);
      startLoop();
    },
    [startLoop],
  );

  const onLeave = useCallback(() => {
    isHovered.current = false;
    targetScale.current = 0;
    startLoop();
  }, [startLoop]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`relative h-full w-full select-none overflow-hidden ${className}`}
    >
      {/* ── Hidden SVG Liquid Spline ClipPath Definition ── */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="sv-liquid-spline-clip" clipPathUnits="userSpaceOnUse">
            <path ref={pathRef} d="" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Base Color Times Square Visual ── */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="pointer-events-none h-full w-full object-cover object-center"
      />

      {/* ── Spider-Verse Alternate Dimension Liquid Reveal Layer ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
        style={{
          clipPath: "url(#sv-liquid-spline-clip)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        {/* Layer 1: Spider-Verse Gritty Noir Comic Image (Rich Ink Blacks & Paper Tones, No White Blown-Out Glare) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="h-full w-full object-cover object-center"
            style={{
              filter: "grayscale(1) contrast(1.75) brightness(0.78) sepia(0.12)",
            }}
          />
        </div>

        {/* Layer 2: Spider-Verse Multi-Verse Dimension Wash (Cyan & Magenta Comic Gel) */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 240, 255, 0.18) 0%, rgba(13, 11, 24, 0.45) 50%, rgba(255, 0, 85, 0.22) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Layer 3: Cyan Chromatic Channel Shift (Stepped Spider-Verse Twitch) */}
        <div className="sv-glitch-cyan absolute inset-0 h-full w-full opacity-80" style={{ mixBlendMode: "screen" }}>
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="h-full w-full object-cover object-center"
            style={{
              filter: "grayscale(1) contrast(1.8) brightness(0.6) sepia(1) hue-rotate(150deg) saturate(3.5)",
            }}
          />
        </div>

        {/* Layer 4: Magenta Chromatic Channel Shift (Stepped Spider-Verse Twitch) */}
        <div className="sv-glitch-magenta absolute inset-0 h-full w-full opacity-80" style={{ mixBlendMode: "screen" }}>
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="h-full w-full object-cover object-center"
            style={{
              filter: "grayscale(1) contrast(1.8) brightness(0.6) sepia(1) hue-rotate(280deg) saturate(3.5)",
            }}
          />
        </div>

        {/* Layer 5: Ben-Day Comic Print Halftone Shading */}
        <div className="sv-comic-halftone absolute inset-0" />

        {/* Layer 6: Subtle Comic Print Ink Hatch Scanlines */}
        <div className="sv-ink-lines absolute inset-0 opacity-25" />
      </div>

      {/* ── Spider-Verse Chromatic Liquid Perimeter Strokes (Zero Rigid Outlines) ── */}
      <svg
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        style={{
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        {/* Cyan chromatic liquid edge */}
        <path
          ref={cyanPathRef}
          d=""
          fill="none"
          stroke="#00F0FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
        />
        {/* Magenta chromatic liquid edge */}
        <path
          ref={magentaPathRef}
          d=""
          fill="none"
          stroke="#FF0055"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75 drop-shadow-[0_0_8px_rgba(255,0,85,0.7)]"
        />
      </svg>
    </div>
  );
}
