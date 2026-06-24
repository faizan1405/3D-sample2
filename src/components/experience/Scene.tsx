import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Device, Particles, Molecules } from "./Device";

interface SceneProps {
  scrollRef: MutableRefObject<number>;
}

// Smooth map helper
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

function Rig({ scrollRef }: SceneProps) {
  const { camera } = useThree();
  const deviceRef = useRef<THREE.Group>(null);
  const explodeRef = useRef(0);
  const glowRef = useRef(0);
  const moleculesVisible = useRef(false);

  // Targets
  const camTarget = useRef(new THREE.Vector3(0, 0, 0));
  const camPos = useRef(new THREE.Vector3(0, 0, 18));

  useFrame((state, dt) => {
    const p = scrollRef.current; // 0..1 across 8 scenes

    // ---- Camera path keyed to scene segments ----
    // s1 0–0.12 abyss: deep, fog, dolly forward
    // s2 0.12–0.28 reveal orbit
    // s3 0.28–0.45 exploded view
    // s4 0.45–0.6 inside water
    // s5 0.6–0.72 magnetic activation
    // s6 0.72–0.84 transformation
    // s7 0.84–0.93 reassembly
    // s8 0.93–1 conversion

    const s1 = seg(p, 0, 0.12);
    const s2 = seg(p, 0.12, 0.28);
    const s3 = seg(p, 0.28, 0.45);
    const s4 = seg(p, 0.45, 0.6);
    const s5 = seg(p, 0.6, 0.72);
    const s6 = seg(p, 0.72, 0.84);
    const s7 = seg(p, 0.84, 0.93);
    const s8 = seg(p, 0.93, 1);

    // Camera position interpolation across scenes
    const path: [number, [number, number, number], [number, number, number]][] = [
      [0, [0, 0.5, 22], [0, 0, 0]],         // far abyss
      [0.12, [0, 0.3, 9], [0, 0.2, 0]],      // approach
      [0.22, [4.5, 1.2, 6], [0, 0.3, 0]],    // orbit right
      [0.32, [-3.5, 2.5, 7], [0, 0.5, 0]],   // orbit left high
      [0.45, [0, 0.6, 5.5], [0, 0.3, 0]],    // exploded centered
      [0.55, [0, 0, 1.8], [0, 0, 0]],        // dive inside
      [0.68, [0, 0.2, 3.2], [0, 0, 0]],      // magnetic
      [0.8, [2.5, 0.5, 4.2], [0, 0, 0]],     // transformation
      [0.9, [0, 1.0, 6], [0, 0.2, 0]],       // reassembly pull back
      [1, [0, 0.4, 7], [0, 0, 0]],           // conversion
    ];

    let from = path[0], to = path[1];
    for (let i = 0; i < path.length - 1; i++) {
      if (p >= path[i][0] && p <= path[i + 1][0]) {
        from = path[i];
        to = path[i + 1];
        break;
      }
      if (p > path[path.length - 1][0]) {
        from = path[path.length - 2];
        to = path[path.length - 1];
      }
    }
    const span = to[0] - from[0];
    const localT = span > 0 ? smooth(clamp01((p - from[0]) / span)) : 0;
    const targetPos = new THREE.Vector3(
      lerp(from[1][0], to[1][0], localT),
      lerp(from[1][1], to[1][1], localT),
      lerp(from[1][2], to[1][2], localT),
    );
    const targetLook = new THREE.Vector3(
      lerp(from[2][0], to[2][0], localT),
      lerp(from[2][1], to[2][1], localT),
      lerp(from[2][2], to[2][2], localT),
    );

    // Smooth inertia
    camPos.current.lerp(targetPos, Math.min(1, dt * 3.5));
    camTarget.current.lerp(targetLook, Math.min(1, dt * 3.5));
    camera.position.copy(camPos.current);
    camera.lookAt(camTarget.current);

    // Device rotation: gentle continuous spin + scene-driven
    if (deviceRef.current) {
      const baseRot = state.clock.elapsedTime * 0.15;
      const sceneRot = s2 * Math.PI * 0.5 + s4 * Math.PI * 0.3 + s8 * 0.3;
      deviceRef.current.rotation.y = baseRot + sceneRot;
      // levitate
      deviceRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }

    // Explode (scene 3 + partial 4, then reassemble scene 7)
    const explodeTarget = s3 * (1 - s7);
    explodeRef.current = lerp(explodeRef.current, explodeTarget, Math.min(1, dt * 4));

    // Magnetic glow (scene 5 + 6)
    const glowTarget = Math.max(s5 - s7, s6 * 0.7) ;
    glowRef.current = lerp(glowRef.current, glowTarget, Math.min(1, dt * 5));

    moleculesVisible.current = s4 > 0.05 && s7 < 0.9;
  });

  return (
    <>
      <DynamicDevice deviceRef={deviceRef} explodeRef={explodeRef} glowRef={glowRef} />
      <DynamicMolecules visibleRef={moleculesVisible} />
    </>
  );
}

function DynamicDevice({
  deviceRef,
  explodeRef,
  glowRef,
}: {
  deviceRef: MutableRefObject<THREE.Group | null>;
  explodeRef: MutableRefObject<number>;
  glowRef: MutableRefObject<number>;
}) {
  // Re-render device with current values each frame via wrapper using refs
  const wrap = useRef<{ explode: number; glow: number }>({ explode: 0, glow: 0 });
  useFrame(() => {
    wrap.current.explode = explodeRef.current;
    wrap.current.glow = glowRef.current;
  });
  return <DeviceAnimated wrap={wrap} groupRef={deviceRef} />;
}

function DeviceAnimated({
  wrap,
  groupRef,
}: {
  wrap: MutableRefObject<{ explode: number; glow: number }>;
  groupRef: MutableRefObject<THREE.Group | null>;
}) {
  // Force re-render via state isn't needed: pass live ref values by reading on each frame via key trick.
  // We'll just render with current ref values; props get updated on re-render. Use a frame counter.
  const [, force] = useForceFrame();
  return <Device ref={groupRef} explode={wrap.current.explode} glow={wrap.current.glow} />;
}

import { useState, useEffect } from "react";
function useForceFrame() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setN((v) => (v + 1) % 1000000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return [n, setN] as const;
}

function DynamicMolecules({ visibleRef }: { visibleRef: MutableRefObject<boolean> }) {
  const [vis, setVis] = useState(false);
  useFrame(() => {
    if (visibleRef.current !== vis) setVis(visibleRef.current);
  });
  return <Molecules visible={vis} />;
}

export function Experience({ scrollRef }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 18], fov: 38, near: 0.1, far: 100 }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={["#03060c"]} />
      <fog attach="fog" args={["#040814", 4, 22]} />

      {/* Cinematic lighting */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffd9b8" castShadow />
      <directionalLight position={[-6, 2, -4]} intensity={0.7} color="#5fa8d6" />
      <pointLight position={[0, -2, 3]} intensity={0.8} color="#7fd9ff" distance={10} />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#ffb98a" distance={12} />

      <Environment preset="studio" environmentIntensity={0.6} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <Rig scrollRef={scrollRef} />
      </Float>

      <Particles count={500} radius={8} color="#7fd9ff" />
      <Particles count={150} radius={4} color="#ffb98a" />

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.4} luminanceSmoothing={0.3} mipmapBlur />
        <DepthOfField focusDistance={0.015} focalLength={0.04} bokehScale={3} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
