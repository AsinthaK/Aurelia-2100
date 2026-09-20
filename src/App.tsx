import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/canvas/Scene';
import { NavigationMenu } from './components/ui/NavigationMenu';
import { TransitDataCard } from './components/ui/TransitDataCard';
import { Header } from './components/ui/Header';
import { TransitMode } from './types';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<TransitMode>('city');
  const [isCardVisible, setIsCardVisible] = useState(false);

  // When mode changes, hide data card until camera flight completes
  const handleSelectMode = useCallback((mode: TransitMode) => {
    setIsCardVisible(false);
    setCurrentMode(mode);
  }, []);

  const handleResetView = useCallback(() => {
    setIsCardVisible(false);
    setCurrentMode('city');
  }, []);

  // Called when camera has reached its sector destination
  const handleCameraArrived = useCallback((mode: TransitMode) => {
    if (mode !== 'city') {
      setIsCardVisible(true);
    }
  }, []);

  // Keyboard accessibility: 1 for Air, 2 for Roads, 3 for Subrail, Esc for City View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '1') {
        sound.playClick();
        sound.playTransition('air');
        handleSelectMode('air');
      } else if (e.key === '2') {
        sound.playClick();
        sound.playTransition('roads');
        handleSelectMode('roads');
      } else if (e.key === '3') {
        sound.playClick();
        sound.playTransition('subrail');
        handleSelectMode('subrail');
      } else if (e.key === 'Escape' || e.key === '0') {
        sound.playClick();
        sound.playTransition('city');
        handleResetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectMode, handleResetView]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 font-sans">
      {/* 3D WebGL Canvas Scene */}
      <Scene mode={currentMode} onCameraArrived={handleCameraArrived} />

      {/* Top Header & Reset Button */}
      <Header currentMode={currentMode} onResetView={handleResetView} />

      {/* Floating Glassmorphism Navigation Menu (Air Transit, Smart Roads, Sub-Rail) */}
      <NavigationMenu currentMode={currentMode} onSelectMode={handleSelectMode} />

      {/* Dynamic Framer Motion Telemetry Card Overlay */}
      <TransitDataCard
        mode={currentMode}
        isVisible={isCardVisible}
        onClose={() => setIsCardVisible(false)}
      />

      {/* Bottom Subtle Status & Quick Guide */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono-tech text-slate-300 flex items-center gap-3 backdrop-blur-md">
          <span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          <span>Select any Sector on the left to trigger cinematic transit zoom</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Press [ESC] to reset view</span>
        </div>
      </footer>
    </main>
  );
};

export default App;
