"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const FRAME_COUNT = 97;

/**
 * Timeline Section:
 * High-performance, razor-sharp Canvas Frame Scrubber.
 * - Preloads all 97 frames in WebP format
 * - Nearest-frame fallback to ensure zero flicker during rapid scrubbing
 * - Handles Retina / High-DPI displays with exact pixelRatio scaling
 * - Full-screen 'object-fit: cover' canvas rendering for total immersion
 * - Silky smooth GSAP scroll scrubbing with zero text overlays
 * - Plays the entire video sequence from frame 1 to frame 97
 * - Uses native CSS sticky pinning for React 19 safety
 */
export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<{ index: number }>({ index: 0 });

  useEffect(() => {
    // Preload all 97 frames into memory
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/timeline-frames/frame_${paddedIndex}.webp`;
      images.push(img);
    }
    imagesRef.current = images;

    // Draw the first frame immediately when ready
    if (images[0]) {
      images[0].onload = () => {
        drawFrame(0);
      };
      if (images[0].complete) {
        drawFrame(0);
      }
    }
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const safeIndex = Math.min(Math.max(Math.round(index), 0), FRAME_COUNT - 1);
    let activeImg = imagesRef.current[safeIndex];

    // If active image is not yet loaded, find nearest loaded frame so canvas never flickers
    if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) {
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = imagesRef.current[safeIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          activeImg = prev;
          break;
        }
        const next = imagesRef.current[safeIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          activeImg = next;
          break;
        }
      }
    }

    if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const displayWidth = canvas.clientWidth || window.innerWidth;
    const displayHeight = canvas.clientHeight || window.innerHeight;

    // High-DPI canvas backing store for maximum sharpness
    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate exact 'object-fit: cover' geometry
    const imgRatio = activeImg.naturalWidth / activeImg.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(activeImg, offsetX, offsetY, drawWidth, drawHeight);
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const frameObj = currentFrameRef.current;

        gsap.to(frameObj, {
          index: FRAME_COUNT - 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: () => {
              drawFrame(frameObj.index);
            },
          },
        });
      });

      // Handle window resize dynamically to maintain crisp resolution
      const handleResize = () => {
        drawFrame(currentFrameRef.current.index);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative h-[450vh] w-full bg-black"
    >
      <h2 className="sr-only">Timeline</h2>

      {/* Sticky Canvas Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </section>
  );
}
