import { useRef, useMemo, forwardRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const LAYERS = [
  { name: "Funnel", color: "#0a0a0a", h: 0.18, baseY: 1.85 },
  { name: "Himalayan Stones", color: "#9b6a45", h: 0.22, baseY: 1.45 },
  { name: "Japanese Stones", color: "#c9b48a", h: 0.18, baseY: 1.15 },
  { name: "Silver Chandi", color: "#d6d6d6", h: 0.14, baseY: 0.88 },
  { name: "Jamun Wood", color: "#5a2a3a", h: 0.22, baseY: 0.6 },
  { name: "Magnesium", color: "#bdbdbd", h: 0.16, baseY: 0.3 },
  { name: "Korean Media", color: "#3b6f5a", h: 0.28, baseY: -0.05 },
  { name: "Magnetic Core", color: "#1a1a1a", h: 0.16, baseY: -0.4 },
  { name: "Zinc", color: "#9aa3aa", h: 0.16, baseY: -0.7 },
];

function CopperMat({ rough = 0.18 }: { rough?: number }) {
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
function BodyMat() {
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
  explodeRef: MutableRefObject<number>;
  glowRef: MutableRefObject<number>;
}

export const Device = forwardRef<THREE.Group, DeviceProps>(function Device(
  { explodeRef, glowRef },
  ref,
) {
  const fallback = useRef<THREE.Group>(null);
  const groupRef = (ref as React.RefObject<THREE.Group>) ?? fallback;

  const topGroup = useRef<THREE.Group>(null);
  const topRim = useRef<THREE.Mesh>(null);
  const bottomRim = useRef<THREE.Mesh>(null);
  const bottomTorus = useRef<THREE.Mesh>(null);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const halo = useRef<THREE.Mesh>(null);
  const halo2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const explode = explodeRef.current;
    const glow = glowRef.current;
    const t = state.clock.elapsedTime;

    if (topGroup.current) topGroup.current.position.y = 2.0 + explode * 0.8;
    if (topRim.current) topRim.current.position.y = 1.55 + explode * 0.55;
    if (bottomRim.current) bottomRim.current.position.y = -1.05 - explode * 0.4;
    if (bottomTorus.current) bottomTorus.current.position.y = -1.18 - explode * 0.45;

    layerRefs.current.forEach((m, i) => {
      if (!m) return;
      const expandY = (i - LAYERS.length / 2) * 0.35 * explode;
      m.position.y = LAYERS[i].baseY + expandY;
      m.visible = explode > 0.01;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.opacity = explode;
      mat.transparent = true;
    });

    if (halo.current) {
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.opacity = glow * (0.5 + 0.5 * Math.sin(t * 3));
      halo.current.scale.setScalar(1.0 + glow * 0.3 + Math.sin(t * 2) * 0.04);
    }
    if (halo2.current) {
      const mat = halo2.current.material as THREE.MeshBasicMaterial;
      mat.opacity = glow * 0.6;
      halo2.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <group ref={topGroup}>
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.32, 0.18, 64]} />
          <CopperMat />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <torusGeometry args={[0.5, 0.04, 16, 64]} />
          <CopperMat rough={0.1} />
        </mesh>
        <mesh position={[0, -0.13, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.42, 0.08, 64]} />
          <CopperMat />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.22 - i * 0.06, 0]}>
            <torusGeometry args={[0.36, 0.018, 12, 48]} />
            <CopperMat />
          </mesh>
        ))}
      </group>

      <mesh ref={topRim} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 64]} />
        <CopperMat />
      </mesh>

      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.48, 2.5, 64]} />
        <BodyMat />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.485, 0.005, 8, 64]} />
        <CopperMat rough={0.05} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <torusGeometry args={[0.485, 0.005, 8, 64]} />
        <CopperMat rough={0.05} />
      </mesh>

      {LAYERS.map((layer, i) => (
        <mesh
          key={layer.name}
          ref={(m) => { layerRefs.current[i] = m; }}
          position={[0, layer.baseY, 0]}
          visible={false}
        >
          <cylinderGeometry args={[0.44, 0.44, layer.h, 48]} />
          <meshPhysicalMaterial
            color={layer.color}
            metalness={0.4}
            roughness={0.5}
            transparent
            opacity={0}
            emissive={layer.color}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}

      <mesh ref={bottomRim} castShadow>
        <cylinderGeometry args={[0.5, 0.52, 0.18, 64]} />
        <CopperMat />
      </mesh>
      <mesh ref={bottomTorus}>
        <torusGeometry args={[0.5, 0.025, 12, 64]} />
        <CopperMat rough={0.08} />
      </mesh>

      <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.012, 16, 128]} />
        <meshBasicMaterial color="#7fd9ff" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={halo2} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.2, 0.008, 12, 128]} />
        <meshBasicMaterial color="#ffb98a" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
});

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

export function Molecules({ visibleRef }: { visibleRef: MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      pos: [
        Math.cos(i * 0.9) * (1.2 + Math.sin(i) * 0.4),
        (i - 9) * 0.35,
        Math.sin(i * 0.9) * (1.2 + Math.cos(i) * 0.4),
      ] as [number, number, number],
    })),
    [],
  );
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = s.clock.elapsedTime * 0.15;
      group.current.visible = visibleRef.current;
    }
  });
  return (
    <group ref={group} visible={false}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#ffb98a" : "#7fd9ff"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
