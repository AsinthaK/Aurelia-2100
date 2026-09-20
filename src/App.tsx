import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/canvas/Scene';
import { NavigationMenu } from './components/ui/NavigationMenu';
import { TransitDataCard } from './components/ui/TransitDataCard';
import { Header } from './components/ui/Header';
import { TransitMode } from './types';
import { sound } from './utils/audio';

/** Detect if we're on a narrow / touch screen */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

export const App: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentMode, setCurrentMode] = useState<TransitMode>('city');
  const [isCardVisible, setIsCardVisible] = useState(false);

  const handleSelectMode = useCallback((mode: TransitMode) => {
    setIsCardVisible(false);
    setCurrentMode(mode);
  }, []);

  const handleResetView = useCallback(() => {
    setIsCardVisible(false);
    setCurrentMode('city');
  }, []);

  const handleCameraArrived = useCallback((mode: TransitMode) => {
    if (mode !== 'city') setIsCardVisible(true);
  }, []);

  // Keyboard nav (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const map: Record<string, () => void> = {
        '1': () => { sound.playClick(); sound.playTransition('air');     handleSelectMode('air'); },
        '2': () => { sound.playClick(); sound.playTransition('roads');   handleSelectMode('roads'); },
        '3': () => { sound.playClick(); sound.playTransition('subrail'); handleSelectMode('subrail'); },
        'Escape': () => { sound.playClick(); handleResetView(); },
        '0':      () => { sound.playClick(); handleResetView(); },
      };
      map[e.key]?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSelectMode, handleResetView]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 font-sans touch-none select-none">
      {/* Full-screen 3D canvas */}
      <Scene mode={currentMode} isMobile={isMobile} onCameraArrived={handleCameraArrived} />

      {/* Compact mobile-first header */}
      <Header currentMode={currentMode} onResetView={handleResetView} />

      {/* Bottom dock (mobile) / side dock (desktop) */}
      <NavigationMenu currentMode={currentMode} onSelectMode={handleSelectMode} />

      {/* Transit telemetry card — slides up on mobile */}
      <TransitDataCard
        mode={currentMode}
        isVisible={isCardVisible}
        onClose={() => setIsCardVisible(false)}
      />

      {/* Bottom hint — hidden on mobile to avoid clutter above nav dock */}
      <footer className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono-tech text-slate-300 flex items-center gap-3 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse inline-block" />
          <span>Select a Sector to fly the camera · Press ESC to reset</span>
        </div>
      </footer>
    </main>
  );
};

export default App;
