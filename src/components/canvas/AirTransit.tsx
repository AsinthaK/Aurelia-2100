import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlightPath {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
  length: number;
  busLabel: string;
  offset: number;
}

export const AirTransit: React.FC = () => {
  // Create multiple 3D flight paths looping smoothly between upper towers
  const paths = useMemo<FlightPath[]>(() => {
    // High-altitude flight corridor 1: Major outer loop
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12, 8, 5),
      new THREE.Vector3(6, 10, 11),
      new THREE.Vector3(-8, 9, 8),
      new THREE.Vector3(-11, 7, -6),
      new THREE.Vector3(0, 11, -12),
      new THREE.Vector3(10, 8.5, -5),
    ], true);

    // High-altitude flight corridor 2: Figure-eight dynamic weave
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9, 7.5, 9),
      new THREE.Vector3(0, 8.5, 4),
      new THREE.Vector3(9, 6.5, -6),
      new THREE.Vector3(5, 9.5, -11),
      new THREE.Vector3(-4, 7.8, -4),
      new THREE.Vector3(-10, 8.2, 3),
    ], true);

    // Flight corridor 3: Spire-to-spire rapid express
    const curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4, 9, -8),
      new THREE.Vector3(-6, 11, -2),
      new THREE.Vector3(-7, 8.5, 7),
      new THREE.Vector3(7, 10.5, 7),
    ], true);

    return [
      { curve: curve1, color: '#00F2FE', speed: 0.08, length: 1, busLabel: 'SkyBus-42', offset: 0 },
      { curve: curve1, color: '#00F2FE', speed: 0.08, length: 1, busLabel: 'AeroShuttle-09', offset: 0.5 },
      { curve: curve2, color: '#FF7B00', speed: 0.12, length: 1, busLabel: 'PulseExpress-88', offset: 0.2 },
      { curve: curve2, color: '#FF7B00', speed: 0.12, length: 1, busLabel: 'CargoDart-14', offset: 0.7 },
      { curve: curve3, color: '#00F5D4', speed: 0.15, length: 1, busLabel: 'SkyPod-Ultra', offset: 0.1 },
    ];
  }, []);

  // Pre-generate tube/line geometries for visible aerial guide corridors
  const corridorGeometries = useMemo(() => {
    return [paths[0].curve, paths[2].curve, paths[4].curve].map(curve => {
      return new THREE.TubeGeometry(curve, 80, 0.03, 6, true);
    });
  }, [paths]);

  // Animated vehicle refs
  const vehiclesRef = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    paths.forEach((p, idx) => {
      const vehicle = vehiclesRef.current[idx];
      if (!vehicle) return;

      // Calculate progress along curve
      const u = (time * p.speed + p.offset) % 1;
      const pos = p.curve.getPointAt(u);
      const tangent = p.curve.getTangentAt(u).normalize();

      vehicle.position.copy(pos);

      // Orient vehicle along trajectory
      const lookAtPos = pos.clone().add(tangent);
      vehicle.lookAt(lookAtPos);
    });
  });

  return (
    <group>
      {/* Visual Aerial Guide Corridors (Glowing guide rails in sky) */}
      {corridorGeometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshBasicMaterial
            color={idx === 1 ? '#FF7B00' : '#00F2FE'}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Animated Flying Buses & Pods with Light Trails */}
      {paths.map((p, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) vehiclesRef.current[idx] = el;
          }}
        >
          {/* Aerodynamic Aerocraft Hull */}
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.18, 0.9]} />
            <meshStandardMaterial
              color="#0d1f3d"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Glowing cockpit visor */}
          <mesh position={[0, 0.05, 0.38]}>
            <boxGeometry args={[0.3, 0.08, 0.15]} />
            <meshBasicMaterial color={p.color} />
          </mesh>

          {/* Twin glowing thruster engines */}
          <mesh position={[-0.14, 0, -0.45]}>
            <boxGeometry args={[0.08, 0.1, 0.15]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
          <mesh position={[0.14, 0, -0.45]}>
            <boxGeometry args={[0.08, 0.1, 0.15]} />
            <meshBasicMaterial color={p.color} />
          </mesh>

          {/* Darting light trail stream behind vehicle */}
          <mesh position={[0, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.14, 1.6, 8, 1, true]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Thruster point light */}
          <pointLight color={p.color} intensity={1.8} distance={4} />
        </group>
      ))}
    </group>
  );
};
