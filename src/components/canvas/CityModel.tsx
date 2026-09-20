import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingData {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hasBeacon: boolean;
  beaconColor: string;
  rotation: number;
}

export const CityModel: React.FC = () => {
  const cityGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate procedural buildings arranged in concentric cyber rings
  const buildings = useMemo<BuildingData[]>(() => {
    const list: BuildingData[] = [];
    // Seeded pseudo-random generator
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const rings = [
      { radius: 4.5, count: 8, minHeight: 4, maxHeight: 8, width: 1.2 },
      { radius: 7.5, count: 14, minHeight: 5, maxHeight: 11, width: 1.1 },
      { radius: 10.5, count: 20, minHeight: 3, maxHeight: 9, width: 1.0 },
      { radius: 13.5, count: 24, minHeight: 2, maxHeight: 6, width: 0.9 },
    ];

    rings.forEach((ring, ringIdx) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2 + (ringIdx * 0.25);
        const r = ring.radius + (random() - 0.5) * 1.2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const h = ring.minHeight + random() * (ring.maxHeight - ring.minHeight);
        const w = ring.width * (0.8 + random() * 0.4);
        const d = ring.width * (0.8 + random() * 0.4);
        const isCyan = random() > 0.35;
        const color = isCyan ? '#00F2FE' : '#FF7B00';

        list.push({
          position: [x, h / 2, z],
          size: [w, h, d],
          color,
          hasBeacon: h > 7,
          beaconColor: random() > 0.5 ? '#FF3366' : '#00F2FE',
          rotation: angle + Math.PI / 2,
        });
      }
    });

    return list;
  }, []);

  // Continuous gentle vertical bobbing animation to simulate anti-gravity
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cityGroupRef.current) {
      cityGroupRef.current.position.y = Math.sin(t * 0.75) * 0.35;
      cityGroupRef.current.rotation.y = t * 0.015; // Slow majestic rotation
      cityGroupRef.current.rotation.z = Math.sin(t * 0.35) * 0.008;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.2;
      coreRef.current.rotation.x = t * 0.8;
      const scale = 1 + Math.sin(t * 3) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.4;
    }
  });

  return (
    <group ref={cityGroupRef}>
      {/* ================= FLOATING ISLAND BEDROCK BASE ================= */}
      {/* Upper surface plateau */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[15.8, 16.2, 0.6, 64]} />
        <meshStandardMaterial
          color="#0a1122"
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>

      {/* Outer illuminated boundary ring */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[15.6, 16.1, 64]} />
        <meshBasicMaterial color="#00F2FE" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Inverted bedrock subterranean mass (Anti-Gravity Floating Rock) */}
      <mesh position={[0, -3.8, 0]}>
        <cylinderGeometry args={[15.8, 0.4, 7, 32, 4]} />
        <meshStandardMaterial
          color="#060b18"
          roughness={0.9}
          metalness={0.6}
          flatShading
        />
      </mesh>

      {/* Subterranean energy conduit rings on inverted cone */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[10.2, 10.6, 48]} />
        <meshBasicMaterial color="#00F2FE" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -4.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.2, 5.5, 32]} />
        <meshBasicMaterial color="#FF7B00" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Inverted anti-gravity emitter spire */}
      <mesh position={[0, -8.2, 0]}>
        <cylinderGeometry args={[0.6, 0.05, 3.5, 16]} />
        <meshStandardMaterial color="#00F2FE" emissive="#00F2FE" emissiveIntensity={1.5} />
      </mesh>
      {/* Downward energy beam */}
      <mesh position={[0, -14, 0]}>
        <cylinderGeometry args={[0.15, 1.2, 8, 16, 1, true]} />
        <meshBasicMaterial color="#00F2FE" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* ================= CENTRAL PROMINENT DOME ================= */}
      {/* Dome Base Ring */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[3.2, 3.5, 0.4, 32]} />
        <meshStandardMaterial color="#0d1b38" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* The Glass Biosphere Dome */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[3.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          color="#00f2fe"
          transmission={0.88}
          opacity={1}
          transparent
          roughness={0.15}
          ior={1.4}
          thickness={1.2}
          specularIntensity={1}
        />
      </mesh>

      {/* Holographic Equatorial Ring around Dome */}
      <mesh ref={ringRef} position={[0, 1.6, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
        <ringGeometry args={[3.35, 3.6, 32]} />
        <meshBasicMaterial color="#00F2FE" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Central Plasma Core inside Dome */}
      <mesh ref={coreRef} position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#FF7B00"
          emissive="#FF7B00"
          emissiveIntensity={3}
          wireframe
        />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#00F2FE" intensity={3} distance={15} />
      <pointLight position={[0, 1.5, 0]} color="#FF7B00" intensity={2.5} distance={10} />

      {/* ================= HIGH-RISE SKYSCRAPERS ================= */}
      {buildings.map((b, idx) => (
        <group key={idx} position={b.position} rotation={[0, b.rotation, 0]}>
          {/* Main Tower Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color="#070e1e"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Glowing neon vertical strip / facade accent */}
          <mesh position={[b.size[0] / 2 + 0.01, 0, 0]}>
            <boxGeometry args={[0.04, b.size[1] * 0.85, b.size[2] * 0.2]} />
            <meshBasicMaterial color={b.color} />
          </mesh>
          <mesh position={[-b.size[0] / 2 - 0.01, 0, 0]}>
            <boxGeometry args={[0.04, b.size[1] * 0.85, b.size[2] * 0.2]} />
            <meshBasicMaterial color={b.color} />
          </mesh>

          {/* Glowing horizontal window bands */}
          <mesh position={[0, b.size[1] * 0.25, b.size[2] / 2 + 0.01]}>
            <planeGeometry args={[b.size[0] * 0.8, 0.15]} />
            <meshBasicMaterial color={b.color} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -b.size[1] * 0.15, b.size[2] / 2 + 0.01]}>
            <planeGeometry args={[b.size[0] * 0.8, 0.15]} />
            <meshBasicMaterial color={b.color} side={THREE.DoubleSide} />
          </mesh>

          {/* Rooftop Beacons */}
          {b.hasBeacon && (
            <group position={[0, b.size[1] / 2, 0]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.85, 0]}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshBasicMaterial color={b.beaconColor} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Elevated Skybridges between towers */}
      <mesh position={[6, 4.5, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[3.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#0c1830" metalness={0.8} />
      </mesh>
      <mesh position={[6, 4.66, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[3.3, 0.05, 0.1]} />
        <meshBasicMaterial color="#00F2FE" />
      </mesh>

      <mesh position={[-6, 5.2, 4]} rotation={[0, -0.6, 0]}>
        <boxGeometry args={[4.2, 0.3, 0.6]} />
        <meshStandardMaterial color="#0c1830" metalness={0.8} />
      </mesh>
      <mesh position={[-6, 5.36, 4]} rotation={[0, -0.6, 0]}>
        <boxGeometry args={[4.0, 0.05, 0.1]} />
        <meshBasicMaterial color="#FF7B00" />
      </mesh>

      {/* Surface Radial Energy Grid lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <mesh
          key={deg}
          position={[0, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, (deg * Math.PI) / 180]}
        >
          <planeGeometry args={[0.08, 12]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
};
