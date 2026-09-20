# Transportation 2100 - Interactive 3D Anti-Gravity Metropolis

A futuristic, high-contrast 3D front-end application built with **React Three Fiber**, **Three.js**, **Framer Motion**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. The Anti-Gravity City
- **Floating Island Base:** Inverted dark bedrock mass with glowing subterranean energy rings and downward anti-gravity stabilizer beam.
- **Continuous Anti-Gravity Bob:** Smooth sine-wave vertical bobbing motion applied to the metropolis.
- **Aesthetics:** Deep space high-contrast void with 4,000+ stars, dark obsidian skyscrapers, glowing cyan (`#00F2FE`) and neon orange (`#FF7B00`) window bands, and rooftop communication beacons.
- **Central Biosphere Dome:** Prominent crystalline dome housing a rotating, pulsing plasma core and holographic equatorial ring.

### 2. Multi-Modal Transport System
- 🛸 **Sky Level (Air Transit):** Glowing orange and cyan light trails and aerodynamic sky-buses darting along 3D Catmull-Rom splines between upper skyscraper spires.
- 🛣️ **Surface Level (Smart Roads):** Multi-level illuminated smart highway loops circling the city perimeter with autonomous pods and real-time underglow lights.
- 🚄 **Sub-Surface Level (Sub-Rail):** Below the bedrock, glowing transparent vacuum tubes thread through subterranean caverns, carrying sleek maglev bullet trains with trailing energy streams.

### 3. Interactive UI & Cinematic Transitions
- **Glassmorphism Navigation Dock:** Floating on the screen's edge with large, accessible icons and hotkeys (`1`, `2`, `3`, `ESC`).
- **Cinematic Camera Flight:**
  - *Air Transit:* Soars high into the aerial traffic corridors.
  - *Smart Roads:* Lowers and frames the swirling multi-tier highway loops.
  - *Sub-Rail:* Plunges downward under the island's underside to reveal the transparent vacuum tubes.
- **Framer Motion Data Card Overlays:** Once camera zoom completes, high-contrast telemetry cards fade in displaying route information, live arrival countdowns, speed metrics, and efficiency stats.
- **"Back to City View" Button:** Smoothly reverses the camera out to the macro orbital view.
- **Zero-Dependency Procedural Audio:** Synthesizes sci-fi transit whooshes, arrival chimes, and tactile clicks using the Web Audio API (with mute toggle).

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` | Zoom to **Air Transit** (Sky Corridors) |
| `2` | Zoom to **Smart Roads** (Highway Rings) |
| `3` | Plunge to **Sub-Rail** (Hyper-Maglev Tubes) |
| `ESC` / `0` | **Back to City View** (Macro Overview) |
