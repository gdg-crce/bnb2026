import * as THREE from 'three';

// DOM Elements
const stage = document.getElementById('stage-16-9');
const canvas = document.getElementById('bg-canvas');

// Offscreen Canvas for Pixel Color Sampling
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
let bgImageLoaded = false;

const bgImg = new Image();
bgImg.onload = () => {
  sampleCanvas.width = bgImg.width;
  sampleCanvas.height = bgImg.height;
  sampleCtx.drawImage(bgImg, 0, 0);
  bgImageLoaded = true;
};
bgImg.src = '/assets/01_MASTER_BACKGROUND.png';

// Trophy Wrappers & Hitboxes
const trophies = {
  left: {
    wrapper: document.getElementById('trophy-left'),
    hitbox: document.getElementById('hitbox-left'),
    isHovered: false,
    curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
    target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 }
  },
  center: {
    wrapper: document.getElementById('trophy-center'),
    hitbox: document.getElementById('hitbox-center'),
    isHovered: false,
    curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
    target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 }
  },
  right: {
    wrapper: document.getElementById('trophy-right'),
    hitbox: document.getElementById('hitbox-right'),
    isHovered: false,
    curr: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 },
    target: { tx: 0, ty: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1 }
  }
};

// Strictly Protected Award Zones (No mutation or spawning directly on trophies)
const trophySafetyZones = [
  { minX: 0.14, maxX: 0.38, minY: 0.18, maxY: 0.90 }, // Left trophy zone
  { minX: 0.40, maxX: 0.58, minY: 0.18, maxY: 0.88 }, // Center trophy zone
  { minX: 0.58, maxX: 0.76, minY: 0.20, maxY: 0.88 }  // Right trophy zone
];

// -------------------------------------------------------------
// BUBBLE SIMULATION ENGINE (128 DENSE ROUNDED ORGANIC BUBBLES)
// -------------------------------------------------------------
const MAX_BUBBLES = 128;
const bubbles = [];

for (let i = 0; i < MAX_BUBBLES; i++) {
  bubbles.push({
    active: false,
    st: new THREE.Vector2(0, 0),
    originSt: new THREE.Vector2(0, 0),
    vel: new THREE.Vector2(0, 0),
    maxRadius: 0.012,
    currentRadius: 0.0,
    color: new THREE.Vector3(0.0, 0.9, 1.0),
    state: 0, // 0: inactive, 1: emerging, 2: floating, 3: popping, 4: merging
    life: 0.0,
    maxLife: 1.0,
    shapeParams: new THREE.Vector2(Math.random(), Math.random())
  });
}

function isInsideProtectedTrophyArea(st, normX, normY) {
  for (let z of trophySafetyZones) {
    if (normX >= z.minX && normX <= z.maxX && normY >= (1.0 - z.maxY) && normY <= (1.0 - z.minY)) {
      return true;
    }
  }
  return false;
}

function spawnSingleBubble(borderSt, normX, normY, colorVec, radiusSize) {
  if (isInsideProtectedTrophyArea(borderSt, normX, normY)) return;

  const b = bubbles.find(item => !item.active);
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
  b.state = 1; // emerging
  b.life = 0.0;
  b.maxLife = 0.7 + Math.random() * 1.5;
  b.shapeParams.set(Math.random(), Math.random());
}

function spawnBubbleCluster(mouseSt, normX, normY, baseColorVec) {
  if (isInsideProtectedTrophyArea(mouseSt, normX, normY)) return;

  const count = 6 + Math.floor(Math.random() * 7);
  
  for (let i = 0; i < count; i++) {
    const offsetAngle = Math.random() * Math.PI * 2;
    const offsetDist = Math.random() * 0.065;
    const spawnSt = mouseSt.clone().add(new THREE.Vector2(Math.cos(offsetAngle) * offsetDist, Math.sin(offsetAngle) * offsetDist));

    const sizeRoll = Math.random();
    let size = 0.004 + Math.random() * 0.004; // extremely tiny
    if (sizeRoll > 0.40 && sizeRoll <= 0.75) {
      size = 0.008 + Math.random() * 0.006; // small
    } else if (sizeRoll > 0.75 && sizeRoll <= 0.93) {
      size = 0.014 + Math.random() * 0.008; // medium
    } else if (sizeRoll > 0.93) {
      size = 0.022 + Math.random() * 0.009; // larger
    }

    const colorVar = new THREE.Vector3(
      Math.min(1.0, baseColorVec.x * (0.88 + Math.random() * 0.28)),
      Math.min(1.0, baseColorVec.y * (0.88 + Math.random() * 0.28)),
      Math.min(1.0, baseColorVec.z * (0.88 + Math.random() * 0.28))
    );

    spawnSingleBubble(spawnSt, normX, normY, colorVar, size);
  }
}

function updateBubbles(dt) {
  for (let b of bubbles) {
    if (!b.active) continue;

    b.life += dt;
    const normLife = b.life / b.maxLife;

    if (b.state === 1) {
      b.currentRadius += (b.maxRadius - b.currentRadius) * 0.20;
      if (b.currentRadius >= b.maxRadius * 0.85) {
        b.state = 2; // floating locally
      }
    } else if (b.state === 2) {
      b.st.add(b.vel);

      if (normLife > 0.65) {
        b.state = (Math.random() > 0.4) ? 3 : 4;
      }
    } else if (b.state === 3) {
      b.currentRadius += b.maxRadius * 0.18;
      if (normLife >= 1.0 || b.currentRadius > b.maxRadius * 1.5) {
        b.active = false;
      }
    } else if (b.state === 4) {
      b.currentRadius *= 0.80;
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

// Helper to sample exact pixel color under cursor from artwork with vibrant boost
function sampleArtworkColor(normX, normY) {
  if (!bgImageLoaded) return new THREE.Vector3(0.0, 0.95, 1.0);

  const px = Math.floor(normX * sampleCanvas.width);
  const py = Math.floor((1.0 - normY) * sampleCanvas.height);

  const clampedX = Math.max(0, Math.min(sampleCanvas.width - 1, px));
  const clampedY = Math.max(0, Math.min(sampleCanvas.height - 1, py));

  const pixelData = sampleCtx.getImageData(clampedX, clampedY, 1, 1).data;
  let r = pixelData[0] / 255.0;
  let g = pixelData[1] / 255.0;
  let b = pixelData[2] / 255.0;

  if (r < 0.12 && g < 0.12 && b < 0.12) {
    return new THREE.Vector3(0.12, 0.12, 0.22);
  }

  const maxChannel = Math.max(r, Math.max(g, b));
  if (maxChannel > 0) {
    r = Math.min(1.0, (r / maxChannel) * 1.15 * maxChannel);
    g = Math.min(1.0, (g / maxChannel) * 1.15 * maxChannel);
    b = Math.min(1.0, (b / maxChannel) * 1.15 * maxChannel);
  }

  return new THREE.Vector3(r, g, b);
}

// -------------------------------------------------------------
// WEBGL SHADER SYSTEM (PRISTINE WEBS + WEB LIGHTNING + DENSE BUBBLES)
// -------------------------------------------------------------
let renderer, scene, camera, material;
let mousePos = new THREE.Vector2(0.5, 0.5);
let targetMousePos = new THREE.Vector2(0.5, 0.5);
let lastMousePos = new THREE.Vector2(0.5, 0.5);
let activity = 0.0;
let targetActivity = 0.0;
let clock = new THREE.Clock();

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

  uniform vec4 u_bubbles[128];      // x, y, radius, state
  uniform vec3 u_bubbleColors[128]; // r, g, b
  uniform vec2 u_bubbleParams[128]; // phase, shapeSeed

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
    
    // Sample master background
    vec4 baseColor = texture2D(u_texture, uv);
    
    float distFromCenter = length(st);
    float centerProtection = smoothstep(0.20, 0.38, distFromCenter);
    float colorLuma = max(baseColor.r, max(baseColor.g, baseColor.b));
    float isArtwork = centerProtection * smoothstep(0.02, 0.10, colorLuma);
    
    float distToMouse = length(st - mouseSt);
    float cursorRadius = 0.25;
    float cursorInfluence = smoothstep(cursorRadius, 0.0, distToMouse) * u_activity * isArtwork;
    
    vec3 compColor = baseColor.rgb;
    
    // ---------------------------------------------------------
    // 1. COLORED ELECTRIC LIGHTNING / SPIDER-VERSE GLITCH EDGE
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // 2. SUBTLE ELECTRIC ENERGY PULSES ALONG CENTRAL SPIDER WEBS
    // ---------------------------------------------------------
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
    
    // ---------------------------------------------------------
    // 3. PURE FILLED DENSE ROUNDED MUTATING BUBBLES (128 SLOTS)
    // ---------------------------------------------------------
    float fps = 12.0;
    float steppedTime = floor(u_time * fps) / fps;

    for (int i = 0; i < 128; i++) {
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

function initWebGL() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const textureLoader = new THREE.TextureLoader();
  const bgTexture = textureLoader.load('/assets/01_MASTER_BACKGROUND.png', () => {
    renderer.render(scene, camera);
  });
  bgTexture.minFilter = THREE.LinearFilter;
  bgTexture.magFilter = THREE.LinearFilter;
  bgTexture.generateMipmaps = false;

  const bubbleVec4s = [];
  const bubbleColors = [];
  const bubbleParams = [];
  for (let i = 0; i < MAX_BUBBLES; i++) {
    bubbleVec4s.push(new THREE.Vector4(0, 0, 0, 0));
    bubbleColors.push(new THREE.Vector3(0, 0, 0));
    bubbleParams.push(new THREE.Vector2(0, 0));
  }

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_texture: { value: bgTexture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_activity: { value: 0.0 },
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(stage.clientWidth, stage.clientHeight) },
      u_bubbles: { value: bubbleVec4s },
      u_bubbleColors: { value: bubbleColors },
      u_bubbleParams: { value: bubbleParams }
    }
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  scene.add(quad);

  resizeWebGL();
}

function resizeWebGL() {
  if (!renderer || !material) return;
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  renderer.setSize(width, height, false);
  material.uniforms.u_resolution.value.set(width, height);
}

window.addEventListener('resize', resizeWebGL);

// -------------------------------------------------------------
// LOCAL BORDER DENSE CLUSTER ACTIVATION (NO CURSOR TRAIL)
// -------------------------------------------------------------
let lastSpawnTime = 0;

stage.addEventListener('mousemove', (e) => {
  const rect = stage.getBoundingClientRect();
  const normX = (e.clientX - rect.left) / rect.width;
  const normY = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL UV Y
  
  targetMousePos.set(normX, normY);

  const aspect = stage.clientWidth / stage.clientHeight;
  const mouseSt = new THREE.Vector2((normX - 0.5) * aspect, normY - 0.5);

  if (isInsideProtectedTrophyArea(mouseSt, normX, 1.0 - normY)) {
    targetActivity = 0.0;
    return;
  }

  const distMoved = targetMousePos.distanceTo(lastMousePos);
  lastMousePos.copy(targetMousePos);
  
  targetActivity = Math.min(1.0, activity + distMoved * 8.0 + 0.15);

  const now = performance.now();
  if (now - lastSpawnTime > 65) {
    lastSpawnTime = now;

    const sampledColor = sampleArtworkColor(normX, normY);
    spawnBubbleCluster(mouseSt, normX, 1.0 - normY, sampledColor);
  }
});

stage.addEventListener('mouseleave', () => {
  targetActivity = 0.0;
  Object.keys(trophies).forEach(key => {
    trophies[key].isHovered = false;
    trophies[key].target.tx = 0;
    trophies[key].target.ty = 0;
    trophies[key].target.rotX = 0;
    trophies[key].target.rotY = 0;
    trophies[key].target.rotZ = 0;
    trophies[key].target.scale = 1;
  });
});

// Setup Trophy Hitbox Events
Object.keys(trophies).forEach(key => {
  const trophy = trophies[key];
  const hitbox = trophy.hitbox;

  hitbox.addEventListener('mouseenter', () => {
    trophy.isHovered = true;
    trophy.target.ty = -14.0;
    trophy.target.scale = 1.012;
  });

  hitbox.addEventListener('mousemove', (e) => {
    if (!trophy.isHovered) return;
    const rect = hitbox.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2.0;

    trophy.target.tx = normX * 5.0;
    trophy.target.rotZ = normX * 1.5;
    trophy.target.rotY = normX * 3.0;
    trophy.target.rotX = -normY * 2.5;
  });

  hitbox.addEventListener('mouseleave', () => {
    trophy.isHovered = false;
    trophy.target.tx = 0;
    trophy.target.ty = 0;
    trophy.target.rotX = 0;
    trophy.target.rotY = 0;
    trophy.target.rotZ = 0;
    trophy.target.scale = 1;
  });
});

// -------------------------------------------------------------
// MAIN ANIMATION LOOP
// -------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  mousePos.lerp(targetMousePos, 0.1);
  activity += (targetActivity - activity) * 0.08;
  targetActivity *= 0.94;

  updateBubbles(delta);

  if (material) {
    material.uniforms.u_mouse.value.copy(mousePos);
    material.uniforms.u_activity.value = activity;
    material.uniforms.u_time.value = elapsedTime;

    const bVecs = material.uniforms.u_bubbles.value;
    const bCols = material.uniforms.u_bubbleColors.value;
    const bPars = material.uniforms.u_bubbleParams.value;

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

  Object.keys(trophies).forEach(key => {
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

// Start
initWebGL();
animate();
