import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Gauge, Zap, Users, ShieldCheck, X, ChevronDown } from 'lucide-react';
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
    category: 'Aerial Autonomous Network',
    vehicle: 'Flying Bus 42',
    status: 'In Flight · On Schedule',
    arrivalEstimate: 'Arriving in 2 mins',
    velocity: '480 km/h',
    efficiency: '99.4% Anti-Grav',
    occupancy: '78% · 39/50 Seats',
    routeCode: 'SKY-A42',
    elevation: '+450m Above City',
    description: 'Ion-propulsion aerocrafts flying dynamic corridors between skyscraper spires with zero ground congestion.',
    highlights: ['No Ground Traffic', 'Wind Deflection AI', 'Collision-Free Mesh'],
    accentColor: 'cyan',
  },
  roads: {
    id: 'roads',
    title: 'Perimeter Smart Ringway',
    category: 'Multi-Level Smart Highway',
    vehicle: 'Smart Arterial Pod 108',
    status: 'Cruising · Grid Sync Active',
    arrivalEstimate: 'Arriving in 4 mins',
    velocity: '240 km/h',
    efficiency: '98.8% Inductive Power',
    occupancy: '92% · 110/120 Seats',
    routeCode: 'RING-2',
    elevation: '+28m Elevated Deck',
    description: 'Magnetically coupled pods riding inductive surface ribbons with real-time route adjustments.',
    highlights: ['Inductive Charging Road', 'Precise Platooning', 'Auto Bypass Nodes'],
    accentColor: 'orange',
  },
  subrail: {
    id: 'subrail',
    title: 'Sub-Oceanic Hyper-Tube',
    category: 'Submerged Vacuum Rail',
    vehicle: 'Oceanic Hyper-Train S-9',
    status: 'Submerged · Hydro-Shield On',
    arrivalEstimate: 'Arriving in 1 min',
    velocity: '920 km/h',
    efficiency: '99.9% Superconducting',
    occupancy: '64% · 256/400 Seats',
    routeCode: 'SUB-09',
    elevation: '-180m Ocean Depth',
    description: 'Pressurised transparent conduits deep below the island. Maglev capsules speed through bioluminescent ocean trenches.',
    highlights: ['Hydrostatic Shield', 'Underwater Refraction Tube', 'Sonar Navigation'],
    accentColor: 'emerald',
  },
};

const ACCENT = {
  cyan:    { border: 'border-cyber-cyan/50',    badge: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40',    bar: 'bg-cyber-cyan',    dot: 'bg-cyber-cyan' },
  orange:  { border: 'border-cyber-orange/50',  badge: 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/40',  bar: 'bg-cyber-orange',  dot: 'bg-cyber-orange' },
  emerald: { border: 'border-cyber-emerald/50', badge: 'bg-cyber-emerald/20 text-cyber-emerald border-cyber-emerald/40', bar: 'bg-cyber-emerald', dot: 'bg-cyber-emerald' },
};

export const TransitDataCard: React.FC<TransitDataCardProps> = ({ mode, isVisible, onClose }) => {
  const [countdown, setCountdown] = useState(120);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isVisible && mode !== 'city') sound.playArrivalChime();
    setExpanded(false); // collapse on new sector
  }, [isVisible, mode]);

  useEffect(() => {
    const id = setInterval(() => setCountdown((n) => (n > 1 ? n - 1 : 120)), 1000);
    return () => clearInterval(id);
  }, []);

  if (mode === 'city' || !isVisible) return null;

  const data = TRANSIT_DATA[mode];
  const ac = ACCENT[data.accentColor];
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const timer = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

  return (
    <AnimatePresence>
      <motion.section
        key={mode}
        aria-label="Transit Info Card"
        /**
         * MOBILE: full-width slide up from bottom, sits above the nav dock (~80px)
         * DESKTOP: fixed right panel, right-6, top-24, w-[420px]
         */
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed z-40 pointer-events-auto
          /* mobile */
          left-0 right-0 bottom-[80px]
          mx-3
          /* desktop */
          md:left-auto md:right-6 md:top-24 md:bottom-24
          md:w-[420px] md:mx-0
        `}
      >
        <div className={`glass-panel rounded-2xl flex flex-col border ${ac.border} overflow-hidden`}>

          {/* ── HEADER ── */}
          <div className="px-4 pt-4 pb-3 border-b border-white/10 bg-black/40 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* Route badge */}
              <span className={`inline-block text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full border mb-1.5 uppercase tracking-wider ${ac.badge}`}>
                {data.routeCode}
              </span>
              {/* Vehicle name — large, legible */}
              <h2 className="text-lg md:text-xl font-display font-extrabold text-white tracking-wide leading-tight truncate">
                {data.vehicle}
              </h2>
              <p className="text-xs text-slate-300 font-medium truncate">{data.title}</p>
            </div>

            {/* Close — 44px target */}
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              aria-label="Close card"
              className="flex-shrink-0 p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── BODY ── */}
          <div className="px-4 pt-3 pb-4 space-y-3">

            {/* Arrival Banner */}
            <div className="flex items-center justify-between bg-space-900/90 rounded-xl px-4 py-3 border border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-cyber-cyan flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider font-bold">ETA</p>
                  {/* Deliberately large for accessibility */}
                  <p className="text-xl md:text-2xl font-display font-black text-white leading-tight">
                    {data.arrivalEstimate}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-mono-tech text-slate-400">COUNTDOWN</p>
                <p className={`text-base font-mono-tech font-bold ${ac.dot.replace('bg-', 'text-')}`}>
                  {timer}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] font-mono-tech text-slate-300 mb-1">
                <span>Route Progress</span>
                <span className="font-bold text-white">84%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: '30%' }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className={`h-full ${ac.bar} rounded-full`}
                />
              </div>
            </div>

            {/* Metrics — 2-col grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Gauge className="w-4 h-4 text-cyber-cyan" />, label: 'Speed',     value: data.velocity },
                { icon: <Zap   className="w-4 h-4 text-yellow-400" />, label: 'Altitude',  value: data.elevation },
                { icon: <Users className="w-4 h-4 text-cyber-emerald" />, label: 'Capacity', value: data.occupancy },
                { icon: <ShieldCheck className="w-4 h-4 text-cyber-cyan" />, label: 'Efficiency', value: data.efficiency },
              ].map((m) => (
                <div key={m.label} className="bg-space-950/70 rounded-lg border border-white/10 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                    {m.icon}
                    <span className="font-mono-tech font-semibold">{m.label}</span>
                  </div>
                  <p className="text-sm font-display font-bold text-white leading-tight break-words">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Expandable Details — keeps card compact on mobile */}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono-tech active:scale-95 transition-transform"
            >
              <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  <p className="text-xs leading-relaxed text-slate-300 px-1">
                    {data.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono-tech px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};
