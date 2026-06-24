import { useRef, useMemo, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Procedural luxury water device — black body w/ copper top & bottom
// Layer config matches uploaded internals diagram
export const LAYERS = [
  { name: "Funnel", color: "#0a0a0a", h: 0.18, y: 1.85, label: "Funnel Intake" },
  { name: "Himalayan Stones", color: "#9b6a45", h: 0.22, y: 1.45, label: "Himalayan Mineral Stones" },
  { name: "Japanese Stones", color: "#c9b48a", h: 0.18, y: 1.15, label: "Japanese Energy Stones" },
  { name: "Silver Chandi", color: "#d6d6d6", h: 0.14, y: 0.88, label: "Silver Infusion" },
  { name: "Jamun Wood", color: "#5a2a3a", h: 0.22, y: 0.6, label: "Jamun Wood Antibiotic" },
  { name: "Magnesium", color: "#bdbdbd", h: 0.16, y: 0.3, label: "Magnesium Core" },
  { name: "Korean Media", color: "#3b6f5a", h: 0.28, y: -0.05, label: "Korean Bio Stones" },
  { name: "Magnetic Core", color: "#1a1a1a", h: 0.16, y: -0.4, label: "Triple Magnetic Layer" },
  { name: "Zinc", color: "#9aa3aa", h: 0.16, y: -0.7, label: "Zinc Potassium" },
];

function CopperMaterial({ rough = 0.18 }: { rough?: number }) {
  return (
    <meshPhysicalMaterial
      color="#c97a4b"
      metalness={1}
      roughness={rough}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1.4}
    />
  );
}

function BodyMaterial() {
  return (
    <meshPhysicalMaterial
      color="#0b0b0d"
      metalness={0.6}
      roughness={0.35}
      clearcoat={0.9}
      clearcoatRoughness={0.2}
      envMapIntensity={0.9}
    />
  );
}

interface DeviceProps {
  explode?: number; // 0..1
  glow?: number; // 0..1 magnetic activation
}

export const Device = forwardRef<THREE.Group, DeviceProps>(function Device(
  { explode = 0, glow = 0 },
  ref,
) {
  const groupRef = useRef<THREE.Group>(null);
  const energyRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (energyRef.current) {
      const t = state.clock.elapsedTime;
      const mat = energyRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = glow * (0.5 + 0.5 * Math.sin(t * 3));
      energyRef.current.scale.setScalar(1.4 + glow * 0.4 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <group ref={ref ?? groupRef} dispose={null}>
      {/* Top copper funnel/lota */}
      <group position={[0, 2.0 + explode * 0.8, 0]}>
        {/* funnel cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.32, 0.18, 64]} />
          <CopperMaterial />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <torusGeometry args={[0.5, 0.04, 16, 64]} />
          <CopperMaterial rough={0.1} />
        </mesh>
        <mesh position={[0, -0.13, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.42, 0.08, 64]} />
          <CopperMaterial />
        </mesh>
        {/* neck ridges */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.22 - i * 0.06, 0]}>
            <torusGeometry args={[0.36, 0.018, 12, 48]} />
            <CopperMaterial />
          </mesh>
        ))}
      </group>

      {/* Top copper rim */}
      <mesh position={[0, 1.55 + explode * 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 64]} />
        <CopperMaterial />
      </mesh>

      {/* Black body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.48, 2.5, 64]} />
        <BodyMaterial />
      </mesh>

      {/* Subtle copper label rings */}
      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.485, 0.005, 8, 64]} />
        <CopperMaterial rough={0.05} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <torusGeometry args={[0.485, 0.005, 8, 64]} />
        <CopperMaterial rough={0.05} />
      </mesh>

      {/* Internal layers — visible when exploded */}
      {LAYERS.map((layer, i) => {
        const expandY = (i - LAYERS.length / 2) * 0.35 * explode;
        const op = explode;
        return (
          <mesh
            key={layer.name}
            position={[0, layer.y + expandY, 0]}
            visible={explode > 0.01}
          >
            <cylinderGeometry args={[0.44, 0.44, layer.h, 48]} />
            <meshPhysicalMaterial
              color={layer.color}
              metalness={0.4}
              roughness={0.5}
              transparent
              opacity={op}
              emissive={layer.color}
              emissiveIntensity={0.05}
            />
          </mesh>
        );
      })}

      {/* Bottom copper rim */}
      <mesh position={[0, -1.05 - explode * 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.52, 0.18, 64]} />
        <CopperMaterial />
      </mesh>
      <mesh position={[0, -1.18 - explode * 0.45, 0]}>
        <torusGeometry args={[0.5, 0.025, 12, 64]} />
        <CopperMaterial rough={0.08} />
      </mesh>

      {/* Magnetic energy halo */}
      <mesh ref={energyRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.012, 16, 128]} />
        <meshBasicMaterial color="#7fd9ff" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]} visible={glow > 0.05}>
        <torusGeometry args={[1.2, 0.008, 12, 128]} />
        <meshBasicMaterial color="#ffb98a" transparent opacity={glow * 0.7} toneMapped={false} />
      </mesh>
    </group>
  );
});

// Floating water droplets / particles around the device
export function Particles({ count = 400, radius = 6, color = "#7fd9ff" }: { count?: number; radius?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={color} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Molecule chains for inside-water scene
export function Molecules({ visible = false }: { visible?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      pos: [
        Math.cos(i * 0.9) * (1.2 + Math.sin(i) * 0.4),
        (i - 9) * 0.35,
        Math.sin(i * 0.9) * (1.2 + Math.cos(i) * 0.4),
      ] as [number, number, number],
    }));
  }, []);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = s.clock.elapsedTime * 0.15;
    }
  });
  if (!visible) return null;
  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#ffb98a" : "#7fd9ff"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
