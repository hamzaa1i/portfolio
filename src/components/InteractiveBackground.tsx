import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type Tier = 'lite' | 'mid' | 'full';

function detectTier(): Tier {
  if (typeof window === 'undefined') return 'mid';
  if (window.innerWidth < 1024 || 'ontouchstart' in window) return 'lite';
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return 'lite';
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const r = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase() : '';
    const weak = r.includes('intel') || r.includes('mesa') || r.includes('swiftshader');
    const cores = navigator.hardwareConcurrency || 2;
    if (weak || cores <= 2) return 'lite';
    if (cores <= 4) return 'mid';
    return 'full';
  } catch { return 'mid'; }
}

const CFG: Record<Tier, { count: number; mouse: number; speed: number; dpr: number }> = {
  lite: { count: 300, mouse: 0.2, speed: 0.25, dpr: 1 },
  mid: { count: 800, mouse: 0.4, speed: 0.3, dpr: 1 },
  full: { count: 1500, mouse: 0.5, speed: 0.35, dpr: 1.5 },
};

const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const VERT = /* glsl */ `
  ${NOISE}
  uniform float uTime;uniform vec3 uMouse;uniform float uMouseInfluence;uniform float uSpeed;uniform float uDpr;
  attribute float aSize;attribute float aPhase;attribute vec3 aColor;
  varying vec3 vColor;varying float vAlpha;
  void main(){
    vec3 pos=position;float t=uTime*uSpeed;
    float n1=snoise(vec3(pos.x*0.2,pos.y*0.2,t*0.15));
    float n2=snoise(vec3(pos.y*0.2+31.0,pos.z*0.2,t*0.15+47.0));
    float n3=snoise(vec3(pos.z*0.2+73.0,pos.x*0.2,t*0.15+91.0));
    pos.x+=n1*1.2;pos.y+=n2*0.9;pos.z+=n3*0.5;
    pos.z+=sin(t*0.12+aPhase*6.28)*0.3;
    vec3 toMouse=uMouse-pos;float mDist=length(toMouse);
    float mEffect=smoothstep(4.0,0.0,mDist)*uMouseInfluence;
    pos+=normalize(toMouse+vec3(0.001))*mEffect*1.5;
    vec4 mv=modelViewMatrix*vec4(pos,1.0);
    gl_Position=projectionMatrix*mv;
    float depth=-mv.z;
    gl_PointSize=aSize*(250.0/max(depth,0.1))*uDpr;
    gl_PointSize=clamp(gl_PointSize,1.0,35.0);
    float colorShift=smoothstep(3.5,0.0,mDist)*0.3;
    vColor=mix(aColor,vec3(0.784,0.635,0.306),colorShift);
    float pulse=sin(aPhase*6.28+t*0.5)*0.2+0.8;
    float depthFade=smoothstep(16.0,1.0,depth);
    float mouseGlow=smoothstep(3.0,0.0,mDist)*0.5;
    vAlpha=pulse*depthFade*(0.2+mouseGlow);
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;varying float vAlpha;
  void main(){
    vec2 uv=gl_PointCoord-0.5;float dist=length(uv);
    float alpha=1.0-smoothstep(0.0,0.5,dist);alpha*=alpha;alpha*=vAlpha;
    float core=1.0-smoothstep(0.0,0.1,dist);
    vec3 color=vColor+core*vColor*0.4;
    if(alpha<0.005)discard;
    gl_FragColor=vec4(color,alpha);
  }
`;

function Particles({ count, mouse, speed }: { count: number; mouse: number; speed: number }) {
  const ref = useRef<THREE.Points>(null!);
  const mouseTarget = useRef(new THREE.Vector3());
  const mouseCurrent = useRef(new THREE.Vector3());
  const { viewport, pointer } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uMouseInfluence: { value: mouse },
    uSpeed: { value: speed },
    uDpr: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5) },
  }), []);

  const { positions, sizes, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const gold = new THREE.Color(0xC8A24E);
    const warmWhite = new THREE.Color(0xFAF0D7);
    const deepGold = new THREE.Color(0x8B6914);
    const amber = new THREE.Color(0xD4A017);
    const dim = new THREE.Color(0x3F3520);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      const radius = Math.pow(Math.random(), 0.5) * 8;
      positions[i3] = Math.sin(phi) * Math.cos(theta) * radius * 1.8;
      positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 1.1;
      positions[i3 + 2] = Math.cos(phi) * radius * 0.6 - 2;
      sizes[i] = Math.pow(Math.random(), 2.0) * 4 + 0.3;
      phases[i] = Math.random();

      const t = Math.random();
      let color: THREE.Color;
      if (t < 0.35) color = gold.clone().lerp(deepGold, Math.random() * 0.5);
      else if (t < 0.55) color = amber.clone().lerp(gold, Math.random());
      else if (t < 0.75) color = dim.clone().lerp(deepGold, Math.random());
      else if (t < 0.92) color = gold.clone().lerp(amber, Math.random() * 0.6);
      else { color = warmWhite.clone().lerp(gold, 0.3 + Math.random() * 0.3); sizes[i] *= 0.5; }

      colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
    }
    return { positions, sizes, phases, colors };
  }, [count]);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;
    mouseTarget.current.set(pointer.x * viewport.width * 0.5, pointer.y * viewport.height * 0.5, 0);
    const lerp = 1 - Math.pow(0.93, delta * 60);
    mouseCurrent.current.lerp(mouseTarget.current, lerp);
    mat.uniforms.uMouse.value.copy(mouseCurrent.current);
    ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function InteractiveBackground() {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => { setTier(detectTier()); }, []);
  if (tier === null || tier === 'lite') return null;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const cfg = CFG[tier];
  return (
    <div className="webgl-canvas-container" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 25 }}
        dpr={cfg.dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: false }}
        style={{ background: 'transparent', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        eventSource={typeof document !== 'undefined' ? document.documentElement : undefined}
        eventPrefix="client"
      >
        <Particles count={cfg.count} mouse={cfg.mouse} speed={cfg.speed} />
      </Canvas>
    </div>
  );
}