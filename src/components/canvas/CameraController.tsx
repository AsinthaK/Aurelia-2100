import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TransitMode, CameraPreset } from '../../types';

interface CameraControllerProps {
  mode: TransitMode;
  isMobile: boolean;
  onTransitionComplete?: (mode: TransitMode) => void;
}

// Desktop presets
const PRESETS_DESKTOP: Record<TransitMode, CameraPreset> = {
  city:    { position: [0, 18, 34],   target: [0, 2, 0],    fov: 45 },
  air:     { position: [11, 12, 12],  target: [2, 9, 2],    fov: 52 },
  roads:   { position: [14, 4.5, 9],  target: [6, 1.2, 3],  fov: 48 },
  subrail: { position: [6, -7.5, 9.5],target: [0, -4.2, 0], fov: 54 },
};

// Mobile portrait presets — pulled back further so the city never clips edges
const PRESETS_MOBILE: Record<TransitMode, CameraPreset> = {
  city:    { position: [0, 22, 46],   target: [0, 1, 0],    fov: 60 },
  air:     { position: [10, 16, 22],  target: [0, 9, 0],    fov: 65 },
  roads:   { position: [16, 8, 18],   target: [4, 1, 2],    fov: 62 },
  subrail: { position: [8, -6, 16],   target: [0, -4, 0],   fov: 65 },
};

export const CameraController: React.FC<CameraControllerProps> = ({
  mode,
  isMobile,
  onTransitionComplete,
}) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const desiredTarget = useRef(new THREE.Vector3(0, 1, 0));
  const desiredPos    = useRef(new THREE.Vector3(0, 22, 46));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const presets = isMobile ? PRESETS_MOBILE : PRESETS_DESKTOP;
    const preset  = presets[mode];
    desiredPos.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);

    // Dynamically set FOV based on mobile/portrait
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov = preset.fov;
    perspCam.updateProjectionMatrix();

    isTransitioning.current = true;
  }, [mode, isMobile, camera]);

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 2.6, 1);

    camera.position.lerp(desiredPos.current, lerpSpeed);
    currentTarget.current.lerp(desiredTarget.current, lerpSpeed);
    camera.lookAt(currentTarget.current);

    // Subtle ambient drift in city overview only
    if (!isTransitioning.current && mode === 'city') {
      const t = performance.now() * 0.0003;
      camera.position.x += Math.sin(t) * 0.007;
      camera.position.y += Math.cos(t * 0.8) * 0.005;
    }

    const posDist    = camera.position.distanceTo(desiredPos.current);
    const targetDist = currentTarget.current.distanceTo(desiredTarget.current);

    if (isTransitioning.current && posDist < 0.3 && targetDist < 0.25) {
      isTransitioning.current = false;
      onTransitionComplete?.(mode);
    }
  });

  return null;
};
