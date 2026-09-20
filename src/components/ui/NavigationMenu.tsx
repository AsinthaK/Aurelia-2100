import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass, TrainTrack, Layers } from 'lucide-react';
import { TransitMode } from '../../types';
import { sound } from '../../utils/audio';

interface NavigationMenuProps {
  currentMode: TransitMode;
  onSelectMode: (mode: TransitMode) => void;
}

interface NavItem {
  id: TransitMode;
  title: string;
  tagline: string;
  hotkey: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderGlow: string;
  activeColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'air',
    title: 'Air Transit',
    tagline: 'Sky Corridors & Aero-Buses',
    hotkey: '1',
    icon: Plane,
    accentColor: 'text-cyber-cyan',
    borderGlow: 'hover:border-cyber-cyan/60 hover:shadow-[0_0_25px_rgba(0,242,254,0.4)]',
    activeColor: 'border-cyber-cyan shadow-[0_0_30px_rgba(0,242,254,0.5)] bg-cyber-cyan/15 text-white',
  },
  {
    id: 'roads',
    title: 'Smart Roads',
    tagline: 'Multi-Level Highway Rings',
    hotkey: '2',
    icon: Compass,
    accentColor: 'text-cyber-orange',
    borderGlow: 'hover:border-cyber-orange/60 hover:shadow-[0_0_25px_rgba(255,123,0,0.4)]',
    activeColor: 'border-cyber-orange shadow-[0_0_30px_rgba(255,123,0,0.5)] bg-cyber-orange/15 text-white',
  },
  {
    id: 'subrail',
    title: 'Sub-Rail',
    tagline: 'Submerged Deep Ocean Tubes',
    hotkey: '3',
    icon: TrainTrack,
    accentColor: 'text-cyber-emerald',
    borderGlow: 'hover:border-cyber-emerald/60 hover:shadow-[0_0_25px_rgba(0,245,212,0.4)]',
    activeColor: 'border-cyber-emerald shadow-[0_0_30px_rgba(0,245,212,0.5)] bg-cyber-emerald/15 text-white',
  },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ currentMode, onSelectMode }) => {
  const handleClick = (id: TransitMode) => {
    sound.playClick();
    sound.playTransition(id);
    onSelectMode(id);
  };

  return (
    <aside
      aria-label="Transportation Mode Navigation"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="glass-panel rounded-2xl p-3.5 flex flex-col gap-3 shadow-glass border border-white/10 backdrop-blur-xl">
        <div className="px-3 pt-2 pb-1 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyber-cyan" />
            <span className="text-[11px] font-mono-tech tracking-widest text-slate-300 uppercase font-semibold">
              Sectors
            </span>
          </div>
          <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
            Press [1-3]
          </span>
        </div>

        <nav className="flex flex-col gap-2.5" role="tablist">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;

            return (
              <motion.button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(item.id)}
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all duration-300 ${
                  isActive
                    ? item.activeColor
                    : `bg-space-900/80 border-white/10 text-slate-300 ${item.borderGlow}`
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeSectorIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-cyber-cyan shadow-[0_0_12px_#00F2FE]"
                  />
                )}

                {/* Big Accessible Icon */}
                <div
                  className={`p-2.5 rounded-lg border transition-colors ${
                    isActive
                      ? 'bg-white/10 border-white/20'
                      : 'bg-space-950/60 border-white/10 group-hover:border-white/25'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${item.accentColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm tracking-wide text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-black/40 text-slate-400 border border-white/5">
                      {item.hotkey}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium tracking-tight">
                    {item.tagline}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
