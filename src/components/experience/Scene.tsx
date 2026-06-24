import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Device, Particles, Molecules } from "./Device";

interface SceneProps {
  scrollRef: MutableRefObject<number>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));

const PATH: Array<[number, [number, number, number], [number, number, number]]> = [
  [0,    [0, 0.5, 22], [0, 0, 0]],
  [0.12, [0, 0.3, 9],  [0, 0.2, 0]],
  [0.22, [4.5, 1.2, 6], [0, 0.3, 0]],
  [0.32, [-3.5, 2.5, 7], [0, 0.5, 0]],
  [0.45, [0, 0.6, 5.5], [0, 0.3, 0]],
  [0.55, [0, 0, 1.8],  [0, 0, 0]],
  [0.68, [0, 0.2, 3.2], [0, 0, 0]],
  [0.8,  [2.5, 0.5, 4.2], [0, 0, 0]],
  [0.9,  [0, 1.0, 6],  [0, 0.2, 0]],
  [1,    [0, 0.4, 7],  [0, 0, 0]],
];

function Rig({
  scrollRef,
  explodeRef,
  glowRef,
  moleculeRef,
}: SceneProps & {
  explodeRef: MutableRefObject<number>;
  glowRef: MutableRefObject<number>;
  moleculeRef: MutableRefObject<boolean>;
}) {
  const { camera } = useThree();
  const deviceRef = useRef<THREE.Group>(null);
  const camPos = useRef(new THREE.Vector3(0, 0.5, 22));
  const camTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, dt) => {
    const p = scrollRef.current;

    const s3 = seg(p, 0.28, 0.45);
    const s4 = seg(p, 0.45, 0.6);
    const s5 = seg(p, 0.6, 0.72);
    const s6 = seg(p, 0.72, 0.84);
    const s7 = seg(p, 0.84, 0.93);

    let from = PATH[0];
    let to = PATH[1];
    for (let i = 0; i < PATH.length - 1; i++) {
      if (p >= PATH[i][0] && p <= PATH[i + 1][0]) {
        from = PATH[i];
        to = PATH[i + 1];
        break;
      }
    }
    if (p >= PATH[PATH.length - 1][0]) {
      from = PATH[PATH.length - 2];
      to = PATH[PATH.length - 1];
    }
    const span = to[0] - from[0];
    const localT = span > 0 ? smooth(clamp01((p - from[0]) / span)) : 0;
    const tp = new THREE.Vector3(
      lerp(from[1][0], to[1][0], localT),
      lerp(from[1][1], to[1][1], localT),
      lerp(from[1][2], to[1][2], localT),
    );
    const tl = new THREE.Vector3(
      lerp(from[2][0], to[2][0], localT),
      lerp(from[2][1], to[2][1], localT),
      lerp(from[2][2], to[2][2], localT),
    );
    const ease = Math.min(1, dt * 3.5);
    camPos.current.lerp(tp, ease);
    camTarget.current.lerp(tl, ease);
    camera.position.copy(camPos.current);
    camera.lookAt(camTarget.current);

    if (deviceRef.current) {
      deviceRef.current.rotation.y = state.clock.elapsedTime * 0.15 + p * Math.PI * 0.8;
      deviceRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }

    const explodeTarget = s3 * (1 - s7);
    explodeRef.current = lerp(explodeRef.current, explodeTarget, Math.min(1, dt * 4));
    const glowTarget = Math.max(s5 - s7, s6 * 0.7);
    glowRef.current = lerp(glowRef.current, glowTarget, Math.min(1, dt * 5));
    moleculeRef.current = s4 > 0.05 && s7 < 0.9;
  });

  return (
    <>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Device ref={deviceRef} explodeRef={explodeRef} glowRef={glowRef} />
      </Float>
      <Molecules visibleRef={moleculeRef} />
    </>
  );
}

export function Experience({ scrollRef }: SceneProps) {
  const explodeRef = useRef(0);
  const glowRef = useRef(0);
  const moleculeRef = useRef(false);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 22], fov: 38, near: 0.1, far: 100 }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={["#03060c"]} />
      <fog attach="fog" args={["#040814", 6, 30]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffd9b8" castShadow />
      <directionalLight position={[-6, 2, -4]} intensity={0.7} color="#5fa8d6" />
      <pointLight position={[0, -2, 3]} intensity={0.8} color="#7fd9ff" distance={10} />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#ffb98a" distance={12} />

      <Environment preset="studio" environmentIntensity={0.6} />

      <Rig
        scrollRef={scrollRef}
        explodeRef={explodeRef}
        glowRef={glowRef}
        moleculeRef={moleculeRef}
      />

      <Particles count={500} radius={8} color="#7fd9ff" />
      <Particles count={150} radius={4} color="#ffb98a" />

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.4} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
