import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { CityModel } from './CityModel';
import { AirTransit } from './AirTransit';
import { SmartRoads } from './SmartRoads';
import { SubRail } from './SubRail';
import { CameraController } from './CameraController';
import { TransitMode } from '../../types';

interface SceneProps {
  mode: TransitMode;
  onCameraArrived: (mode: TransitMode) => void;
}

export const Scene: React.FC<SceneProps> = ({ mode, onCameraArrived }) => {
  return (
    <div className="w-full h-full absolute inset-0 bg-space-950">
      <Canvas
        camera={{ position: [0, 18, 34], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <color attach="background" args={[mode === 'subrail' ? '#011022' : '#030712']} />
        <fog attach="fog" args={[mode === 'subrail' ? '#011226' : '#030712', mode === 'subrail' ? 8 : 25, mode === 'subrail' ? 42 : 120]} />

        {/* Cinematic Deep Space & Underwater Lighting */}
        <ambientLight
          intensity={mode === 'subrail' ? 0.8 : 0.45}
          color={mode === 'subrail' ? '#00e5ff' : '#1e293b'}
        />
        {/* Distant sun / upper sky light */}
        <directionalLight
          position={[25, 30, 20]}
          intensity={mode === 'subrail' ? 0.6 : 1.8}
          color="#dbeafe"
          castShadow
        />
        {/* Under-island upward cyber bounce light */}
        <directionalLight
          position={[-15, -20, -10]}
          intensity={mode === 'subrail' ? 2.5 : 1.2}
          color="#00F2FE"
        />
        {/* Submerged ocean trench point light */}
        <pointLight position={[0, -10, 0]} color={mode === 'subrail' ? '#00a6ff' : '#FF7B00'} intensity={mode === 'subrail' ? 5 : 3} distance={35} />

        {/* Deep Space Background Stars & Cosmic Particles */}
        <Stars
          radius={120}
          depth={60}
          count={4000}
          factor={4}
          saturation={1}
          fade
          speed={0.8}
        />

        <Suspense fallback={null}>
          {/* Smooth Cinematic Camera Rig */}
          <CameraController mode={mode} onTransitionComplete={onCameraArrived} />

          {/* Master 3D Anti-Gravity Metropolis */}
          <CityModel />

          {/* Sky Level: Flying Buses & Glowing Neon Trails */}
          <AirTransit />

          {/* Surface Level: Multi-level Illuminated Smart Highways */}
          <SmartRoads />

          {/* Sub-Surface Level: Transparent Vacuum Tubes & High-Speed Trains */}
          <SubRail />
        </Suspense>
      </Canvas>
    </div>
  );
};
