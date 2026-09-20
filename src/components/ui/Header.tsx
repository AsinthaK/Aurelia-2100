import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';
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
      const yr = 2100;
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${yr}.${mo}.${da} // ${hr}:${mi}:${se} GST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playClick();
  };

  const handleReset = () => {
    sound.playClick();
    sound.playTransition('city');
    onResetView();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-6 pointer-events-none flex items-center justify-between">
      {/* Brand Title & System Status */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="relative">
            <Globe2 className="w-6 h-6 text-cyber-cyan animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00F2FE]" />
          </div>
          <div>
            <h1 className="text-sm font-display font-extrabold tracking-widest text-white uppercase">
              Transportation <span className="text-cyber-cyan font-black">2100</span>
            </h1>
            <p className="text-[10px] font-mono-tech tracking-wider text-slate-400">
              Neo-Arcadia Floating Metropolis
            </p>
          </div>
        </div>

        {/* Anti-Grav Field Telemetry Chip */}
        <div className="hidden md:flex glass-panel px-3.5 py-2 rounded-xl border border-white/10 items-center gap-2.5">
          <Activity className="w-4 h-4 text-emerald-400" />
          <div className="text-[11px] font-mono-tech">
            <span className="text-slate-400">ANTI-GRAV HARMONICS: </span>
            <span className="text-emerald-400 font-bold">100.0% STABLE</span>
          </div>
        </div>
      </div>

      {/* Center Prompt / "Back to City View" prominent floating button */}
      <div className="pointer-events-auto flex items-center gap-3">
        <AnimatePresence>
          {currentMode !== 'city' && (
            <motion.button
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-cyber-cyan text-space-950 font-display font-bold text-xs tracking-wider uppercase shadow-neon-cyan hover:brightness-110 transition-all border border-cyan-300"
            >
              <RotateCcw className="w-4 h-4 text-space-950" />
              Back to City View
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right Controls: Clock & Audio */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Futuristic Time Display */}
        <div className="hidden lg:block glass-panel px-3.5 py-2 rounded-xl border border-white/10 text-[11px] font-mono-tech text-slate-300">
          {timeStr}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="glass-panel p-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-cyber-cyan/50 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-cyber-cyan" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
};
