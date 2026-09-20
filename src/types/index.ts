export type TransitMode = 'city' | 'air' | 'roads' | 'subrail';

export interface TransitInfo {
  id: TransitMode;
  title: string;
  category: string;
  vehicle: string;
  status: string;
  arrivalEstimate: string;
  velocity: string;
  efficiency: string;
  occupancy: string;
  routeCode: string;
  description: string;
  elevation: string;
  highlights: string[];
  accentColor: 'cyan' | 'orange' | 'emerald';
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}
