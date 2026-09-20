import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Bubble Data
interface Bubble {
  pos: [number, number, number];
  speed: number;
  scale: number;
  wobbleSpeed: number;
  offset: number;
}

// Bioluminescent Jellyfish Data
interface Jellyfish {
  x: number;
  y: number;
  z: number;
  scale: number;
  color: string;
  speed: number;
  phase: number;
}

export const SubRail: React.FC = () => {
  // 1. Define underwater vacuum tubes
  const { tubeCurve1, tubeCurve2, tubeGeom1, tubeGeom2, innerRailGeom1, innerRailGeom2 } = useMemo(() => {
    // Primary Sub-Rail Deep Tube (Loops under the bedrock base at y: -3 to -5)
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(8.5, -2.8, 3),
      new THREE.Vector3(4, -4.5, 7.5),
      new THREE.Vector3(-6, -4.2, 5.5),
      new THREE.Vector3(-9.5, -3.2, -2),
      new THREE.Vector3(-4, -5.2, -7.5),
      new THREE.Vector3(5.5, -3.6, -6),
    ], true);

    // Express Cross-Chasm Hyperloop Tube
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-7, -2.2, 6),
      new THREE.Vector3(-1, -3.8, 0),
      new THREE.Vector3(6.5, -4.8, -4),
      new THREE.Vector3(8, -2.5, 2),
      new THREE.Vector3(2, -5.5, 4),
      new THREE.Vector3(-5, -4.5, -5),
    ], true);

    // Transparent outer glass tubes with oceanic water refraction
    const geom1 = new THREE.TubeGeometry(curve1, 100, 0.58, 16, true);
    const geom2 = new THREE.TubeGeometry(curve2, 100, 0.58, 16, true);

    // Glowing inner electromagnetic guide rails
    const railGeom1 = new THREE.TubeGeometry(curve1, 100, 0.08, 8, true);
    const railGeom2 = new THREE.TubeGeometry(curve2, 100, 0.08, 8, true);

    return {
      tubeCurve1: curve1,
      tubeCurve2: curve2,
      tubeGeom1: geom1,
      tubeGeom2: geom2,
      innerRailGeom1: railGeom1,
      innerRailGeom2: railGeom2,
    };
  }, []);

  // 2. Procedural Rising Ocean Bubbles
  const bubbles = useMemo<Bubble[]>(() => {
    const arr: Bubble[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 11;
      arr.push({
        pos: [
          Math.cos(angle) * radius,
          -8 + Math.random() * 6.5,
          Math.sin(angle) * radius,
        ],
        speed: 0.015 + Math.random() * 0.03,
        scale: 0.04 + Math.random() * 0.12,
        wobbleSpeed: 1.5 + Math.random() * 2,
        offset: Math.random() * 10,
      });
    }
    return arr;
  }, []);

  // 3. Bioluminescent Deep-Sea Jellyfish
  const jellyfishList = useMemo<Jellyfish[]>(() => {
    return [
      { x: 5.5, y: -4.2, z: 2.5, scale: 0.55, color: '#00F2FE', speed: 0.8, phase: 0 },
      { x: -4.5, y: -5.0, z: 4.0, scale: 0.65, color: '#00F5D4', speed: 0.7, phase: 1.8 },
      { x: -7.0, y: -3.5, z: -3.5, scale: 0.45, color: '#FF7B00', speed: 0.9, phase: 3.2 },
      { x: 3.0, y: -5.8, z: -5.2, scale: 0.6, color: '#9D4EDD', speed: 0.75, phase: 4.5 },
      { x: 0.5, y: -3.8, z: 6.8, scale: 0.5, color: '#00F2FE', speed: 0.85, phase: 2.1 },
    ];
  }, []);

  // Animated refs
  const train1Ref = useRef<THREE.Group>(null);
  const train2Ref = useRef<THREE.Group>(null);
  const bubblesGroupRef = useRef<THREE.Group>(null);
  const waterSurfaceRef = useRef<THREE.Mesh>(null);
  const jellyfishRefs = useRef<THREE.Group[]>([]);
  const causticsLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate Maglev Train 1
    if (train1Ref.current) {
      const u = (time * 0.13) % 1;
      const pt = tubeCurve1.getPointAt(u);
      const tangent = tubeCurve1.getTangentAt(u).normalize();
      train1Ref.current.position.copy(pt);
      const lookPos = pt.clone().add(tangent);
      train1Ref.current.lookAt(lookPos);
    }

    // Animate Maglev Train 2
    if (train2Ref.current) {
      const u = (time * 0.17 + 0.45) % 1;
      const pt = tubeCurve2.getPointAt(u);
      const tangent = tubeCurve2.getTangentAt(u).normalize();
      train2Ref.current.position.copy(pt);
      const lookPos = pt.clone().add(tangent);
      train2Ref.current.lookAt(lookPos);
    }

    // Animate Rising Water Bubbles
    if (bubblesGroupRef.current) {
      bubblesGroupRef.current.children.forEach((mesh, idx) => {
        const b = bubbles[idx];
        if (!b) return;
        mesh.position.y += b.speed;
        mesh.position.x += Math.sin(time * b.wobbleSpeed + b.offset) * 0.006;
        mesh.position.z += Math.cos(time * b.wobbleSpeed + b.offset) * 0.006;

        // Reset bubble when reaching the underwater surface boundary
        if (mesh.position.y > -1.2) {
          mesh.position.y = -8;
        }
      });
    }

    // Gentle aquatic water surface undulating ripples
    if (waterSurfaceRef.current) {
      waterSurfaceRef.current.rotation.z = Math.sin(time * 0.25) * 0.03;
    }

    // Dynamic underwater caustics light shimmer
    if (causticsLightRef.current) {
      causticsLightRef.current.intensity = 2.2 + Math.sin(time * 3.5) * 0.8 + Math.cos(time * 5) * 0.4;
      causticsLightRef.current.position.x = Math.sin(time * 0.5) * 2;
      causticsLightRef.current.position.z = Math.cos(time * 0.5) * 2;
    }

    // Animate Deep-Sea Jellyfish pulsing and hovering
    jellyfishList.forEach((jf, idx) => {
      const group = jellyfishRefs.current[idx];
      if (!group) return;

      const pulse = Math.sin(time * jf.speed * 2 + jf.phase);
      // Bell contraction & expansion
      const sY = jf.scale * (1 + pulse * 0.18);
      const sXZ = jf.scale * (1 - pulse * 0.1);
      group.scale.set(sXZ, sY, sXZ);

      // Gentle vertical and horizontal swimming drift
      group.position.y = jf.y + Math.sin(time * jf.speed + jf.phase) * 0.5;
      group.position.x = jf.x + Math.sin(time * 0.4 + jf.phase) * 0.3;
      group.position.z = jf.z + Math.cos(time * 0.4 + jf.phase) * 0.3;
      group.rotation.y = time * 0.15 + jf.phase;
    });
  });

  return (
    <group>
      {/* ================= SUBMERGED WATER SURFACE BOUNDARY ================= */}
      {/* Upper underwater surface plane - looking up from underwater */}
      <mesh
        ref={waterSurfaceRef}
        position={[0, -1.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[15.6, 64]} />
        <meshPhysicalMaterial
          color="#006699"
          roughness={0.1}
          metalness={0.1}
          transmission={0.82}
          opacity={0.85}
          transparent
          ior={1.333} // Water IOR
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shimmering Underwater Water Caustics Ring */}
      <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 15.2, 48]} />
        <meshBasicMaterial
          color="#00F2FE"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* Oceanic Depth Enclosing Volume Cylinder (Deep Blue Abyssal Basin) */}
      <mesh position={[0, -6.5, 0]}>
        <cylinderGeometry args={[16.2, 17.5, 12, 32, 1, true]} />
        <meshBasicMaterial
          color="#021428"
          transparent
          opacity={0.65}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Underwater Caustics Moving Point Light */}
      <pointLight
        ref={causticsLightRef}
        position={[0, -1.8, 0]}
        color="#00F2FE"
        intensity={2.5}
        distance={22}
      />
      <pointLight position={[0, -6, 0]} color="#004488" intensity={3.5} distance={25} />

      {/* ================= RISING OCEAN AIR BUBBLES ================= */}
      <group ref={bubblesGroupRef}>
        {bubbles.map((b, idx) => (
          <mesh key={idx} position={b.pos} scale={b.scale}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshPhysicalMaterial
              color="#dffffc"
              roughness={0.05}
              metalness={0.2}
              transmission={0.92}
              opacity={0.85}
              transparent
              ior={1.15}
            />
          </mesh>
        ))}
      </group>

      {/* ================= BIOLUMINESCENT DEEP-SEA JELLYFISH ================= */}
      {jellyfishList.map((jf, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) jellyfishRefs.current[idx] = el;
          }}
          position={[jf.x, jf.y, jf.z]}
        >
          {/* Jellyfish Bell / Umbrella */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshPhysicalMaterial
              color={jf.color}
              emissive={jf.color}
              emissiveIntensity={0.6}
              transmission={0.85}
              transparent
              opacity={0.75}
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Bioluminescent Inner Core */}
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>

          {/* Trailing Tentacles */}
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const tx = Math.cos(rad) * 0.35;
            const tz = Math.sin(rad) * 0.35;
            return (
              <mesh key={deg} position={[tx, -0.4, tz]}>
                <cylinderGeometry args={[0.015, 0.005, 0.8, 6]} />
                <meshBasicMaterial color={jf.color} transparent opacity={0.65} />
              </mesh>
            );
          })}

          <pointLight color={jf.color} intensity={1.2} distance={3.5} />
        </group>
      ))}

      {/* ================= BIOLUMINESCENT AQUATIC KELP / SEA REEF ================= */}
      {[
        { x: -5, z: -1, h: 3.2, col: '#00F5D4' },
        { x: 6, z: 2, h: 2.8, col: '#00F2FE' },
        { x: -2, z: 5, h: 3.5, col: '#00F5D4' },
        { x: 3, z: -6, h: 3.0, col: '#00F2FE' },
      ].map((k, i) => (
        <group key={i} position={[k.x, -7.5, k.z]}>
          <mesh position={[0, k.h / 2, 0]}>
            <cylinderGeometry args={[0.06, 0.15, k.h, 8]} />
            <meshStandardMaterial
              color="#042a35"
              emissive={k.col}
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>
          <pointLight color={k.col} intensity={1.0} distance={3.5} position={[0, k.h, 0]} />
        </group>
      ))}

      {/* ================= TRANSPARENT SUB-OCEANIC HYPER-TUBES ================= */}
      {/* Tube 1: Underwater Glass with Marine Refraction */}
      <mesh geometry={tubeGeom1}>
        <meshPhysicalMaterial
          color="#00e5ff"
          transmission={0.92}
          opacity={0.88}
          transparent
          roughness={0.08}
          ior={1.333} // Water IOR
          thickness={1.1}
          specularIntensity={1}
        />
      </mesh>

      {/* Tube 1: Inner Glowing Maglev Rail */}
      <mesh geometry={innerRailGeom1}>
        <meshBasicMaterial color="#00F2FE" />
      </mesh>

      {/* Tube 2: Outer Underwater Glass */}
      <mesh geometry={tubeGeom2}>
        <meshPhysicalMaterial
          color="#00ffd0"
          transmission={0.90}
          opacity={0.85}
          transparent
          roughness={0.1}
          ior={1.333}
          thickness={1.1}
          specularIntensity={1}
        />
      </mesh>

      {/* Tube 2: Inner Glowing Maglev Rail */}
      <mesh geometry={innerRailGeom2}>
        <meshBasicMaterial color="#FF7B00" />
      </mesh>

      {/* ================= SLEEK SUBMERSIBLE MAGLEV BULLET TRAINS ================= */}
      {/* Train 1: Oceanic Maglev Explorer */}
      <group ref={train1Ref}>
        {/* Aerodynamic Hydro-Pod */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 1.4, 16]} />
          <meshStandardMaterial color="#051226" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Aquatic Viewport Strip */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.15, 0.05, 1.1]} />
          <meshBasicMaterial color="#00F2FE" />
        </mesh>
        {/* Forward Powerful Headlight cutting through water */}
        <mesh position={[0, 0, 0.72]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Volumetric Headlight Water Cone */}
        <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.55, 2.2, 16, 1, true]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        {/* Trailing Hydro-Wake Light inside tube */}
        <mesh position={[0, 0, -1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.28, 1.2, 12, 1, true]} />
          <meshBasicMaterial color="#00F2FE" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#00F2FE" intensity={3.5} distance={7} />
      </group>

      {/* Train 2: Abyssal Deep-Current Express */}
      <group ref={train2Ref}>
        {/* Lead Hydro-Locomotive */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 1.5, 16]} />
          <meshStandardMaterial color="#1a0c02" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Viewport Strip */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.15, 0.05, 1.2]} />
          <meshBasicMaterial color="#FF7B00" />
        </mesh>
        {/* Headlight */}
        <mesh position={[0, 0, 0.76]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#FFF1E0" />
        </mesh>
        {/* Volumetric Headlight Beam */}
        <mesh position={[0, 0, 1.9]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.55, 2.4, 16, 1, true]} />
          <meshBasicMaterial color="#FF7B00" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        {/* Trailing wake */}
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.28, 1.3, 12, 1, true]} />
          <meshBasicMaterial color="#FF7B00" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#FF7B00" intensity={3.5} distance={7} />
      </group>

      {/* Deep-Sea Submerged Hydro-Pylons & Cavern Spire Anchors */}
      {[
        { pos: [-3, -3.2, -2], col: '#00F2FE' },
        { pos: [4, -4.0, 3], col: '#00F5D4' },
        { pos: [-5, -4.8, 1], col: '#00F2FE' },
        { pos: [2, -5.2, -4], col: '#00E5FF' },
      ].map((item, idx) => (
        <group key={idx} position={item.pos as [number, number, number]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.35, 1.8, 6]} />
            <meshStandardMaterial color="#021422" metalness={0.9} roughness={0.4} />
          </mesh>
          <pointLight color={item.col} intensity={1.5} distance={5} position={[0, -0.9, 0]} />
        </group>
      ))}
    </group>
  );
};
