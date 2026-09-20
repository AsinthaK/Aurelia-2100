import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Gauge, Zap, Users, ShieldCheck, X, ArrowUpRight, Radio } from 'lucide-react';
import { TransitMode, TransitInfo } from '../../types';
import { sound } from '../../utils/audio';

interface TransitDataCardProps {
  mode: TransitMode;
  isVisible: boolean;
  onClose: () => void;
}

const TRANSIT_DATA: Record<Exclude<TransitMode, 'city'>, TransitInfo> = {
  air: {
    id: 'air',
    title: 'Sky Transit Corridor 01',
    category: 'Aerial Multi-Lane Autonomous Network',
    vehicle: 'Flying Bus 42',
    status: 'In Flight - On Schedule',
    arrivalEstimate: 'Arriving in 2 mins',
    velocity: '480 km/h',
    efficiency: '99.4% Anti-Grav Efficiency',
    occupancy: '78% (39/50 Passengers)',
    routeCode: 'SKY-CORRIDOR-A42',
    elevation: '+450m Above Surface Hub',
    description: 'High-speed ion propulsion aerocrafts operating on adaptive vector coordinates with dynamic collision-free mesh spacing between skyscraper spires.',
    highlights: ['Zero Ground Congestion', 'Dynamic Wind Deflection', 'Autonomous Vector Mesh'],
    accentColor: 'cyan',
  },
  roads: {
    id: 'roads',
    title: 'Perimeter Smart Ringway',
    category: 'Multi-Level Intelligent Highway',
    vehicle: 'Smart Arterial Pod 108',
    status: 'Cruising - Active Grid Sync',
    arrivalEstimate: 'Arriving in 4 mins',
    velocity: '240 km/h',
    efficiency: '98.8% Inductive Power Sync',
    occupancy: '92% (110/120 Passengers)',
    routeCode: 'RINGWAY-LEVEL-2',
    elevation: '+28m Elevated Deck',
    description: 'Magnetically coupled surface ribbons featuring real-time roadbed charging, instant routing adjustments, and high-density platooning.',
    highlights: ['Inductive Roadbed Power', 'Centimeter-Precise Platooning', 'Autonomous Bypass Nodes'],
    accentColor: 'orange',
  },
  subrail: {
    id: 'subrail',
    title: 'Sub-Oceanic Abyssal Hyper-Tube',
    category: 'Submerged Underwater Vacuum System',
    vehicle: 'Oceanic Hyper-Train S-9',
    status: 'Deep Current Submerged - Hydro-Shield Active',
    arrivalEstimate: 'Arriving in 1 min',
    velocity: '920 km/h',
    efficiency: '99.9% Hydro-Superconducting Levitation',
    occupancy: '64% (256/400 Passengers)',
    routeCode: 'SUB-AQUA-09',
    elevation: '-180m Submerged Oceanic Depth',
    description: 'Pressurized transparent conduits anchored deep below the floating island in illuminated oceanic trenches, carrying high-speed maglev capsules through bioluminescent waters.',
    highlights: ['Hydrostatic Pressure Shield', 'Refractive Underwater Conduits', 'Sonar Sonar Guidance'],
    accentColor: 'emerald',
  },
};

export const TransitDataCard: React.FC<TransitDataCardProps> = ({ mode, isVisible, onClose }) => {
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (isVisible && mode !== 'city') {
      sound.playArrivalChime();
    }
  }, [isVisible, mode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (mode === 'city' || !isVisible) {
    return null;
  }

  const data = TRANSIT_DATA[mode];
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const timeFormatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

  const borderStyles =
    data.accentColor === 'cyan'
      ? 'border-cyber-cyan/50 shadow-neon-cyan'
      : data.accentColor === 'orange'
      ? 'border-cyber-orange/50 shadow-neon-orange'
      : 'border-cyber-emerald/50 shadow-[0_0_30px_rgba(0,245,212,0.4)]';

  const badgeBg =
    data.accentColor === 'cyan'
      ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40'
      : data.accentColor === 'orange'
      ? 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/40'
      : 'bg-cyber-emerald/20 text-cyber-emerald border-cyber-emerald/40';

  const progressBg =
    data.accentColor === 'cyan'
      ? 'bg-cyber-cyan'
      : data.accentColor === 'orange'
      ? 'bg-cyber-orange'
      : 'bg-cyber-emerald';

  return (
    <AnimatePresence>
      <motion.section
        aria-label="Transit Telemetry Card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed right-6 top-24 bottom-24 w-[420px] max-w-[calc(100vw-3rem)] z-40 pointer-events-auto flex flex-col`}
      >
        <div className={`glass-panel rounded-2xl flex flex-col overflow-hidden h-full border ${borderStyles} transition-all`}>
          {/* Header Banner */}
          <div className="p-5 pb-3 border-b border-white/10 flex items-start justify-between bg-black/40">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-mono-tech px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${badgeBg}`}>
                  {data.routeCode}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-mono-tech text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  LIVE TELEMETRY
                </span>
              </div>
              <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
                {data.vehicle}
              </h2>
              <p className="text-xs text-slate-300 font-medium">{data.title}</p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Dismiss Card"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Body with Large High-Contrast Typography for Accessibility */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Primary High-Contrast Arrival Banner */}
            <div className="p-4 rounded-xl bg-space-900/90 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyber-cyan">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-tech tracking-wider uppercase text-slate-400 font-bold">
                    Estimated Arrival
                  </div>
                  <div className="text-2xl font-display font-black text-white tracking-tight">
                    {data.arrivalEstimate}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono-tech text-slate-400">COUNTDOWN</div>
                <div className="text-sm font-mono-tech font-bold text-cyber-cyan">
                  {timeFormatted}
                </div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono-tech text-slate-300 font-medium">
                <span>Trajectory Progress</span>
                <span className="text-white font-bold">84%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: '40%' }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full ${progressBg} rounded-full`}
                />
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-space-950/70 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Gauge className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span className="font-mono-tech font-semibold">Speed</span>
                </div>
                <div className="text-lg font-display font-bold text-white tracking-wide">
                  {data.velocity}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-space-950/70 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Radio className="w-3.5 h-3.5 text-cyber-orange" />
                  <span className="font-mono-tech font-semibold">Elevation</span>
                </div>
                <div className="text-base font-display font-bold text-white tracking-tight">
                  {data.elevation}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-space-950/70 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Users className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span className="font-mono-tech font-semibold">Capacity</span>
                </div>
                <div className="text-xs font-mono-tech font-bold text-slate-200">
                  {data.occupancy}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-space-950/70 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-mono-tech font-semibold">Efficiency</span>
                </div>
                <div className="text-xs font-mono-tech font-bold text-slate-200">
                  {data.efficiency}
                </div>
              </div>
            </div>

            {/* Sector Description */}
            <div className="p-3.5 rounded-xl bg-space-900/60 border border-white/10 text-xs leading-relaxed text-slate-300">
              <div className="flex items-center gap-1.5 text-cyber-cyan font-mono-tech text-[11px] font-bold uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Autonomous Transit Protocol
              </div>
              <p>{data.description}</p>
            </div>

            {/* Highlights Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono-tech font-medium px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between">
            <span className="text-[11px] font-mono-tech text-slate-400">
              Station Beacon: <strong className="text-white">Active (SYNC 100%)</strong>
            </span>
            <button
              onClick={() => sound.playClick()}
              className="flex items-center gap-1 text-xs font-display font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              Transit Manifest <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};
