/* ============================================================
   INTERACTIVE WEBGL BACKGROUND
   React Three Fiber · Custom Shader Particles
   Mouse-reactive · Cyan/Purple · Performance-tiered
   
   Rendered as Astro island: <InteractiveBackground client:load />
   Container CSS: .webgl-canvas-container (position:fixed, z:0)
   Hidden on mobile (<1024px) via CSS in global.css
   ============================================================ */

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   PERFORMANCE TIER DETECTION
   Mirrors the logic in animations.js so both systems agree
   ============================================================ */
type PerfTier = 'lite' | 'mid' | 'full';

function detectPerfTier(): PerfTier {
  if (typeof window === 'undefined') return 'mid';

  const isMobile =
    window.innerWidth < 1024 || 'ontouchstart' in window;
  if (isMobile) return 'lite';

  try {
    const testCanvas = document.createElement('canvas');
    const gl =
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');
    if (!gl) return 'lite';

    const glCtx = gl as WebGLRenderingContext;
    const debugInfo = glCtx.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? glCtx
          .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          .toLowerCase()
      : '';

    const isWeakGPU =
      renderer.includes('intel') ||
      renderer.includes('mesa') ||
      renderer.includes('swiftshader') ||
      renderer.includes('llvmpipe');

    const cores = navigator.hardwareConcurrency || 2;
    const memory =
      (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

    if (isWeakGPU || cores <= 2 || memory <= 2) return 'lite';
    if (cores <= 4 || memory <= 4) return 'mid';
    return 'full';
  } catch {
    return 'mid';
  }
}

/* ============================================================
   TIER CONFIGURATION
   Particle count, interaction strength, animation speed, DPR
   ============================================================ */
const TIER_CONFIG: Record<
  PerfTier,
  {
    count: number;
    mouseInfluence: number;
    speed: number;
    dpr: number | [number, number];
  }
> = {
  lite: { count: 600, mouseInfluence: 0.25, speed: 0.3, dpr: 1 },
  mid: { count: 2000, mouseInfluence: 0.5, speed: 0.45, dpr: [1, 1.5] },
  full: { count: 4500, mouseInfluence: 0.7, speed: 0.55, dpr: [1, 2] },
};

/* ============================================================
   GLSL: 3D Simplex Noise
   Classic implementation by Ian McEwan, Ashima Arts
   Used in vertex shader for organic fluid motion
   ============================================================ */
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 10.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i);
    vec4 p = permute(
      permute(
        permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0)
        ) + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      ) + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    // Gradients: 7x7 points over a square, mapped to a hexagon
    float n_ = 0.142857142857; // 1.0 / 7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(
      vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3))
    );
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(
      0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)),
      0.0
    );
    m = m * m;
    return 42.0 * dot(
      m * m,
      vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))
    );
  }
`;

/* ============================================================
   VERTEX SHADER
   Noise displacement · Mouse attraction · Depth-based sizing
   Color shift near cursor · Alpha pulse + proximity glow
   ============================================================ */
const VERTEX_SHADER = /* glsl */ `
  ${NOISE_GLSL}

  uniform float uTime;
  uniform vec3  uMouse;
  uniform float uMouseInfluence;
  uniform float uSpeed;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aOffset;
  attribute vec3  aColor;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float t = uTime * uSpeed;

    // ---- Primary noise displacement (organic fluid motion) ----
    float n1 = snoise(vec3(pos.x * 0.22,          pos.y * 0.22,          t * 0.18));
    float n2 = snoise(vec3(pos.y * 0.22 + 31.7,   pos.z * 0.22,          t * 0.18 + 47.3));
    float n3 = snoise(vec3(pos.z * 0.22 + 73.1,   pos.x * 0.22,          t * 0.18 + 91.5));

    pos.x += n1 * 1.4;
    pos.y += n2 * 1.1;
    pos.z += n3 * 0.7;

    // ---- Secondary wave (adds current-like flow) ----
    pos.y += sin(pos.x * 0.25 + t * 0.35) * 0.35;
    pos.x += cos(pos.y * 0.20 + t * 0.28) * 0.25;

    // ---- Gentle Z-axis breathing (per-particle phase) ----
    pos.z += sin(t * 0.15 + aOffset * 6.283185) * 0.35;

    // ---- Mouse attraction ----
    vec3  toMouse    = uMouse - pos;
    float mouseDist  = length(toMouse);
    float mouseEffect = smoothstep(5.0, 0.0, mouseDist) * uMouseInfluence;
    vec3  mouseDir   = normalize(toMouse + vec3(0.001));
    pos += mouseDir * mouseEffect * 1.8;

    // ---- Transform to clip space ----
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position     = projectionMatrix * mvPosition;

    // ---- Point size (depth-attenuated) ----
    float depth          = -mvPosition.z;
    float sizeAttenuation = 280.0 / max(depth, 0.1);
    gl_PointSize = aSize * sizeAttenuation * uPixelRatio;
    gl_PointSize = clamp(gl_PointSize, 1.0, 45.0);

    // ---- Color: shift toward cyan near cursor ----
    float mouseColorShift = smoothstep(4.0, 0.0, mouseDist) * 0.35;
    vColor = mix(aColor, vec3(0.0, 0.94, 1.0), mouseColorShift);

    // ---- Alpha: pulse · depth fade · mouse proximity glow ----
    float pulse     = sin(aOffset * 6.283185 + t * 0.55) * 0.2 + 0.8;
    float depthFade = smoothstep(18.0, 1.0, depth);
    float mouseGlow = smoothstep(3.5, 0.0, mouseDist) * 0.6;

    vAlpha = pulse * depthFade * (0.25 + mouseGlow);
  }
`;

/* ============================================================
   FRAGMENT SHADER
   Soft circular point · Bright core glow · Additive blending
   ============================================================ */
const FRAGMENT_SHADER = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Distance from point center (0–0.707 for square point coord)
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);

    // Soft circular falloff (quadratic for extra smoothness)
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha;
    alpha *= vAlpha;

    // Bright core glow
    float core  = 1.0 - smoothstep(0.0, 0.12, dist);
    vec3  color = vColor + core * vColor * 0.5;

    // Discard near-invisible fragments for performance
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ============================================================
   PARTICLE FIELD — Inner R3F Component
   Manages geometry, uniforms, and per-frame animation
   ============================================================ */
interface ParticleFieldProps {
  count: number;
  mouseInfluence: number;
  speed: number;
}

function ParticleField({ count, mouseInfluence, speed }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const mouseTarget = useRef(new THREE.Vector3(0, 0, 0));
  const mouseCurrent = useRef(new THREE.Vector3(0, 0, 0));

  const { viewport, pointer } = useThree();

  /* --- Shader uniforms (created once, mutated in useFrame) --- */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseInfluence: { value: mouseInfluence },
      uSpeed: { value: speed },
      uPixelRatio: {
        value: Math.min(
          typeof window !== 'undefined' ? window.devicePixelRatio : 1,
          2
        ),
      },
    }),
    // Intentionally empty — uniforms are mutated, not recreated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* --- Generate particle buffer attributes --- */
  const { positions, sizes, offsets, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const offsets = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Color palette matching design system
    const cyan = new THREE.Color(0x00f0ff);
    const purple = new THREE.Color(0xbf00ff);
    const blue = new THREE.Color(0x3b82f6);
    const deepCyan = new THREE.Color(0x005566);
    const deepPurple = new THREE.Color(0x4a0066);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // --- Ellipsoidal distribution for cinematic spread ---
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      // Power curve: more particles near center, fewer at edges
      const radius = Math.pow(Math.random(), 0.55) * 9;

      // Wider on X, medium Y, shallow Z (flat disc-like cloud)
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius * 2.0;
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 1.2;
      // Z offset -2 pushes cloud slightly behind camera focus plane
      positions[i3 + 2] = Math.cos(phi) * radius * 0.7 - 2;

      // --- Size: power distribution (many small, few large) ---
      sizes[i] = Math.pow(Math.random(), 2.2) * 4.5 + 0.4;

      // --- Phase offset for individual animation timing ---
      offsets[i] = Math.random();

      // --- Color distribution across palette ---
      const t = Math.random();
      let color: THREE.Color;

      if (t < 0.28) {
        // Cyan family (28%)
        color = cyan.clone().lerp(deepCyan, Math.random() * 0.6);
      } else if (t < 0.5) {
        // Purple family (22%)
        color = purple.clone().lerp(deepPurple, Math.random() * 0.6);
      } else if (t < 0.7) {
        // Cyan ↔ Purple gradient (20%)
        color = cyan.clone().lerp(purple, Math.random());
      } else if (t < 0.87) {
        // Blue ↔ Cyan (17%)
        color = blue.clone().lerp(cyan, Math.random());
      } else {
        // Bright accent sparks — sparse, small (13%)
        color = new THREE.Color(0xffffff).lerp(
          cyan,
          0.25 + Math.random() * 0.35
        );
        sizes[i] *= 0.6; // bright but small
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, sizes, offsets, colors };
  }, [count]);

  /* --- Per-frame animation loop --- */
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const mat = pointsRef.current.material as THREE.ShaderMaterial;

    // Advance time
    mat.uniforms.uTime.value += delta;

    // Convert 2D normalized pointer → 3D world position on z=0 plane
    mouseTarget.current.set(
      pointer.x * viewport.width * 0.5,
      pointer.y * viewport.height * 0.5,
      0
    );

    // Frame-rate-independent smooth mouse lerp
    // At 60fps: factor ≈ 0.08 | At 30fps: factor ≈ 0.15
    const lerpFactor = 1 - Math.pow(0.92, delta * 60);
    mouseCurrent.current.lerp(mouseTarget.current, lerpFactor);
    mat.uniforms.uMouse.value.copy(mouseCurrent.current);

    // Ultra-slow ambient rotation for subtle depth movement
    pointsRef.current.rotation.y += delta * 0.012;
    pointsRef.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        {/* Position attribute — standard Three.js name */}
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        {/* Custom attributes for per-particle variation */}
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          args={[offsets, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   AMBIENT DEPTH PLANE
   Subtle large glow behind particle field for depth perception
   ============================================================ */
function AmbientGlow() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x00f0ff) },
      uColor2: { value: new THREE.Color(0xbf00ff) },
    }),
    []
  );

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[40, 25]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3  uColor1;
          uniform vec3  uColor2;
          varying vec2  vUv;

          void main() {
            // Radial gradient from center
            vec2 center = vUv - 0.5;
            float dist = length(center);

            // Slowly oscillating dual-color glow
            float wave = sin(uTime * 0.1 + dist * 3.0) * 0.5 + 0.5;
            vec3 color = mix(uColor1, uColor2, wave);

            // Fade out toward edges
            float alpha = smoothstep(0.7, 0.0, dist) * 0.035;

            // Subtle breathing
            alpha *= 0.8 + sin(uTime * 0.2) * 0.2;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* ============================================================
   MAIN EXPORTED COMPONENT
   Canvas wrapper with camera, performance settings, tier logic
   Used in Astro as: <InteractiveBackground client:load />
   ============================================================ */
export default function InteractiveBackground() {
  const [tier, setTier] = useState<PerfTier | null>(null);

  useEffect(() => {
    // Detect on mount (client-side only)
    const detected = detectPerfTier();
    setTier(detected);

    if (typeof window !== 'undefined') {
      console.log(`[WebGL Background] Performance tier: ${detected}`);
    }
  }, []);

  // --- Guard: Not yet detected ---
  if (tier === null) return null;

  // --- Guard: Lite tier (mobile/weak GPU) → no WebGL ---
  // CSS already hides .webgl-canvas-container on <1024px
  // This JS guard catches weak-GPU desktops too
  if (tier === 'lite') return null;

  // --- Guard: Reduced motion preference ---
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  const config = TIER_CONFIG[tier];

  return (
    <div className="webgl-canvas-container" aria-hidden="true">
      <Canvas
        camera={{
          position: [0, 0, 9],
          fov: 55,
          near: 0.1,
          far: 30,
        }}
        dpr={config.dpr as number | [number, number]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        style={{
          background: 'transparent',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        // Prevent R3F from making the canvas interactive
        // (pointer events handled at document level)
        eventSource={
          typeof document !== 'undefined'
            ? document.documentElement
            : undefined
        }
        eventPrefix="client"
      >
        {/* Ambient background glow plane */}
        <AmbientGlow />

        {/* Main particle field */}
        <ParticleField
          count={config.count}
          mouseInfluence={config.mouseInfluence}
          speed={config.speed}
        />
      </Canvas>
    </div>
  );
}