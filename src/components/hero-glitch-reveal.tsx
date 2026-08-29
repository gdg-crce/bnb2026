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
const IMG_ASPECT = 1920 / 1080;

/**
 * Spider-Verse Authentic Fluid Dimension Tear Reveal
 *
 * Features:
 *  - 100% Smooth Organic Liquid Spline: 8-point quadratic Bezier closed spline with
 *    lively surface tension waves and zero-lag direct cursor tracking.
 *  - Dynamic 1:1 Aspect-Locked Billboard Illumination: Matches the exact `object-cover`
 *    crop and bounding box of `herobg.png` across all screen resolutions.
 *  - High-Intensity Animated Billboard Lighting: Authentic neon tube flickers, holographic sweeps,
 *    and marquee pulses matched directly to every sign across Times Square (Zero red lights).
 *  - Gritty Noir Spider-Verse Dimension Styling inside the liquid tear.
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

  // Dynamic Image Cover Rect (guarantees pixel-perfect billboard alignment across all screen sizes)
  const [coverRect, setCoverRect] = useState({ width: 0, height: 0, left: 0, top: 0 });

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

  /* ── Measure exact object-cover image coordinates ── */
  useEffect(() => {
    const updateRect = () => {
      const el = containerRef.current;
      if (!el) return;
      const cw = el.offsetWidth;
      const ch = el.offsetHeight;
      if (cw === 0 || ch === 0) return;

      const containerAspect = cw / ch;
      let w = cw;
      let h = ch;
      let l = 0;
      let t = 0;

      if (containerAspect > IMG_ASPECT) {
        // Wider than 16:9 — fit width, crop top/bottom
        w = cw;
        h = cw / IMG_ASPECT;
        t = (ch - h) / 2;
        l = 0;
      } else {
        // Taller than 16:9 — fit height, crop left/right
        h = ch;
        w = ch * IMG_ASPECT;
        l = (cw - w) / 2;
        t = 0;
      }

      setCoverRect({ width: w, height: h, left: l, top: t });
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    const ro = new ResizeObserver(updateRect);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateRect);
      ro.disconnect();
    };
  }, []);

  // Build quadratic smooth spline string from N points
  const computeSpline = useCallback(
    (cx: number, cy: number, scale: number, time: number, vx: number, vy: number, offsetX = 0, offsetY = 0) => {
      const pts: { x: number; y: number }[] = [];
      const speed = Math.hypot(vx, vy);
      const moveAngle = Math.atan2(vy, vx);

      for (let i = 0; i < NUM_POINTS; i++) {
        const angle = (i * 2 * Math.PI) / NUM_POINTS;

        // Lively undulating liquid surface harmonic waves (fluid motion, stable center)
        const wave =
          Math.sin(time * 3.2 + i * 1.8) * 20 +
          Math.cos(time * 2.5 + i * 2.6) * 15 +
          Math.sin(time * 4.0 + i * 3.2) * 8;

        // Fluid teardrop stretch along velocity vector
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

  /* ── Liquid Physics & RAF Animation Loop (Buttery Smooth Organic Motion) ── */
  const tick = useCallback(() => {
    timeRef.current += 0.024;

    // High-responsiveness smooth liquid lerp (buttery smooth with zero jitter)
    const k = 0.32;
    const dx = target.current.x - current.current.x;
    const dy = target.current.y - current.current.y;
    current.current.x += dx * k;
    current.current.y += dy * k;

    // Fluid surface tension velocity damping
    velocity.current.vx = velocity.current.vx * 0.78 + dx * 0.22;
    velocity.current.vy = velocity.current.vy * 0.78 + dy * 0.22;

    // Smooth expansion & collapse
    const scaleK = 0.14;
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

    const isIdle = !isHovered.current && currentScale.current < 0.005;

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
        current.current = { x, y };
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
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="pointer-events-none h-full w-full object-cover object-center"
          style={{
            filter: "brightness(1.18) contrast(1.15) saturate(1.32)",
          }}
        />

        {/* ── Dynamically Scaled & Pixel-Aligned Billboard Lighting Container ── */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: `${coverRect.width || 1920}px`,
            height: `${coverRect.height || 1080}px`,
            left: `${coverRect.left}px`,
            top: `${coverRect.top}px`,
          }}
        >
          {/* 1. Left "WANTED" Billboard High-Intensity Bloom */}
          <div
            className="billboard-wanted absolute rounded-sm blur-md"
            style={{ left: "2.2%", top: "7%", width: "9.2%", height: "33%" }}
          />

          {/* 2. Left Magenta "SOPTI..." Vertical Sign (Animated Tube Pulse) */}
          <div
            className="billboard-magenta-neon absolute rounded-sm blur-md"
            style={{ left: "11.2%", top: "17%", width: "9.8%", height: "25.5%" }}
          />

          {/* 3. Left Green Glitch / Spider-Man Billboard (Animated Cyber Pulse) */}
          <div
            className="billboard-green-spidey absolute rounded-sm blur-md"
            style={{ left: "20.6%", top: "4.5%", width: "7.2%", height: "22%" }}
          />

          {/* 4. Left Lower Cyan Shop Marquee ("LABOR...") */}
          <div
            className="billboard-cyan-shop absolute rounded-sm blur-md"
            style={{ left: "19.2%", top: "27.5%", width: "8.2%", height: "17%" }}
          />

          {/* 5. Left Lower Storefront "DUE..." */}
          <div
            className="absolute rounded-sm blur-lg"
            style={{
              left: "8.2%",
              top: "53.5%",
              width: "9.8%",
              height: "13%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(255, 0, 187, 0.55) 0%, rgba(0, 240, 255, 0.38) 50%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 6. Center Top Spire Beacon Beam */}
          <div
            className="absolute rounded-full blur-xl"
            style={{
              left: "47.8%",
              top: "0%",
              width: "4.4%",
              height: "15%",
              background: "radial-gradient(ellipse at 50% 10%, rgba(0, 240, 255, 0.6) 0%, transparent 80%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 7. Center Top Daily Bugle Marquee Sign (Animated Golden Pulse) */}
          <div
            className="billboard-daily-bugle absolute rounded-sm blur-md"
            style={{ left: "44.1%", top: "18.2%", width: "6%", height: "6.8%" }}
          />

          {/* 8. Center Blue Spidey Hologram Billboard (Animated Scanline Sweep) */}
          <div
            className="billboard-blue-hologram absolute rounded-sm blur-md"
            style={{ left: "45.2%", top: "37.8%", width: "5.6%", height: "16.5%" }}
          />

          {/* 9. Center-Right Character Portrait Billboard */}
          <div
            className="billboard-right-portrait absolute rounded-sm blur-md"
            style={{ left: "70.5%", top: "11%", width: "8.8%", height: "18.5%" }}
          />

          {/* 10. Center-Right Lower "VOL 7..." Neon Billboard */}
          <div
            className="absolute rounded-sm blur-md"
            style={{
              left: "70.8%",
              top: "33.5%",
              width: "8.5%",
              height: "17%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(0, 240, 255, 0.5) 0%, rgba(229, 48, 140, 0.4) 50%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 11. Right Tall Yellow Billboard (Animated Sunburst) */}
          <div
            className="billboard-yellow-tower absolute rounded-sm blur-lg"
            style={{ left: "79.2%", top: "0%", width: "7.6%", height: "56%" }}
          />

          {/* 12. Right "SMASH HIT! Hulu" Comic Burst Billboard (Animated Flash) */}
          <div
            className="billboard-smash-hit absolute rounded-sm blur-md"
            style={{ left: "86.8%", top: "3.5%", width: "12.2%", height: "36%" }}
          />

          {/* 13. Right Lower Storefront Neon Marquees */}
          <div
            className="absolute rounded-sm blur-lg"
            style={{
              left: "74%",
              top: "53%",
              width: "24%",
              height: "12%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(255, 230, 0, 0.55) 0%, rgba(255, 0, 119, 0.45) 48%, transparent 75%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 14. Wet Rainy Asphalt Street Reflections */}
          <div
            className="times-square-rain-reflections absolute inset-x-0 bottom-0 blur-xl"
            style={{
              top: "66%",
              height: "34%",
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(0, 240, 255, 0.38) 0%, rgba(255, 0, 180, 0.32) 38%, rgba(255, 220, 0, 0.24) 65%, transparent 92%)",
              mixBlendMode: "screen",
            }}
          />

          {/* 15. Subtle Horizontal Anamorphic Neon Glints */}
          <div
            className="absolute h-[2px] rounded-full blur-[2px]"
            style={{
              left: "10%",
              top: "22%",
              width: "32%",
              background: "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.95), transparent)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute h-[2px] rounded-full blur-[2px]"
            style={{
              left: "76%",
              top: "14%",
              width: "20%",
              background: "linear-gradient(90deg, transparent, rgba(255, 230, 0, 1), transparent)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>

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
