import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { TransitMode } from '../../types';
import { sound } from '../../utils/audio';

interface HeaderProps {
  currentMode: TransitMode;
  onResetView: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onResetView }) => {
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`2100 · ${hr}:${mi}`);
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled((v) => !v);
    if (!soundEnabled) sound.playClick();
  };

  const handleReset = () => {
    sound.playClick();
    sound.playTransition('city');
    onResetView();
  };

  return (
    /**
     * Mobile: compact single-row bar at top.
     * Desktop: spacious 3-column header.
     */
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none px-4 pt-4 pb-2 md:px-6 md:pt-5">
      <div className="flex items-center justify-between gap-3">

        {/* ── LEFT: Brand ── */}
        <div className="pointer-events-auto flex-shrink-0">
          <div className="glass-panel flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10">
            <Globe2 className="w-5 h-5 text-cyber-cyan animate-pulse flex-shrink-0" />
            <div>
              <h1 className="text-xs md:text-sm font-display font-extrabold tracking-widest text-white uppercase leading-none">
                Transport <span className="text-cyber-cyan">2100</span>
              </h1>
              <p className="hidden sm:block text-[9px] md:text-[10px] font-mono-tech text-slate-400 tracking-wider mt-0.5">
                Neo-Arcadia Anti-Grav City
              </p>
            </div>
          </div>
        </div>

        {/* ── CENTER: Back to City — prominent, large touch target ── */}
        <div className="flex-1 flex justify-center pointer-events-auto">
          <AnimatePresence>
            {currentMode !== 'city' && (
              <motion.button
                initial={{ opacity: 0, y: -14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                /* min 48px touch target */
                className="
                  flex items-center gap-2 px-5 py-3 md:px-6 md:py-2.5
                  rounded-xl bg-cyber-cyan text-space-950
                  font-display font-bold text-sm md:text-xs tracking-wider uppercase
                  shadow-neon-cyan border border-cyan-300
                  active:scale-95 transition-transform
                  min-h-[48px]
                "
              >
                <RotateCcw className="w-4 h-4" />
                <span>City View</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Clock + Sound toggle ── */}
        <div className="pointer-events-auto flex-shrink-0 flex items-center gap-2">
          {/* Clock — visible sm+ */}
          <div className="hidden sm:block glass-panel px-3 py-2 rounded-xl border border-white/10 text-[11px] font-mono-tech text-slate-300">
            {timeStr}
          </div>

          {/* Sound toggle — always visible, 48px touch target */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="
              glass-panel p-3 rounded-xl border border-white/10
              text-slate-300 active:scale-95 transition-transform
              min-w-[48px] min-h-[48px] flex items-center justify-center
            "
          >
            {soundEnabled
              ? <Volume2 className="w-5 h-5 text-cyber-cyan" />
              : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
