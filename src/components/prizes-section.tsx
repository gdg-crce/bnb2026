"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const MARK_SIZE =
  "text-[clamp(3rem,14vw,5.5rem)] md:text-[clamp(3.5rem,8vw,7rem)]";

// WebGL Shaders for Cursor-Guided Organic Blob Mutation
const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  uniform float u_time;
  uniform vec2 u_velocity;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    if (u_intensity <= 0.0001) {
      gl_FragColor = texture2D(u_texture, uv);
      return;
    }
    
    float aspect = u_resolution.x / u_resolution.y;
    vec2 mouseAspect = vec2(u_mouse.x * aspect, u_mouse.y);
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);
    vec2 diff = uvAspect - mouseAspect;
    float dist = length(diff);
    float radius = 0.25;
    
    vec2 centerAspect = vec2(0.5 * aspect, 0.5);
    float distFromCenter = length(uvAspect - centerAspect);
    float centerProtection = smoothstep(0.20, 0.36, distFromCenter);
    
    vec4 baseSample = texture2D(u_texture, uv);
    float maxC = max(baseSample.r, max(baseSample.g, baseSample.b));
    float minC = min(baseSample.r, min(baseSample.g, baseSample.b));
    float sat = maxC > 0.01 ? (maxC - minC) / maxC : 0.0;
    float luma = dot(baseSample.rgb, vec3(0.299, 0.587, 0.114));
    float blobFactor = smoothstep(0.03, 0.22, sat * 0.7 + luma * 0.5);
    
    float falloff = smoothstep(radius, 0.0, dist);
    float effectStrength = falloff * u_intensity * centerProtection * (0.25 + 0.75 * blobFactor);
    
    if (effectStrength > 0.0005) {
      float steppedTime = floor(u_time * 12.0) / 12.0;
      vec2 normDiff = normalize(diff + vec2(0.0001));
      float angle = atan(diff.y, diff.x);
      
      float wave1 = sin(dist * 36.0 - u_time * 3.2 + sin(angle * 3.0));
      float wave2 = cos(dist * 18.0 + steppedTime * 2.0 + cos(angle * 4.0));
      float organicWave = wave1 * 0.65 + wave2 * 0.35;
      vec2 velPush = u_velocity * 0.03;
      
      vec2 disp = (normDiff * (organicWave * 0.011) + velPush * 0.006) * effectStrength;
      float split = 0.0028 * effectStrength;
      vec2 uvR = clamp(uv + disp + normDiff * split, 0.0, 1.0);
      vec2 uvG = clamp(uv + disp, 0.0, 1.0);
      vec2 uvB = clamp(uv + disp - normDiff * split, 0.0, 1.0);
      
      float r = texture2D(u_texture, uvR).r;
      float g = texture2D(u_texture, uvG).g;
      float b = texture2D(u_texture, uvB).b;
      float a = texture2D(u_texture, uvG).a;
      
      gl_FragColor = vec4(r, g, b, a);
    } else {
      gl_FragColor = baseSample;
    }
  }
`;

interface TrophyState {
  isHovered: boolean;
  relX: number;
  relY: number;
}

export default function PrizesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Trophy independent hover states
  const [leftTrophy, setLeftTrophy] = useState<TrophyState>({ isHovered: false, relX: 0, relY: 0 });
  const [centerTrophy, setCenterTrophy] = useState<TrophyState>({ isHovered: false, relX: 0, relY: 0 });
  const [rightTrophy, setRightTrophy] = useState<TrophyState>({ isHovered: false, relX: 0, relY: 0 });

  // WebGL Shader Animation Loop & Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uIntensityLoc = gl.getUniformLocation(program, "u_intensity");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uVelocityLoc = gl.getUniformLocation(program, "u_velocity");
    const uTextureLoc = gl.getUniformLocation(program, "u_texture");

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );

    let isTextureLoaded = false;
    let destroyed = false;
    const bgImage = new window.Image();
    bgImage.crossOrigin = "anonymous";
    bgImage.onload = () => {
      if (destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImage);
      isTextureLoaded = true;
    };
    bgImage.src = "/images/Prizes/01_MASTER_BACKGROUND.png";

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let prevMouseX = 0.5;
    let prevMouseY = 0.5;
    let targetIntensity = 0.0;
    let currentIntensity = 0.0;
    let velX = 0;
    let velY = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetMouseX = Math.max(0, Math.min(1, x));
      targetMouseY = Math.max(0, Math.min(1, y));
      targetIntensity = 1.0;

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        targetIntensity = 0.0;
      }, 250);
    };

    const handleMouseLeave = () => {
      targetIntensity = 0.0;
      if (idleTimer) clearTimeout(idleTimer);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let animationFrameId: number;
    let startTime = performance.now();

    const render = () => {
      if (destroyed) return;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000.0;

      const lerpFactor = 0.12;
      currentMouseX += (targetMouseX - currentMouseX) * lerpFactor;
      currentMouseY += (targetMouseY - currentMouseY) * lerpFactor;
      currentIntensity += (targetIntensity - currentIntensity) * 0.08;

      velX = currentMouseX - prevMouseX;
      velY = currentMouseY - prevMouseY;
      prevMouseX = currentMouseX;
      prevMouseY = currentMouseY;

      if (isTextureLoaded) {
        gl.useProgram(program);
        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
        gl.uniform2f(uMouseLoc, currentMouseX, currentMouseY);
        gl.uniform1f(uIntensityLoc, currentIntensity);
        gl.uniform1f(uTimeLoc, elapsed);
        gl.uniform2f(uVelocityLoc, velX, velY);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uTextureLoc, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      destroyed = true;
      bgImage.onload = null;
      bgImage.src = "";
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (idleTimer) clearTimeout(idleTimer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
    };
  }, []);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Chromatic split on header matching sponsors section
        gsap.fromTo(
          ".prizes-ghost",
          { xPercent: (i: number) => (i === 0 ? -3.5 : 3.5), opacity: 0 },
          {
            xPercent: (i: number) => (i === 0 ? -0.4 : 0.4),
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
          },
        );

        const split = new SplitText(".prizes-mark-face", { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          ease: "power4.out",
        });
      });
    },
    { scope: sectionRef },
  );

  const createTrophyMoveHandler = useCallback(
    (setter: React.Dispatch<React.SetStateAction<TrophyState>>) => (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setter({ isHovered: true, relX, relY });
    },
    []
  );

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="relative w-full h-full bg-[#000000] overflow-hidden flex items-center justify-center select-none"
    >
      {/* 16:9 Desktop Viewport Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] aspect-[16/9] overflow-hidden bg-black flex items-center justify-center"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* Layer 1: Master Background WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* Fallback Static Master Background Image */}
        <img
          src="/images/Prizes/01_MASTER_BACKGROUND.png"
          alt="Master Background"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none -z-10 opacity-0"
        />

        {/* Layer 2: PRIZES Header matching Sponsors Typography */}
        <div className="prizes-mark absolute top-[2.5%] sm:top-[3.5%] inset-x-0 z-30 flex flex-col items-center pointer-events-none text-center">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#22b6d6] shadow-[0_0_10px_#22b6d6]" />
            <span className="eyebrow text-[#22b6d6]">Spider-Society // Bounties &amp; Awards</span>
          </div>

          <div className="relative mt-1 sm:mt-2 overflow-hidden">
            {/* Red Ghost */}
            <span
              aria-hidden="true"
              className={`prizes-ghost display absolute inset-0 text-red opacity-0 select-none ${MARK_SIZE}`}
            >
              Prizes
            </span>
            {/* Cyan Ghost */}
            <span
              aria-hidden="true"
              className={`prizes-ghost display absolute inset-0 text-[#22b6d6] opacity-0 select-none ${MARK_SIZE}`}
            >
              Prizes
            </span>
            {/* Front Face */}
            <h2 className={`prizes-mark-face display relative text-paper ${MARK_SIZE}`}>
              Prizes
            </h2>
          </div>

          <div className="prizes-lede mt-1 sm:mt-2 inline-flex items-center gap-2 border border-red/40 bg-black/75 backdrop-blur-md px-4 py-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sand shadow-[0_0_15px_rgba(214,7,12,0.3)]">
            <span className="text-red font-mono">⚡</span>
            <span>TOTAL POOL: ₹1,00,000+ CASH</span>
          </div>
        </div>

        {/* Layer 3: Scaled Trophies & Prize Cards Stage */}
        <div className="prizes-trophies-wrap absolute inset-0 w-full h-full pointer-events-none z-10 origin-[50%_50%] scale-[0.66] sm:scale-[0.68] md:scale-[0.70] translate-y-[6%] sm:translate-y-[7%]">
          {/* ── LEFT GLOW ── */}
          <div
            className={`absolute pointer-events-none transition-all duration-500 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
              leftTrophy.isHovered ? "opacity-95 scale-135" : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{
              left: "24.23%", top: "52%", width: "32%", height: "70%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(229,48,140,0.7) 0%, rgba(214,7,12,0.35) 50%, transparent 75%)",
            }}
          />
          {/* ── LEFT TROPHY IMAGE ── */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-10"
            style={{
              transformOrigin: "24.23% 60%",
              transform: leftTrophy.isHovered
                ? `translate3d(${leftTrophy.relX * 8}px, ${-22 + leftTrophy.relY * 6}px, 0) rotate(${-0.8 + leftTrophy.relX * 0.5}deg) scale(1.10)`
                : "translate3d(0,0,0) rotate(0deg) scale(1)",
              filter: leftTrophy.isHovered
                ? "drop-shadow(0 0 35px rgba(229,48,140,0.75)) brightness(1.12)"
                : "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease",
            }}
          >
            <img src="/images/Prizes/03_LEFT_TROPHY.png" alt="2nd Place Award" className="w-full h-full object-contain" draggable={false} />
          </div>
          {/* ── LEFT HITBOX ── */}
          <div
            className="absolute cursor-pointer pointer-events-auto z-20"
            style={{ left: "17%", top: "18%", width: "15%", height: "72%" }}
            onMouseEnter={() => setLeftTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseMove={createTrophyMoveHandler(setLeftTrophy)}
            onMouseLeave={() => setLeftTrophy({ isHovered: false, relX: 0, relY: 0 })}
            aria-label="2nd Prize Trophy Award"
          />

          {/* ── CENTER GLOW ── */}
          <div
            className={`absolute pointer-events-none transition-all duration-500 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
              centerTrophy.isHovered ? "opacity-100 scale-145" : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{
              left: "49.16%", top: "46%", width: "32%", height: "75%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(255,230,0,0.75) 0%, rgba(255,170,0,0.4) 48%, transparent 75%)",
            }}
          />
          {/* ── CENTER TROPHY IMAGE ── */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-10"
            style={{
              transformOrigin: "49.16% 55%",
              transform: centerTrophy.isHovered
                ? `translate3d(${centerTrophy.relX * 7}px, ${-26 + centerTrophy.relY * 5}px, 0) scale(1.12)`
                : "translate3d(0,0,0) scale(1)",
              filter: centerTrophy.isHovered
                ? "drop-shadow(0 0 45px rgba(255,230,0,0.85)) brightness(1.15)"
                : "drop-shadow(0 18px 35px rgba(0,0,0,0.85))",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease",
            }}
          >
            <img src="/images/Prizes/04_CENTER_TROPHY.png" alt="1st Place Champion Award" className="w-full h-full object-contain" draggable={false} />
          </div>
          {/* ── CENTER HITBOX ── */}
          <div
            className="absolute cursor-pointer pointer-events-auto z-20"
            style={{ left: "42%", top: "16%", width: "15%", height: "72%" }}
            onMouseEnter={() => setCenterTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseMove={createTrophyMoveHandler(setCenterTrophy)}
            onMouseLeave={() => setCenterTrophy({ isHovered: false, relX: 0, relY: 0 })}
            aria-label="1st Prize Grand Champion Trophy Award"
          />

          {/* ── RIGHT GLOW ── */}
          <div
            className={`absolute pointer-events-none transition-all duration-500 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
              rightTrophy.isHovered ? "opacity-95 scale-135" : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{
              left: "68.01%", top: "52%", width: "32%", height: "70%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(34,182,214,0.7) 0%, rgba(4,30,63,0.4) 50%, transparent 75%)",
            }}
          />
          {/* ── RIGHT TROPHY IMAGE ── */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-10"
            style={{
              transformOrigin: "68.01% 60%",
              transform: rightTrophy.isHovered
                ? `translate3d(${rightTrophy.relX * 8}px, ${-22 + rightTrophy.relY * 6}px, 0) rotate(${0.8 + rightTrophy.relX * 0.5}deg) scale(1.10)`
                : "translate3d(0,0,0) rotate(0deg) scale(1)",
              filter: rightTrophy.isHovered
                ? "drop-shadow(0 0 35px rgba(34,182,214,0.75)) brightness(1.12)"
                : "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease",
            }}
          >
            <img src="/images/Prizes/05_RIGHT_TROPHY.png" alt="3rd Place Award" className="w-full h-full object-contain" draggable={false} />
          </div>
          {/* ── RIGHT HITBOX ── */}
          <div
            className="absolute cursor-pointer pointer-events-auto z-20"
            style={{ left: "60%", top: "18%", width: "15%", height: "72%" }}
            onMouseEnter={() => setRightTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseMove={createTrophyMoveHandler(setRightTrophy)}
            onMouseLeave={() => setRightTrophy({ isHovered: false, relX: 0, relY: 0 })}
            aria-label="3rd Prize Trophy Award"
          />

          {/* ── 2ND PRIZE CARD ── */}
          <div
            className="absolute pointer-events-auto z-30"
            style={{
              left: "24.23%",
              top: "73%",
              transform: `translateX(-50%) translateY(${leftTrophy.isHovered ? "-8px" : "0px"})`,
              transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={() => setLeftTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseLeave={() => setLeftTrophy({ isHovered: false, relX: 0, relY: 0 })}
          >
            <div className={`px-5 sm:px-6 py-2.5 rounded-2xl border-2 flex flex-col items-center min-w-[140px] sm:min-w-[170px] transition-all duration-300 ${
              leftTrophy.isHovered
                ? "bg-black/95 border-[#22b6d6] shadow-[0_0_35px_rgba(34,182,214,0.6)] scale-105"
                : "bg-black/80 border-[#22b6d6]/40 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.8)]"
            }`}>
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#22b6d6] uppercase">2ND PRIZE</span>
              <span className="display text-2xl sm:text-3xl text-paper tracking-tight mt-0.5 leading-none">₹30,000</span>
            </div>
          </div>

          {/* ── 1ST PRIZE CARD ── */}
          <div
            className="absolute pointer-events-auto z-30"
            style={{
              left: "49.16%",
              top: "76%",
              transform: `translateX(-50%) translateY(${centerTrophy.isHovered ? "-10px" : "0px"})`,
              transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={() => setCenterTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseLeave={() => setCenterTrophy({ isHovered: false, relX: 0, relY: 0 })}
          >
            <div className={`px-6 sm:px-8 py-2.5 rounded-2xl border-2 flex flex-col items-center min-w-[160px] sm:min-w-[195px] transition-all duration-300 ${
              centerTrophy.isHovered
                ? "bg-black/95 border-[#f7d117] shadow-[0_0_45px_rgba(247,209,23,0.7)] scale-105"
                : "bg-black/85 border-[#f7d117]/60 backdrop-blur-md shadow-[0_6px_25px_rgba(0,0,0,0.85)]"
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">👑</span>
                <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#f7d117] uppercase">1ST PRIZE</span>
                <span className="text-[10px]">👑</span>
              </div>
              <span className="display text-3xl sm:text-4xl text-[#f7d117] tracking-tight mt-0.5 leading-none drop-shadow-[0_2px_12px_rgba(247,209,23,0.5)]">₹50,000</span>
            </div>
          </div>

          {/* ── 3RD PRIZE CARD ── */}
          <div
            className="absolute pointer-events-auto z-30"
            style={{
              left: "68.01%",
              top: "73%",
              transform: `translateX(-50%) translateY(${rightTrophy.isHovered ? "-8px" : "0px"})`,
              transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={() => setRightTrophy(prev => ({ ...prev, isHovered: true }))}
            onMouseLeave={() => setRightTrophy({ isHovered: false, relX: 0, relY: 0 })}
          >
            <div className={`px-5 sm:px-6 py-2.5 rounded-2xl border-2 flex flex-col items-center min-w-[140px] sm:min-w-[170px] transition-all duration-300 ${
              rightTrophy.isHovered
                ? "bg-black/95 border-[#fcd49b] shadow-[0_0_35px_rgba(252,212,155,0.6)] scale-105"
                : "bg-black/80 border-[#fcd49b]/40 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.8)]"
            }`}>
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#fcd49b] uppercase">3RD PRIZE</span>
              <span className="display text-2xl sm:text-3xl text-paper tracking-tight mt-0.5 leading-none">₹20,000</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
