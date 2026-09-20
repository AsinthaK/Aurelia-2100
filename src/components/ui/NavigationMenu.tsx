import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass, TrainTrack } from 'lucide-react';
import { TransitMode } from '../../types';
import { sound } from '../../utils/audio';

interface NavigationMenuProps {
  currentMode: TransitMode;
  onSelectMode: (mode: TransitMode) => void;
}

const NAV_ITEMS = [
  {
    id: 'air' as TransitMode,
    title: 'Air Transit',
    icon: Plane,
    accentClass: 'text-cyber-cyan',
    activeBg: 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_20px_rgba(0,242,254,0.45)]',
    activeDot: 'bg-cyber-cyan',
    inactiveBg: 'bg-space-900/80 border-white/10',
  },
  {
    id: 'roads' as TransitMode,
    title: 'Smart Roads',
    icon: Compass,
    accentClass: 'text-cyber-orange',
    activeBg: 'bg-cyber-orange/20 border-cyber-orange shadow-[0_0_20px_rgba(255,123,0,0.45)]',
    activeDot: 'bg-cyber-orange',
    inactiveBg: 'bg-space-900/80 border-white/10',
  },
  {
    id: 'subrail' as TransitMode,
    title: 'Sub-Rail',
    icon: TrainTrack,
    accentClass: 'text-cyber-emerald',
    activeBg: 'bg-cyber-emerald/20 border-cyber-emerald shadow-[0_0_20px_rgba(0,245,212,0.45)]',
    activeDot: 'bg-cyber-emerald',
    inactiveBg: 'bg-space-900/80 border-white/10',
  },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const handleTap = (id: TransitMode) => {
    sound.playClick();
    sound.playTransition(id);
    onSelectMode(id);
  };

  return (
    /**
     * MOBILE-FIRST LAYOUT
     * On mobile: fixed horizontal bar at bottom (above safe-area) with equal-width pill buttons.
     * On desktop (md+): vertical floating side dock on the left edge.
     */
    <>
      {/* ── MOBILE BOTTOM DOCK (visible on <md) ── */}
      <nav
        aria-label="Transit Mode Navigation"
        className="
          md:hidden
          fixed bottom-0 left-0 right-0 z-50
          flex items-center justify-around
          px-3 py-3
          pb-[env(safe-area-inset-bottom,12px)]
          glass-panel border-t border-white/15
          backdrop-blur-xl
        "
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <motion.button
              key={item.id}
              aria-label={`Go to ${item.title}`}
              aria-pressed={isActive}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleTap(item.id)}
              /* 56 px min touch target height */
              className={`
                relative flex flex-col items-center justify-center gap-1
                flex-1 mx-1 py-2 rounded-xl border
                min-h-[56px] min-w-[56px]
                transition-all duration-300
                ${isActive ? item.activeBg : item.inactiveBg}
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileActiveDot"
                  className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${item.activeDot}`}
                />
              )}
              <Icon className={`w-7 h-7 ${item.accentClass}`} />
              <span className="text-[11px] font-mono-tech font-semibold text-white leading-none tracking-wide">
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* ── DESKTOP SIDE DOCK (visible on md+) ── */}
      <aside
        aria-label="Transportation Mode Navigation"
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 pointer-events-auto"
      >
        <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2 border border-white/10 backdrop-blur-xl">
          <div className="px-2 pt-1.5 pb-1 border-b border-white/10 text-[10px] font-mono-tech tracking-widest text-slate-400 uppercase font-semibold">
            Sectors
          </div>

          <nav className="flex flex-col gap-2" role="tablist">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <motion.button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTap(item.id)}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left
                    min-h-[52px] transition-all duration-300
                    ${isActive ? item.activeBg : `${item.inactiveBg} hover:border-white/25 hover:bg-white/5`}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveBar"
                      className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${item.activeDot}`}
                    />
                  )}
                  <div className="p-2 rounded-lg bg-black/30 border border-white/10">
                    <Icon className={`w-5 h-5 ${item.accentClass}`} />
                  </div>
                  <span className="font-display font-bold text-sm text-white tracking-wide pr-2">
                    {item.title}
                  </span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
