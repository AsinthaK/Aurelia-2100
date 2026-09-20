import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HighwayVehicle {
  loopIndex: number;
  speed: number;
  offset: number;
  color: string;
}

export const SmartRoads: React.FC = () => {
  // Define multi-level elevated smart highway loops
  const { loops, loopGeometries } = useMemo(() => {
    // Outer Highway Loop (Elevated level 1)
    const curveOuter = new THREE.CatmullRomCurve3([
      new THREE.Vector3(14.5, 0.6, 0),
      new THREE.Vector3(10.2, 0.9, 10.2),
      new THREE.Vector3(0, 1.4, 14.5),
      new THREE.Vector3(-10.2, 1.0, 10.2),
      new THREE.Vector3(-14.5, 0.7, 0),
      new THREE.Vector3(-10.2, 0.5, -10.2),
      new THREE.Vector3(0, 0.8, -14.5),
      new THREE.Vector3(10.2, 1.1, -10.2),
    ], true);

    // Inner Highway Overpass Loop (Elevated level 2 - weaves across)
    const curveInner = new THREE.CatmullRomCurve3([
      new THREE.Vector3(11.5, 1.8, 2),
      new THREE.Vector3(3, 2.2, 11),
      new THREE.Vector3(-8, 1.7, 8),
      new THREE.Vector3(-11.5, 2.0, -3),
      new THREE.Vector3(-4, 1.6, -11),
      new THREE.Vector3(8, 2.4, -8),
    ], true);

    // Surface Arterial Ring (Low level 0.3)
    const curveSurface = new THREE.CatmullRomCurve3([
      new THREE.Vector3(6.5, 0.25, 0),
      new THREE.Vector3(4.6, 0.25, 4.6),
      new THREE.Vector3(0, 0.25, 6.5),
      new THREE.Vector3(-4.6, 0.25, 4.6),
      new THREE.Vector3(-6.5, 0.25, 0),
      new THREE.Vector3(-4.6, 0.25, -4.6),
      new THREE.Vector3(0, 0.25, -6.5),
      new THREE.Vector3(4.6, 0.25, -4.6),
    ], true);

    const roadTubeOuter = new THREE.TubeGeometry(curveOuter, 120, 0.45, 8, true);
    const roadTubeInner = new THREE.TubeGeometry(curveInner, 100, 0.4, 8, true);
    const roadTubeSurface = new THREE.TubeGeometry(curveSurface, 80, 0.35, 8, true);

    return {
      loops: [curveOuter, curveInner, curveSurface],
      loopGeometries: [roadTubeOuter, roadTubeInner, roadTubeSurface],
    };
  }, []);

  // Autonomous surface vehicles list
  const vehicles = useMemo<HighwayVehicle[]>(() => {
    return [
      { loopIndex: 0, speed: 0.06, offset: 0.05, color: '#00F2FE' },
      { loopIndex: 0, speed: 0.06, offset: 0.35, color: '#FF7B00' },
      { loopIndex: 0, speed: 0.06, offset: 0.68, color: '#00F2FE' },
      { loopIndex: 1, speed: 0.09, offset: 0.15, color: '#FF7B00' },
      { loopIndex: 1, speed: 0.09, offset: 0.60, color: '#00F5D4' },
      { loopIndex: 2, speed: 0.05, offset: 0.22, color: '#00F2FE' },
      { loopIndex: 2, speed: 0.05, offset: 0.72, color: '#FF7B00' },
    ];
  }, []);

  const vehicleMeshRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    vehicles.forEach((veh, idx) => {
      const group = vehicleMeshRefs.current[idx];
      if (!group) return;

      const curve = loops[veh.loopIndex];
      const u = (time * veh.speed + veh.offset) % 1;
      const pt = curve.getPointAt(u);
      const tangent = curve.getTangentAt(u).normalize();

      group.position.copy(pt);
      group.position.y += 0.35; // Ride atop the highway surface

      const lookTarget = group.position.clone().add(tangent);
      group.lookAt(lookTarget);
    });
  });

  return (
    <group>
      {/* Highway Multi-Tier Track Ribbons */}
      {/* Outer Loop */}
      <mesh geometry={loopGeometries[0]}>
        <meshStandardMaterial
          color="#0c1629"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Overpass Inner Loop */}
      <mesh geometry={loopGeometries[1]}>
        <meshStandardMaterial
          color="#0e1b33"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Surface Ring */}
      <mesh geometry={loopGeometries[2]}>
        <meshStandardMaterial
          color="#081020"
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>

      {/* Highway Support Columns anchoring to city deck */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 11.5;
        const z = Math.sin(rad) * 11.5;
        return (
          <mesh key={deg} position={[x, 0.9, z]}>
            <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
            <meshStandardMaterial color="#091428" metalness={0.9} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Autonomous Ground Highway Pods */}
      {vehicles.map((veh, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) vehicleMeshRefs.current[idx] = el;
          }}
        >
          {/* Streamlined Pod Body */}
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.16, 0.65]} />
            <meshStandardMaterial
              color="#0d1b38"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Glowing Headlight / Light Bar */}
          <mesh position={[0, 0.02, 0.33]}>
            <boxGeometry args={[0.26, 0.06, 0.04]} />
            <meshBasicMaterial color={veh.color} />
          </mesh>

          {/* Tail light */}
          <mesh position={[0, 0.02, -0.33]}>
            <boxGeometry args={[0.26, 0.04, 0.04]} />
            <meshBasicMaterial color="#FF3366" />
          </mesh>

          {/* Underglow neon pulse */}
          <pointLight color={veh.color} intensity={1.5} distance={2.5} position={[0, -0.05, 0]} />
        </group>
      ))}
    </group>
  );
};
