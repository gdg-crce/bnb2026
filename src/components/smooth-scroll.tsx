"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Owns the page's scroll position. Lenis interpolates it, GSAP animates off it,
 * and both run on a single rAF loop so they can never drift apart.
 *
 * Anything that needs the instance can call `useLenis()` from `lenis/react`
 * (e.g. `lenis.stop()` when a modal opens, `lenis.scrollTo(el)` for nav links).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Prevent right-click "Open image in new tab", "Save as", and dragging across all images and media
  useEffect(() => {
    const preventImageAction = (e: MouseEvent | DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "IMG" ||
          target.tagName === "VIDEO" ||
          target.tagName === "CANVAS" ||
          target.closest("img") ||
          target.closest("video") ||
          target.closest("canvas"))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventImageAction, { capture: true });
    document.addEventListener("dragstart", preventImageAction, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", preventImageAction, { capture: true });
      document.removeEventListener("dragstart", preventImageAction, { capture: true });
    };
  }, []);

  const options = useMemo(
    () => ({
      // Frame-rate independent in Lenis 1.3, so this feels identical at 60 and
      // 144Hz. Lower = heavier//slower glide, higher = snappier. 0.1 is the
      // common house setting; use `lerp` OR `duration`, never both.
      lerp: 0.1,
      smoothWheel: !reducedMotion,
      // Leave native touch scrolling alone. Interpolating touch adds a frame of
      // lag against the user's finger, which reads as "broken" on phones.
      syncTouch: false,
      wheelMultiplier: 1,
      // Smooth-scroll `#hash` links instead of letting the browser jump.
      anchors: true,
      // We drive raf from the GSAP ticker below.
      autoRaf: false,
    }),
    [reducedMotion],
  );

  // One rAF loop for the whole app. Letting Lenis run its own loop alongside
  // GSAP's means the two read the scroll position on different frames, which
  // is what causes ScrollTrigger animations to lag a pixel behind the page.
  useEffect(() => {
    const update = (time: number) => {
      // GSAP ticker reports seconds, Lenis expects milliseconds.
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    // GSAP normally throttles after a long frame to avoid animation jumps.
    // Here that would desync it from Lenis, so disable it.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  // ScrollTrigger must read Lenis' interpolated position, not the native
  // scroll event, or triggers fire against the wrong scrollTop.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // Webfonts land after hydration and reflow the page, invalidating every
  // trigger's start/end. Recalculate once they're in.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // A client-side navigation swaps the whole document height without a reload.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip on mount so deep links to #anchors aren't yanked to the top.
      isFirstRender.current = false;
      return;
    }
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <ReactLenis root ref={lenisRef} options={options}>
      {children}
    </ReactLenis>
  );
}
