import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TransitMode, CameraPreset } from '../../types';

interface CameraControllerProps {
  mode: TransitMode;
  onTransitionComplete?: (mode: TransitMode) => void;
}

const PRESETS: Record<TransitMode, CameraPreset> = {
  // Macro Overview: High-angle wide cinematic view showing the floating metropolis in deep space
  city: {
    position: [0, 18, 34],
    target: [0, 2, 0],
    fov: 45,
  },
  // Air Transit: High-altitude dynamic framing of flying buses and aerial light trails
  air: {
    position: [11, 12, 12],
    target: [2, 9, 2],
    fov: 52,
  },
  // Smart Roads: Close-range perspective locked on elevated highway loops and autonomous pods
  roads: {
    position: [14, 4.5, 9],
    target: [6, 1.2, 3],
    fov: 48,
  },
  // Sub-Rail: Plunging deep underneath the city bedrock to frame the transparent glass tubes
  subrail: {
    position: [6, -7.5, 9.5],
    target: [0, -4.2, 0],
    fov: 54,
  },
};

export const CameraController: React.FC<CameraControllerProps> = ({ mode, onTransitionComplete }) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 2, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 2, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 18, 34));
  const transitionProgress = useRef(1);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const preset = PRESETS[mode];
    desiredPos.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    transitionProgress.current = 0;
    isTransitioning.current = true;
  }, [mode]);

  useFrame((_, delta) => {
    // Smooth cinematic damping
    const lerpSpeed = Math.min(delta * 2.8, 1);

    camera.position.lerp(desiredPos.current, lerpSpeed);
    currentTarget.current.lerp(desiredTarget.current, lerpSpeed);
    camera.lookAt(currentTarget.current);

    // Subtle breathing / drift when static
    if (!isTransitioning.current && mode === 'city') {
      const time = performance.now() * 0.0004;
      camera.position.x += Math.sin(time) * 0.008;
      camera.position.y += Math.cos(time * 0.8) * 0.006;
    }

    // Check completion
    const posDist = camera.position.distanceTo(desiredPos.current);
    const targetDist = currentTarget.current.distanceTo(desiredTarget.current);

    if (isTransitioning.current && posDist < 0.25 && targetDist < 0.2) {
      isTransitioning.current = false;
      if (onTransitionComplete) {
        onTransitionComplete(mode);
      }
    }
  });

  return null;
};
