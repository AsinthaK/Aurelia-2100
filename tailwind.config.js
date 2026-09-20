/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#050B1A',
          800: '#0B152B',
          700: '#111F3C',
        },
        cyber: {
          cyan: '#00F2FE',
          cyanGlow: 'rgba(0, 242, 254, 0.4)',
          orange: '#FF7B00',
          orangeGlow: 'rgba(255, 123, 0, 0.4)',
          purple: '#9D4EDD',
          emerald: '#00F5D4',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(0, 242, 254, 0.5), 0 0 50px rgba(0, 242, 254, 0.2)',
        'neon-orange': '0 0 25px rgba(255, 123, 0, 0.5), 0 0 50px rgba(255, 123, 0, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.57)',
        'glass-glow': '0 0 20px rgba(0, 242, 254, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float-slow': 'floatSlow 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 8px rgba(0,242,254,0.6))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 18px rgba(0,242,254,0.9))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
