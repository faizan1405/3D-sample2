import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * H2O molecule: one oxygen + two hydrogens at ~104.5°
 */
function H2O({ position, scale = 1, phase = 0 }: { position: [number, number, number]; scale?: number; phase?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime + phase;
    g.current.rotation.y = t * 0.4;
    g.current.rotation.x = Math.sin(t * 0.6) * 0.3;
    g.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
  });
  const ang = (104.5 * Math.PI) / 180 / 2;
  const r = 0.45;
  const h1: [number, number, number] = [Math.sin(ang) * r, -Math.cos(ang) * r, 0];
  const h2: [number, number, number] = [-Math.sin(ang) * r, -Math.cos(ang) * r, 0];
  return (
    <group ref={g} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color="#7fd9ff" emissive="#1a6e9a" emissiveIntensity={0.6} metalness={0.2} roughness={0.25} clearcoat={1} transmission={0.3} thickness={0.4} />
      </mesh>
      {[h1, h2].map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshPhysicalMaterial color="#ffd9b8" emissive="#a86843" emissiveIntensity={0.5} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[p[0] / 2, p[1] / 2, 0]} rotation={[0, 0, Math.atan2(p[1], p[0]) + Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, r, 8]} />
            <meshBasicMaterial color="#7fd9ff" transparent opacity={0.35} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lattice({ count = 14, spread = 6 }: { count?: number; spread?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * spread * 2,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread * 0.6 - 1,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.2,
      })),
    [count, spread],
  );
  return (
    <>
      {items.map((it, i) => (
        <Float key={i} floatIntensity={1.4} rotationIntensity={0.8} speed={it.speed}>
          <H2O position={it.position} scale={it.scale} phase={it.phase} />
        </Float>
      ))}
    </>
  );
}

function MouseRig() {
  const { camera } = useThree();
  const tx = useRef(0);
  const ty = useRef(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      tx.current = (e.clientX / window.innerWidth - 0.5) * 0.8;
      ty.current = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useFrame((_, dt) => {
    const e = Math.min(1, dt * 2);
    camera.position.x += (tx.current - camera.position.x) * e;
    camera.position.y += (-ty.current + 0.2 - camera.position.y) * e;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface Props {
  variant?: "aqua" | "copper" | "mixed";
  density?: number;
  className?: string;
}

export function H2OHero3D({ variant = "mixed", density = 14, className = "" }: Props) {
  const bg = "#03060c";
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 6], fov: 42, near: 0.1, far: 60 }}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 6, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 4]} intensity={1.3} color={variant === "copper" ? "#ffd9b8" : "#cfeeff"} />
        <directionalLight position={[-5, -2, -3]} intensity={0.6} color={variant === "copper" ? "#a86843" : "#5fa8d6"} />
        <pointLight position={[0, 0, 3]} intensity={1} color="#7fd9ff" distance={10} />
        <Environment preset="studio" environmentIntensity={0.5} />
        <Lattice count={density} spread={7} />
        <MouseRig />
        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#03060c]" />
    </div>
  );
}
