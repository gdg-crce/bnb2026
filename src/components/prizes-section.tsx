"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PrizesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas) {
      return;
    }

    let isDestroyed = false;
    let animFrameId: number;

    // Offscreen Canvas for Pixel Color Sampling
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    let bgImageLoaded = false;

    const bgImg = new window.Image();
    bgImg.onload = () => {
      if (isDestroyed) return;
      sampleCanvas.width = bgImg.width;
      sampleCanvas.height = bgImg.height;
      sampleCtx?.drawImage(bgImg, 0, 0);
      bgImageLoaded = true;
    };
    bgImg.src = "/assets/01_MASTER_BACKGROUND.png";
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      sampleCanvas.width = bgImg.naturalWidth;
      sampleCanvas.height = bgImg.naturalHeight;
      sampleCtx?.drawImage(bgImg, 0, 0);
      bgImageLoaded = true;
    }

    // Strictly Protected Award Zones (exact trophy silhouettes)
    const trophySafetyZones = [
      { minX: 0.17, maxX: 0.36, minY: 0.23, maxY: 0.88 }, // Left trophy
      { minX: 0.43, maxX: 0.56, minY: 0.23, maxY: 0.84 }, // Center trophy
      { minX: 0.61, maxX: 0.74, minY: 0.25, maxY: 0.83 }, // Right trophy
    ];

    // -------------------------------------------------------------
    // BUBBLE SIMULATION ENGINE (350 DENSE ROUNDED ORGANIC & STATIONARY BUBBLES)
    // -------------------------------------------------------------
    const MAX_BUBBLES = 350;
    interface Bubble {
      active: boolean;
      st: THREE.Vector2;
      originSt: THREE.Vector2;
      vel: THREE.Vector2;
      maxRadius: number;
      currentRadius: number;
      color: THREE.Vector3;
      state: number;
      life: number;
      maxLife: number;
      shapeParams: THREE.Vector2;
    }

    const bubbles: Bubble[] = [];
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubbles.push({
        active: false,
        st: new THREE.Vector2(0, 0),
        originSt: new THREE.Vector2(0, 0),
        vel: new THREE.Vector2(0, 0),
        maxRadius: 0.012,
        currentRadius: 0.0,
        color: new THREE.Vector3(0.0, 0.9, 1.0),
        state: 0,
        life: 0.0,
        maxLife: 1.0,
        shapeParams: new THREE.Vector2(Math.random(), Math.random()),
      });
    }


    function spawnSingleBubble(borderSt: THREE.Vector2, normX: number, normY: number, colorVec: THREE.Vector3, radiusSize: number) {
      const b = bubbles.find((item) => !item.active);
      if (!b) return;

      b.active = true;
      b.st.copy(borderSt);
      b.originSt.copy(borderSt);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.0002 + Math.random() * 0.0006;
      b.vel.set(Math.cos(angle) * speed, Math.sin(angle) * speed);

      b.maxRadius = radiusSize;
      b.currentRadius = 0.0;
      b.color.copy(colorVec);
      b.state = 1;
      b.life = 0.0;
      b.maxLife = 0.7 + Math.random() * 1.5;
      b.shapeParams.set(Math.random(), Math.random());
    }

    function spawnBubbleCluster(mouseSt: THREE.Vector2, normX: number, normY: number, baseColorVec: THREE.Vector3 | null) {
      if (!baseColorVec) return;

      const count = 8 + Math.floor(Math.random() * 7);
      const isBaseBlack = (baseColorVec.x < 0.15 && baseColorVec.y < 0.15 && baseColorVec.z < 0.20);

      for (let i = 0; i < count; i++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDist = Math.random() * 0.070;
        const spawnSt = mouseSt.clone().add(new THREE.Vector2(Math.cos(offsetAngle) * offsetDist, Math.sin(offsetAngle) * offsetDist));

        const sizeRoll = Math.random();
        let size = 0.005 + Math.random() * 0.005;
        if (sizeRoll > 0.35 && sizeRoll <= 0.7) {
          size = 0.009 + Math.random() * 0.007;
        } else if (sizeRoll > 0.7 && sizeRoll <= 0.9) {
          size = 0.016 + Math.random() * 0.009;
        } else if (sizeRoll > 0.9) {
          size = 0.024 + Math.random() * 0.01;
        }

        let colorVar: THREE.Vector3;
        if (isBaseBlack) {
          // Over black places -> strictly black and charcoal grey bubbles
          const roll = Math.random();
          if (roll < 0.55) {
            colorVar = new THREE.Vector3(0.015, 0.015, 0.025);
          } else if (roll < 0.85) {
            colorVar = new THREE.Vector3(0.06 + Math.random() * 0.03, 0.06 + Math.random() * 0.03, 0.09 + Math.random() * 0.03);
          } else {
            colorVar = new THREE.Vector3(0.12 + Math.random() * 0.04, 0.12 + Math.random() * 0.04, 0.16 + Math.random() * 0.04);
          }
        } else {
          // Over colored artwork -> 70% pure artwork color (purple over purple, blue over blue), 30% black ink accent
          if (Math.random() < 0.30) {
            colorVar = new THREE.Vector3(0.015, 0.015, 0.025);
          } else {
            colorVar = new THREE.Vector3(
              Math.min(1.0, baseColorVec.x * (0.90 + Math.random() * 0.20)),
              Math.min(1.0, baseColorVec.y * (0.90 + Math.random() * 0.20)),
              Math.min(1.0, baseColorVec.z * (0.90 + Math.random() * 0.20))
            );
          }
        }

        spawnSingleBubble(spawnSt, normX, normY, colorVar, size);
      }
    }

    function updateBubbles(dt: number) {
      for (const b of bubbles) {
        if (!b.active) continue;

        b.life += dt;
        const normLife = b.life / b.maxLife;

        if (b.state === 1) {
          b.currentRadius += (b.maxRadius - b.currentRadius) * 0.2;
          if (b.currentRadius >= b.maxRadius * 0.85) {
            b.state = 2;
          }
        } else if (b.state === 2) {
          b.st.add(b.vel);
          if (normLife > 0.65) {
            b.state = Math.random() > 0.4 ? 3 : 4;
          }
        } else if (b.state === 3) {
          b.currentRadius += b.maxRadius * 0.18;
          if (normLife >= 1.0 || b.currentRadius > b.maxRadius * 1.5) {
            b.active = false;
          }
        } else if (b.state === 4) {
          b.currentRadius *= 0.8;
          b.st.lerp(b.originSt, 0.15);
          if (b.currentRadius < 0.001 || normLife >= 1.0) {
            b.active = false;
          }
        }

        if (normLife >= 1.0) {
          b.active = false;
        }
      }
    }

    function sampleArtworkColor(normX: number, normY: number): THREE.Vector3 | null {
      const clampedX = Math.max(0.0, Math.min(1.0, normX));
      const clampedY = Math.max(0.0, Math.min(1.0, normY));

      const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
      const distFromCenter = Math.hypot((clampedX - 0.5) * aspect, (1.0 - clampedY) - 0.5);

      // Don't bubble in the center (keeps center awards & trophies clean and unobstructed)
      if (distFromCenter < 0.22) {
        return null;
      }

      if (!bgImageLoaded || !sampleCtx) {
        return normX < 0.48 ? new THREE.Vector3(0.55, 0.04, 0.92) : new THREE.Vector3(0.0, 0.85, 1.0);
      }

      const texAspect = 1812.0 / 1019.0;
      let coverX = normX;
      let coverY = 1.0 - normY;
      if (aspect > texAspect) {
        const s = texAspect / aspect;
        coverY = (coverY - 0.5) * s + 0.5;
      } else {
        const s = aspect / texAspect;
        coverX = (coverX - 0.5) * s + 0.5;
      }
      const bgZoom = 0.78;
      const zoomedX = Math.max(0.0, Math.min(1.0, (coverX - 0.5) / bgZoom + 0.5));
      const zoomedY = Math.max(0.0, Math.min(1.0, (coverY - 0.5) / bgZoom + 0.5));

      const px = Math.floor(zoomedX * sampleCanvas.width);
      const py = Math.floor(zoomedY * sampleCanvas.height);

      // Sample neighborhood patch to catch true artwork ink color
      const radius = 4;
      const startX = Math.max(0, px - radius);
      const startY = Math.max(0, py - radius);
      const width = Math.min(sampleCanvas.width - startX, radius * 2 + 1);
      const height = Math.min(sampleCanvas.height - startY, radius * 2 + 1);

      const patchData = sampleCtx.getImageData(startX, startY, width, height).data;
      let maxVibrancy = -1;
      let bestR = 0,
        bestG = 0,
        bestB = 0;

      for (let i = 0; i < patchData.length; i += 4) {
        const pr = patchData[i] / 255.0;
        const pg = patchData[i + 1] / 255.0;
        const pb = patchData[i + 2] / 255.0;

        const maxC = Math.max(pr, Math.max(pg, pb));
        const minC = Math.min(pr, Math.min(pg, pb));
        const chroma = (maxC - minC) * maxC;

        if (chroma > maxVibrancy) {
          maxVibrancy = chroma;
          bestR = pr;
          bestG = pg;
          bestB = pb;
        }
      }

      const luma = bestR * 0.299 + bestG * 0.587 + bestB * 0.114;

      // 1. BLACK PLACES: Bubble black and dark charcoal grey around the black areas
      if (luma < 0.14 || maxVibrancy < 0.02) {
        const roll = Math.random();
        if (roll < 0.60) {
          return new THREE.Vector3(0.015, 0.015, 0.025); // Deep ink black
        } else if (roll < 0.88) {
          return new THREE.Vector3(0.06 + Math.random() * 0.03, 0.06 + Math.random() * 0.03, 0.09 + Math.random() * 0.03); // Charcoal dark grey
        } else {
          return new THREE.Vector3(0.12 + Math.random() * 0.04, 0.12 + Math.random() * 0.04, 0.16 + Math.random() * 0.04); // Medium ink grey
        }
      }

      // 2. PURPLE PLACES (Left & Left-Center): Royal Purple / Deep Violet / Indigo
      if (normX < 0.48 && (bestR > 0.12 || bestB > 0.12)) {
        const purpleRoll = Math.random();
        if (purpleRoll < 0.50) {
          return new THREE.Vector3(0.55 + Math.random() * 0.10, 0.02 + Math.random() * 0.04, 0.92 + Math.random() * 0.06); // Deep royal purple
        } else if (purpleRoll < 0.85) {
          return new THREE.Vector3(0.65 + Math.random() * 0.08, 0.04 + Math.random() * 0.04, 0.95 + Math.random() * 0.04); // Luminous violet
        } else {
          return new THREE.Vector3(0.40 + Math.random() * 0.08, 0.02 + Math.random() * 0.03, 0.85 + Math.random() * 0.08); // Dark indigo
        }
      }

      // 3. BLUE PLACES (Right & Right-Center): Electric Cyan / Royal Blue
      if (normX >= 0.48 && (bestB > 0.15 || bestG > 0.15)) {
        const cyanRoll = Math.random();
        if (cyanRoll < 0.55) {
          return new THREE.Vector3(0.0, 0.82 + Math.random() * 0.18, 0.98 + Math.random() * 0.02); // Electric cyan
        } else {
          return new THREE.Vector3(0.08 + Math.random() * 0.10, 0.48 + Math.random() * 0.20, 0.98 + Math.random() * 0.02); // Royal blue
        }
      }

      // Default dark ink for ambiguous dark pixels
      return new THREE.Vector3(0.015, 0.015, 0.025);
    }

    // -------------------------------------------------------------
    // WEBGL SHADER SYSTEM
    // -------------------------------------------------------------
    const mousePos = new THREE.Vector2(0.5, 0.5);
    const targetMousePos = new THREE.Vector2(0.5, 0.5);
    const lastMousePos = new THREE.Vector2(0.5, 0.5);
    let activity = 0.0;
    let targetActivity = 0.0;
    let lastTime = performance.now();
    const startTime = performance.now();

    const vertexShader = `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform float u_activity;
      uniform float u_time;
      uniform vec2 u_resolution;

      uniform vec4 u_bubbles[200];
      uniform vec3 u_bubbleColors[200];
      uniform vec2 u_bubbleParams[200];

      varying vec2 v_uv;

      float hash11(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 st = (uv - vec2(0.5)) * vec2(aspect, 1.0);
        vec2 mouseSt = (u_mouse - vec2(0.5)) * vec2(aspect, 1.0);
        
        // Full screen cover mapping with aspect-ratio compensation & zoom
        float texAspect = 1812.0 / 1019.0;
        vec2 coverUv = uv;
        if (aspect > texAspect) {
          float s = texAspect / aspect;
          coverUv.y = (uv.y - 0.5) * s + 0.5;
        } else {
          float s = aspect / texAspect;
          coverUv.x = (uv.x - 0.5) * s + 0.5;
        }
        float bgZoom = 0.78;
        vec2 zoomedUv = (coverUv - vec2(0.5)) / bgZoom + vec2(0.5);

        // Clean border fade to void black so no edge streak or clamp artifacts appear
        vec2 edgeDist = min(zoomedUv, 1.0 - zoomedUv);
        float edgeMask = smoothstep(0.0, 0.03, min(edgeDist.x, edgeDist.y));
        vec4 rawTex = (zoomedUv.x >= 0.0 && zoomedUv.x <= 1.0 && zoomedUv.y >= 0.0 && zoomedUv.y <= 1.0)
          ? texture2D(u_texture, zoomedUv)
          : vec4(0.0, 0.0, 0.0, 1.0);
        vec4 baseColor = rawTex * edgeMask;
        
        float distFromCenter = length(st);
        float centerProtection = smoothstep(0.20, 0.38, distFromCenter);
        float colorLuma = max(baseColor.r, max(baseColor.g, baseColor.b));
        float isArtwork = centerProtection * smoothstep(0.02, 0.10, colorLuma);
        
        float distToMouse = length(st - mouseSt);
        float cursorRadius = 0.25;
        float cursorInfluence = smoothstep(cursorRadius, 0.0, distToMouse) * u_activity * isArtwork;
        
        vec3 compColor = baseColor.rgb;
        
        // 1. COLORED ELECTRIC LIGHTNING / SPIDER-VERSE GLITCH EDGE
        float innerEdge = smoothstep(0.22, 0.36, distFromCenter) * smoothstep(0.04, 0.16, colorLuma);
        float edgeContour = smoothstep(0.02, 0.08, abs(innerEdge - 0.5));
        
        if (cursorInfluence > 0.001 && edgeContour > 0.01) {
          float fps = 12.0;
          float steppedTime = floor(u_time * fps) / fps;
          
          float noiseLine = sin(uv.x * 120.0 + steppedTime * 25.0) * cos(uv.y * 120.0 - steppedTime * 18.0);
          float electricFlicker = step(0.65, hash11(steppedTime * 13.0 + uv.x * 50.0));
          
          vec3 electricColor = baseColor.rgb * 1.9 + vec3(0.1, 0.1, 0.2);
          float lightningIntensity = edgeContour * electricFlicker * cursorInfluence * (0.6 + noiseLine * 0.4);
          compColor += electricColor * lightningIntensity * 0.85;
        }

        // 2. SUBTLE ELECTRIC ENERGY PULSES ALONG CENTRAL SPIDER WEBS
        float isCenterWebZone = smoothstep(0.06, 0.38, distFromCenter) * (1.0 - smoothstep(0.38, 0.48, distFromCenter));
        float webLuma = baseColor.r * 0.25 + baseColor.g * 0.50 + baseColor.b * 0.25;
        float isWebLine = isCenterWebZone * smoothstep(0.15, 0.40, webLuma);

        if (isWebLine > 0.02) {
          float fps = 12.0;
          float steppedTime = floor(u_time * fps) / fps;
          
          float webWave = sin(distFromCenter * 50.0 - steppedTime * 6.0 + hash11(floor(uv.x * 30.0)) * 12.0);
          float pulseFlicker = step(0.78, hash11(steppedTime * 3.0 + floor(distFromCenter * 20.0)));
          float webPulse = pow(max(0.0, webWave), 10.0) * pulseFlicker * isWebLine;

          vec3 webPulseColor = vec3(0.0, 0.85, 1.0) * 1.6;
          compColor += webPulseColor * webPulse * 0.45;
        }
        
        // 3. PURE FILLED DENSE ROUNDED MUTATING BUBBLES (200 SLOTS)
        float fps = 12.0;
        float steppedTime = floor(u_time * fps) / fps;

        for (int i = 0; i < 200; i++) {
          vec4 bData = u_bubbles[i];
          float radius = bData.z;
          float state = bData.w;

          if (radius > 0.0003) {
            vec2 bSt = bData.xy;
            vec3 bColor = u_bubbleColors[i];
            vec2 bParams = u_bubbleParams[i];

            vec2 delta = st - bSt;
            float r = length(delta);
            float theta = atan(delta.y, delta.x);

            float h1 = sin(2.0 * theta + bParams.x * 6.28 + steppedTime * 1.2);
            float h2 = cos(3.0 * theta + bParams.y * 6.28);
            float roundedShape = 1.0 + 0.08 * h1 + 0.05 * h2;

            float effectiveRadius = radius * roundedShape;

            if (state == 3.0) {
              effectiveRadius *= 1.25;
            }

            float inside = smoothstep(effectiveRadius + 0.001, effectiveRadius - 0.001, r);

            if (inside > 0.01) {
              vec3 bubbleRGB = bColor;
              
              if (state == 3.0) {
                inside *= 0.60;
              }

              compColor = mix(compColor, bubbleRGB, inside * 0.96);
            }
          }
        }

        gl_FragColor = vec4(compColor, baseColor.a);
      }
    `;

    // --- IMMEDIATE WebGL Init (matches reference PRIZES/main.js) ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load("/assets/01_MASTER_BACKGROUND.png", () => {
      if (!isDestroyed) {
        renderer.render(scene, camera);
      }
    });
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;
    bgTexture.generateMipmaps = false;

    const bubbleVec4s: THREE.Vector4[] = [];
    const bubbleColors: THREE.Vector3[] = [];
    const bubbleParams: THREE.Vector2[] = [];
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubbleVec4s.push(new THREE.Vector4(0, 0, 0, 0));
      bubbleColors.push(new THREE.Vector3(0, 0, 0));
      bubbleParams.push(new THREE.Vector2(0, 0));
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: bgTexture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_activity: { value: 0.0 },
        u_time: { value: 0.0 },
        u_resolution: {
          value: new THREE.Vector2(stage.clientWidth || 1920, stage.clientHeight || 1080),
        },
        u_bubbles: { value: bubbleVec4s },
        u_bubbleColors: { value: bubbleColors },
        u_bubbleParams: { value: bubbleParams },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    function resizeWebGL() {
      if (!renderer || !material || !stage) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      material.uniforms.u_resolution.value.set(width, height);
    }

    resizeWebGL();
    window.addEventListener("resize", resizeWebGL);

    const resizeObserver = new ResizeObserver(() => {
      resizeWebGL();
    });
    resizeObserver.observe(stage);

    // -------------------------------------------------------------
    // MOUSE INTERACTION (Full Section + Stage)
    // -------------------------------------------------------------
    let lastSpawnTime = 0;

    const onStageMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const rawNormX = (e.clientX - rect.left) / rect.width;
      const rawNormY = 1.0 - (e.clientY - rect.top) / rect.height;
      const normX = Math.max(0.0, Math.min(1.0, rawNormX));
      const normY = Math.max(0.0, Math.min(1.0, rawNormY));

      targetMousePos.set(normX, normY);

      const aspect = (stage.clientWidth || 1920) / (stage.clientHeight || 1080);
      const mouseSt = new THREE.Vector2((normX - 0.5) * aspect, normY - 0.5);

      const distMoved = targetMousePos.distanceTo(lastMousePos);
      lastMousePos.copy(targetMousePos);

      targetActivity = Math.min(1.0, activity + distMoved * 8.0 + 0.15);

      const now = performance.now();
      if (now - lastSpawnTime > 50) {
        lastSpawnTime = now;
        const sampledColor = sampleArtworkColor(normX, normY);
        spawnBubbleCluster(mouseSt, normX, 1.0 - normY, sampledColor);
      }
    };

    const onStageMouseLeave = () => {
      targetActivity = 0.0;
    };

    stage.addEventListener("mousemove", onStageMouseMove);
    stage.addEventListener("mouseleave", onStageMouseLeave);
    if (section && section !== stage) {
      section.addEventListener("mousemove", onStageMouseMove);
      section.addEventListener("mouseleave", onStageMouseLeave);
    }

    // -------------------------------------------------------------
    // AMBIENT CONTINUOUS IDLE BUBBLING (Rich Black & Grey Majority, Outward Flow)
    // -------------------------------------------------------------
    let lastAmbientSpawnTime = 0;

    function spawnAmbientBubbles(now: number) {
      if (now - lastAmbientSpawnTime < 30) return;
      lastAmbientSpawnTime = now;

      let activeCount = 0;
      for (let i = 0; i < MAX_BUBBLES; i++) {
        if (bubbles[i].active) activeCount++;
      }

      // Maintain a rich, continuous baseline of 240+ active ambient & stationary bubbles throughout
      if (activeCount < 260) {
        const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
        const spawnBatch = 3 + Math.floor(Math.random() * 4); // 3 to 6 bubbles per tick

        for (let s = 0; s < spawnBatch; s++) {
          const ambientNormX = 0.005 + Math.random() * 0.99;
          const ambientNormY = 0.005 + Math.random() * 0.99;

          const sampledColor = sampleArtworkColor(ambientNormX, ambientNormY);
          if (!sampledColor) continue; // Skips the center

          const ambientSt = new THREE.Vector2((ambientNormX - 0.5) * aspect, ambientNormY - 0.5);
          const sizeRoll = Math.random();
          let size: number;
          if (sizeRoll < 0.45) {
            size = 0.004 + Math.random() * 0.004; // small ink speckle
          } else if (sizeRoll < 0.80) {
            size = 0.009 + Math.random() * 0.007; // medium organic bubble
          } else {
            size = 0.017 + Math.random() * 0.011; // large floating orb
          }

          const b = bubbles.find((item) => !item.active);
          if (b) {
            b.active = true;
            b.st.copy(ambientSt);
            b.originSt.copy(ambientSt);

            // 60% stationary/breathing bubbles, 40% gentle slow drift
            const isStationary = Math.random() < 0.60;
            if (isStationary) {
              b.vel.set(0, 0);
            } else {
              const outwardAngle = Math.atan2(ambientSt.y, ambientSt.x) + (Math.random() - 0.5) * 0.7;
              const speed = 0.00008 + Math.random() * 0.00018;
              b.vel.set(Math.cos(outwardAngle) * speed, Math.sin(outwardAngle) * speed);
            }

            b.maxRadius = size;
            b.currentRadius = 0.0;
            b.color.copy(sampledColor);
            b.state = 1;
            b.life = 0.0;
            b.maxLife = 3.5 + Math.random() * 5.0; // Long-lived stationary orbs
            b.shapeParams.set(Math.random(), Math.random());
          }
        }
      }
    }

    // Seed initial ambient & stationary bubbles across the entire artwork including outer edges
    function seedInitialBubbles() {
      const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
      for (let i = 0; i < 200; i++) {
        const ambientNormX = 0.005 + Math.random() * 0.99;
        const ambientNormY = 0.005 + Math.random() * 0.99;

        const sampledColor = sampleArtworkColor(ambientNormX, ambientNormY);
        if (!sampledColor) continue;

        const ambientSt = new THREE.Vector2((ambientNormX - 0.5) * aspect, ambientNormY - 0.5);
        const b = bubbles[i];
        if (b) {
          b.active = true;
          b.st.copy(ambientSt);
          b.originSt.copy(ambientSt);
          const isStationary = Math.random() < 0.60;
          if (isStationary) {
            b.vel.set(0, 0);
          } else {
            const outwardAngle = Math.atan2(ambientSt.y, ambientSt.x) + (Math.random() - 0.5) * 0.7;
            const speed = 0.00008 + Math.random() * 0.00018;
            b.vel.set(Math.cos(outwardAngle) * speed, Math.sin(outwardAngle) * speed);
          }
          b.maxRadius = 0.005 + Math.random() * 0.014;
          b.currentRadius = b.maxRadius * (0.4 + Math.random() * 0.6);
          b.color.copy(sampledColor);
          b.state = 2;
          b.maxLife = 3.5 + Math.random() * 5.0;
          b.life = b.maxLife * Math.random();
          b.shapeParams.set(Math.random(), Math.random());
        }
      }
    }

    seedInitialBubbles();

    // -------------------------------------------------------------
    // VISIBILITY OBSERVER (Pause WebGL rendering when off-screen)
    // -------------------------------------------------------------
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    if (section) {
      visibilityObserver.observe(section);
    }

    // -------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // -------------------------------------------------------------
    function animate() {
      if (isDestroyed) return;
      animFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      mousePos.lerp(targetMousePos, 0.1);
      activity += (targetActivity - activity) * 0.08;
      targetActivity *= 0.94;

      // Continuously spawn ambient idle bubbles
      spawnAmbientBubbles(now);

      updateBubbles(delta);

      if (material && renderer && scene && camera) {
        material.uniforms.u_mouse.value.copy(mousePos);
        material.uniforms.u_activity.value = activity;
        material.uniforms.u_time.value = elapsedTime;

        const bVecs = material.uniforms.u_bubbles.value as THREE.Vector4[];
        const bCols = material.uniforms.u_bubbleColors.value as THREE.Vector3[];
        const bPars = material.uniforms.u_bubbleParams.value as THREE.Vector2[];

        for (let i = 0; i < MAX_BUBBLES; i++) {
          const b = bubbles[i];
          if (b.active) {
            bVecs[i].set(b.st.x, b.st.y, b.currentRadius, b.state);
            bCols[i].copy(b.color);
            bPars[i].copy(b.shapeParams);
          } else {
            bVecs[i].set(0, 0, 0, 0);
          }
        }

        renderer.render(scene, camera);
      }
    }

    animate();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animFrameId);
      visibilityObserver.disconnect();
      window.removeEventListener("resize", resizeWebGL);
      resizeObserver.disconnect();
      stage.removeEventListener("mousemove", onStageMouseMove);
      stage.removeEventListener("mouseleave", onStageMouseLeave);
      if (section && section !== stage) {
        section.removeEventListener("mousemove", onStageMouseMove);
        section.removeEventListener("mouseleave", onStageMouseLeave);
      }

      geometry.dispose();
      material.dispose();
      bgTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="prizes" ref={sectionRef} className="prizes-experience-section">
      {/* ============================================================== */}
      {/* DESKTOP-ONLY FULL-SCREEN VIEWPORT STAGE (hidden md:block) */}
      {/* ============================================================== */}
      <div id="stage-16-9" ref={stageRef} className="hidden md:block stage-container">
        {/* Full-Screen WebGL Background Layer */}
        <canvas id="bg-canvas" ref={canvasRef}></canvas>

        {/* Full-Screen Spider Webs Layer */}
        <div id="webs-layer">
          <img
            src="/assets/07_SPIDER_WEBS.png"
            alt="Spider Webs"
            className="webs-img"
            draggable={false}
          />
        </div>

        {/* Prizes Title Layer - Dead Center of the Whole Screen */}
        <div id="prizes-title-layer">
          <img
            src="/prizestitle.png"
            alt="Prizes Title"
            className="prizes-title-img"
            draggable={false}
          />
        </div>

        {/* Centered Stage Content Wrapper (Trophies & Prize Badges) */}
        <div className="stage-content-wrapper">
          {/* Trophy Interactive Layers */}
          <div id="trophies-layer">
            <div className="trophy-wrapper" id="trophy-left">
              <img src="/left.png" alt="Left Trophy" className="trophy-img" draggable={false} />
            </div>

            <div className="trophy-wrapper" id="trophy-center">
              <img src="/center.png" alt="Center Trophy" className="trophy-img" draggable={false} />
            </div>

            <div className="trophy-wrapper" id="trophy-right">
              <img src="/right.png" alt="Right Trophy" className="trophy-img" draggable={false} />
            </div>
          </div>

          {/* Money / Cash Prize Badges Layer Below Trophies */}
          <div id="prizes-money-layer">
            <img
              src="/prizes/money.png"
              alt="Prize Money"
              className="prizes-money-img"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .prizes-experience-section {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000000;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
          overflow: hidden;
          pointer-events: auto;
        }

        .stage-container {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #000000;
          overflow: hidden;
          pointer-events: auto;
        }

        .stage-content-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(100vw, calc(100vh * (16 / 9)));
          height: min(100vh, calc(100vw * (9 / 16)));
          aspect-ratio: 16 / 9;
          pointer-events: none;
          z-index: 3;
        }

        @media (max-width: 768px) {
          .stage-content-wrapper {
            width: 100vw;
            height: calc(100vw * (9 / 16));
            transform: translate(-50%, -50%) scale(2.15);
            transform-origin: center center;
          }
        }

        @media (max-width: 480px) {
          .stage-content-wrapper {
            width: 100vw;
            height: calc(100vw * (9 / 16));
            transform: translate(-50%, -50%) scale(2.35);
            transform-origin: center center;
          }
        }

        #bg-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
          pointer-events: none;
        }

        #webs-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: screen;
          overflow: hidden;
        }

        .webs-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.78);
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          display: block;
          opacity: 0.92;
          filter: contrast(1.1) brightness(1.05);
        }

        #prizes-title-layer {
          position: absolute;
          top: 3.5%;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(220px, 20vw, 320px);
          z-index: 10;
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 768px) {
          #prizes-title-layer {
            top: 30.0%;
            width: clamp(160px, 44vw, 240px);
          }
        }

        @media (max-width: 480px) {
          #prizes-title-layer {
            top: 31.5%;
            width: clamp(145px, 46vw, 210px);
          }
        }

        .prizes-title-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          pointer-events: none;
          display: block;
          image-rendering: high-quality;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.7));
        }

        #prizes-money-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
          transform: translateX(-1.8%);
        }

        .prizes-money-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
          image-rendering: high-quality;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.8));
        }

        #trophies-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none !important;
        }

        .trophy-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none !important;
          transform: none !important;
          will-change: auto;
        }

        .trophy-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none !important;
          display: block;
          image-rendering: high-quality;
          image-rendering: -webkit-optimize-contrast;
        }

        #trophy-left .trophy-img {
          transform: translateX(-4.0%) translateY(3.0%) rotate(-12.0deg) scale(0.90) translateZ(0);
          transform-origin: 32.0% 50%;
        }

        #trophy-center .trophy-img {
          transform: translateX(-2.5%) scale(1.08) translateZ(0);
          transform-origin: 50.6% 55%;
        }

        #trophy-right .trophy-img {
          transform: translateZ(0);
          transform-origin: 70.5% 50%;
        }
      `}</style>
    </section>
  );
}
