// Procedural Web Audio API sound generator for futuristic UI effects
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  playTransition(mode: string) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';

      if (mode === 'subrail') {
        // Deep underwater rail dive with a distant sonar ping.
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.9);
        filter.frequency.setValueAtTime(260, now);
        filter.frequency.exponentialRampToValueAtTime(90, now + 0.9);

        // Sonar Ping
        setTimeout(() => {
          if (!this.ctx || !this.enabled) return;
          const sonarOsc = this.ctx.createOscillator();
          const sonarGain = this.ctx.createGain();
          const tNow = this.ctx.currentTime;
          sonarOsc.type = 'sine';
          sonarOsc.frequency.setValueAtTime(1420, tNow);
          sonarGain.gain.setValueAtTime(0.06, tNow);
          sonarGain.gain.exponentialRampToValueAtTime(0.0001, tNow + 1.2);
          sonarOsc.connect(sonarGain);
          sonarGain.connect(this.ctx.destination);
          sonarOsc.start(tNow);
          sonarOsc.stop(tNow + 1.2);
        }, 350);
      } else if (mode === 'air') {
        // High soaring whoosh for an aerial pod.
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.7);
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.7);
      } else if (mode === 'city') {
        // Soft autonomous bus arrival: two short electric door tones.
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(523.25, now + 0.16);
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.setValueAtTime(1800, now + 0.16);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.075, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        gain.gain.setValueAtTime(0.001, now + 0.28);
        gain.gain.linearRampToValueAtTime(0.065, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      } else if (mode === 'roads') {
        // Smart road pod: bright inductive power-up and magnetic glide.
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.55);
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.55);
      } else {
        // City/reset fallback.
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.4);
        filter.frequency.setValueAtTime(800, now);
      }

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.9);
    } catch {
      // Audio fallback silent
    }
  }

  playArrivalChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Sci-fi chord
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // silent
    }
  }
}

export const sound = new SoundController();
