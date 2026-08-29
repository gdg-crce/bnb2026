"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PrizesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trophyLeftRef = useRef<HTMLDivElement>(null);
  const trophyCenterRef = useRef<HTMLDivElement>(null);
  const trophyRightRef = useRef<HTMLDivElement>(null);
  const hitboxLeftRef = useRef<HTMLDivElement>(null);
  const hitboxCenterRef = useRef<HTMLDivElement>(null);
  const hitboxRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const trophyLeft = trophyLeftRef.current;
    const trophyCenter = trophyCenterRef.current;
    const trophyRight = trophyRightRef.current;
    const hitboxLeft = hitboxLeftRef.current;
    const hitboxCenter = hitboxCenterRef.current;
    const hitboxRight = hitboxRightRef.current;

    if (!stage || !canvas || !trophyLeft || !trophyCenter || !trophyRight || !hitboxLeft || !hitboxCenter || !hitboxRight) {
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

    // Trophy Wrappers & Hitboxes
    const trophies = {
      left: {
        wrapper: trophyLeft,
        hitbox: hitboxLeft,
        isHovered: false,
        curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
        target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
      },
      center: {
        wrapper: trophyCenter,
        hitbox: hitboxCenter,
        isHovered: false,
        curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
        target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
      },
      right: {
        wrapper: trophyRight,
        hitbox: hitboxRight,
        isHovered: false,
        curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
        target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
      },
    };

    // Strictly Protected Award Zones (exact trophy silhouettes)
    const trophySafetyZones = [
      { minX: 0.17, maxX: 0.36, minY: 0.23, maxY: 0.88 }, // Left trophy
      { minX: 0.43, maxX: 0.56, minY: 0.23, maxY: 0.84 }, // Center trophy
      { minX: 0.61, maxX: 0.74, minY: 0.25, maxY: 0.83 }, // Right trophy
    ];

    // -------------------------------------------------------------
    // BUBBLE SIMULATION ENGINE (200 DENSE ROUNDED ORGANIC BUBBLES)
    // -------------------------------------------------------------
    const MAX_BUBBLES = 200;
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

    function isInsideProtectedTrophyArea(st: THREE.Vector2, normX: number, topDownY: number) {
      for (const z of trophySafetyZones) {
        if (normX >= z.minX && normX <= z.maxX && topDownY >= z.minY && topDownY <= z.maxY) {
          return true;
        }
      }
      return false;
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
      // Don't spawn bubbles on the outer edge margins (prevents cut-off lines)
      if (normX < 0.06 || normX > 0.94 || normY < 0.06 || normY > 0.94) {
        return null;
      }

      const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
      const distFromCenter = Math.hypot((normX - 0.5) * aspect, (1.0 - normY) - 0.5);

      // Don't bubble in the center (keeps center awards & trophies clean and unobstructed)
      if (distFromCenter < 0.22) {
        return null;
      }

      if (!bgImageLoaded || !sampleCtx) {
        return normX < 0.48 ? new THREE.Vector3(0.55, 0.04, 0.92) : new THREE.Vector3(0.0, 0.85, 1.0);
      }

      const px = Math.floor(normX * sampleCanvas.width);
      const py = Math.floor((1.0 - normY) * sampleCanvas.height);

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
    const clock = new THREE.Clock();

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
        
        vec4 baseColor = texture2D(u_texture, uv);
        
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
      (Object.keys(trophies) as Array<keyof typeof trophies>).forEach((key) => {
        trophies[key].isHovered = false;
        trophies[key].target.tx = 0;
        trophies[key].target.ty = 0;
        trophies[key].target.rotX = 0;
        trophies[key].target.rotY = 0;
        trophies[key].target.rotZ = 0;
        trophies[key].target.scale = 1;
      });
    };

    stage.addEventListener("mousemove", onStageMouseMove);
    stage.addEventListener("mouseleave", onStageMouseLeave);
    if (section && section !== stage) {
      section.addEventListener("mousemove", onStageMouseMove);
      section.addEventListener("mouseleave", onStageMouseLeave);
    }

    // Setup Trophy Hitbox Events
    const hitboxCleanups: Array<() => void> = [];

    (Object.keys(trophies) as Array<keyof typeof trophies>).forEach((key) => {
      const trophy = trophies[key];
      const hitbox = trophy.hitbox;

      const onHitboxEnter = () => {
        trophy.isHovered = true;
        trophy.target.ty = -14.0;
        trophy.target.scale = 1.012;
      };

      const onHitboxMove = (e: MouseEvent) => {
        if (!trophy.isHovered) return;
        const rect = hitbox.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2.0;

        trophy.target.tx = normX * 5.0;
        trophy.target.rotZ = normX * 1.5;
        trophy.target.rotY = normX * 3.0;
        trophy.target.rotX = -normY * 2.5;
      };

      const onHitboxLeave = () => {
        trophy.isHovered = false;
        trophy.target.tx = 0;
        trophy.target.ty = 0;
        trophy.target.rotX = 0;
        trophy.target.rotY = 0;
        trophy.target.rotZ = 0;
        trophy.target.scale = 1;
      };

      hitbox.addEventListener("mouseenter", onHitboxEnter);
      hitbox.addEventListener("mousemove", onHitboxMove);
      hitbox.addEventListener("mouseleave", onHitboxLeave);

      hitboxCleanups.push(() => {
        hitbox.removeEventListener("mouseenter", onHitboxEnter);
        hitbox.removeEventListener("mousemove", onHitboxMove);
        hitbox.removeEventListener("mouseleave", onHitboxLeave);
      });
    });

    // -------------------------------------------------------------
    // AMBIENT CONTINUOUS IDLE BUBBLING (Rich Black & Grey Majority, Outward Flow)
    // -------------------------------------------------------------
    let lastAmbientSpawnTime = 0;

    function getBlackOrGreyColor(): THREE.Vector3 {
      const roll = Math.random();
      if (roll < 0.60) {
        return new THREE.Vector3(0.015, 0.015, 0.025); // Deep ink black
      } else if (roll < 0.88) {
        return new THREE.Vector3(0.06 + Math.random() * 0.03, 0.06 + Math.random() * 0.03, 0.09 + Math.random() * 0.03); // Charcoal dark grey
      } else {
        return new THREE.Vector3(0.12 + Math.random() * 0.04, 0.12 + Math.random() * 0.04, 0.16 + Math.random() * 0.04); // Medium ink grey
      }
    }

    function spawnAmbientBubbles(now: number) {
      if (now - lastAmbientSpawnTime < 30) return;
      lastAmbientSpawnTime = now;

      let activeCount = 0;
      for (let i = 0; i < MAX_BUBBLES; i++) {
        if (bubbles[i].active) activeCount++;
      }

      // Maintain a rich, continuous baseline of 100-140 active ambient bubbles throughout
      if (activeCount < 130) {
        const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
        const spawnBatch = 2 + Math.floor(Math.random() * 3); // 2 to 4 bubbles per tick

        for (let s = 0; s < spawnBatch; s++) {
          const ambientNormX = 0.07 + Math.random() * 0.86;
          const ambientNormY = 0.07 + Math.random() * 0.86;

          const sampledColor = sampleArtworkColor(ambientNormX, ambientNormY);
          if (!sampledColor) continue; // Completely skips the center and canvas borders

          const ambientSt = new THREE.Vector2((ambientNormX - 0.5) * aspect, ambientNormY - 0.5);
          const sizeRoll = Math.random();
          let size: number;
          if (sizeRoll < 0.50) {
            size = 0.004 + Math.random() * 0.004; // small ink speckle
          } else if (sizeRoll < 0.82) {
            size = 0.009 + Math.random() * 0.006; // medium organic bubble
          } else {
            size = 0.016 + Math.random() * 0.009; // large floating orb
          }

          const b = bubbles.find((item) => !item.active);
          if (b) {
            b.active = true;
            b.st.copy(ambientSt);
            b.originSt.copy(ambientSt);

            // Radial outward motion from center outward
            const outwardAngle = Math.atan2(ambientSt.y, ambientSt.x) + (Math.random() - 0.5) * 0.7;
            const speed = 0.00015 + Math.random() * 0.00030;
            b.vel.set(Math.cos(outwardAngle) * speed, Math.sin(outwardAngle) * speed);

            b.maxRadius = size;
            b.currentRadius = 0.0;
            b.color.copy(sampledColor);
            b.state = 1;
            b.life = 0.0;
            b.maxLife = 1.6 + Math.random() * 2.6;
            b.shapeParams.set(Math.random(), Math.random());
          }
        }
      }
    }

    // Seed initial ambient bubbles across the image
    function seedInitialBubbles() {
      const aspect = ((stage?.clientWidth || 1920) / (stage?.clientHeight || 1080));
      for (let i = 0; i < 75; i++) {
        const ambientNormX = 0.07 + Math.random() * 0.86;
        const ambientNormY = 0.07 + Math.random() * 0.86;

        const sampledColor = sampleArtworkColor(ambientNormX, ambientNormY);
        if (!sampledColor) continue;

        const ambientSt = new THREE.Vector2((ambientNormX - 0.5) * aspect, ambientNormY - 0.5);
        const b = bubbles[i];
        if (b) {
          b.active = true;
          b.st.copy(ambientSt);
          b.originSt.copy(ambientSt);
          const outwardAngle = Math.atan2(ambientSt.y, ambientSt.x) + (Math.random() - 0.5) * 0.7;
          const speed = 0.00015 + Math.random() * 0.00030;
          b.vel.set(Math.cos(outwardAngle) * speed, Math.sin(outwardAngle) * speed);
          b.maxRadius = 0.006 + Math.random() * 0.010;
          b.currentRadius = b.maxRadius * (0.3 + Math.random() * 0.6);
          b.color.copy(sampledColor);
          b.state = 2;
          b.maxLife = 1.6 + Math.random() * 2.6;
          b.life = b.maxLife * Math.random();
          b.shapeParams.set(Math.random(), Math.random());
        }
      }
    }

    seedInitialBubbles();

    // -------------------------------------------------------------
    // MAIN ANIMATION LOOP
    // -------------------------------------------------------------
    function animate() {
      if (isDestroyed) return;
      animFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();

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

      (Object.keys(trophies) as Array<keyof typeof trophies>).forEach((key) => {
        const trophy = trophies[key];
        const curr = trophy.curr;
        const target = trophy.target;

        const lerpFactor = 0.08;
        curr.tx += (target.tx - curr.tx) * lerpFactor;
        curr.ty += (target.ty - curr.ty) * lerpFactor;
        curr.rotX += (target.rotX - curr.rotX) * lerpFactor;
        curr.rotY += (target.rotY - curr.rotY) * lerpFactor;
        curr.rotZ += (target.rotZ - curr.rotZ) * lerpFactor;
        curr.scale += (target.scale - curr.scale) * lerpFactor;

        trophy.wrapper.style.transform = `translate3d(${curr.tx.toFixed(2)}px, ${curr.ty.toFixed(2)}px, 0px) rotateX(${curr.rotX.toFixed(2)}deg) rotateY(${curr.rotY.toFixed(2)}deg) rotateZ(${curr.rotZ.toFixed(2)}deg) scale(${curr.scale.toFixed(4)})`;
      });
    }

    animate();

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resizeWebGL);
      resizeObserver.disconnect();
      stage.removeEventListener("mousemove", onStageMouseMove);
      stage.removeEventListener("mouseleave", onStageMouseLeave);
      if (section && section !== stage) {
        section.removeEventListener("mousemove", onStageMouseMove);
        section.removeEventListener("mouseleave", onStageMouseLeave);
      }
      hitboxCleanups.forEach((cleanup) => cleanup());

      geometry.dispose();
      material.dispose();
      bgTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="prizes" ref={sectionRef} className="prizes-experience-section">
      {/* 16:9 Desktop Viewport Stage */}
      <div id="stage-16-9" ref={stageRef} className="stage-container">
        {/* WebGL Background Layer */}
        <canvas id="bg-canvas" ref={canvasRef}></canvas>

        {/* Spider Webs Layer */}
        <div id="webs-layer">
          <img
            src="/assets/07_SPIDER_WEBS.png"
            alt="Spider Webs"
            className="webs-img"
            draggable={false}
          />
        </div>

        {/* Trophy Interactive Layers */}
        <div id="trophies-layer">
          <div className="trophy-wrapper" id="trophy-left" ref={trophyLeftRef} data-trophy="left">
            <img src="/assets/03_LEFT_TROPHY.png" alt="Left Trophy" className="trophy-img" draggable={false} />
          </div>

          <div className="trophy-wrapper" id="trophy-center" ref={trophyCenterRef} data-trophy="center">
            <img src="/assets/04_CENTER_TROPHY.png" alt="Center Trophy" className="trophy-img" draggable={false} />
          </div>

          <div className="trophy-wrapper" id="trophy-right" ref={trophyRightRef} data-trophy="right">
            <img src="/assets/05_RIGHT_TROPHY.png" alt="Right Trophy" className="trophy-img" draggable={false} />
          </div>

          <div className="trophy-hitbox" id="hitbox-left" ref={hitboxLeftRef} data-trophy="left"></div>
          <div className="trophy-hitbox" id="hitbox-center" ref={hitboxCenterRef} data-trophy="center"></div>
          <div className="trophy-hitbox" id="hitbox-right" ref={hitboxRightRef} data-trophy="right"></div>
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
          width: min(100vw, calc(100vh * (16 / 9)));
          height: min(100vh, calc(100vw * (9 / 16)));
          aspect-ratio: 16 / 9;
          background-color: #000000;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
          pointer-events: auto;
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
        }

        .webs-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
          opacity: 0.92;
          filter: contrast(1.1) brightness(1.05);
        }

        #trophies-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          perspective: 1200px;
          pointer-events: none;
        }

        .trophy-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .trophy-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          display: block;
          image-rendering: high-quality;
          image-rendering: -webkit-optimize-contrast;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
        }

        .trophy-hitbox {
          position: absolute;
          pointer-events: auto;
          cursor: pointer;
          z-index: 10;
        }

        #hitbox-left {
          left: 16.91%;
          top: 22.65%;
          width: 19.55%;
          height: 66.28%;
        }

        #hitbox-center {
          left: 42.68%;
          top: 22.52%;
          width: 12.88%;
          height: 61.46%;
        }

        #hitbox-right {
          left: 60.54%;
          top: 25%;
          width: 13.4%;
          height: 58.33%;
        }
      `}</style>
    </section>
  );
}
