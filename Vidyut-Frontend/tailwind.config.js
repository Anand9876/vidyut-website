/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'crimson-accent': '#e50914',
        'crimson-dim': '#8b0000',
        'silver-top': '#ffffff',
        'silver-mid': '#cbd5e1',
        'silver-bottom': '#64748b',
        'cyber-dark': '#000000',
        'cyber-surface': '#08080c',
        'cyber-card': '#0e0f16',
        'cyber-border': '#1c1e2d',
      },
      fontFamily: {
        impact: ['"Anton"', 'Impact', 'sans-serif'],
        syncopate: ['"Syncopate"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'red-laser': '0 0 25px rgba(229, 9, 20, 0.6)',
        'silver-glow': '0 0 40px rgba(255, 255, 255, 0.25)',
      },
      keyframes: {
        slightShake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(-1.5px, 1px) rotate(-0.3deg)' },
          '40%': { transform: 'translate(1.5px, -1px) rotate(0.3deg)' },
          '60%': { transform: 'translate(-1px, -0.5px) rotate(-0.2deg)' },
          '80%': { transform: 'translate(1px, 0.5px) rotate(0.2deg)' },
        },
        slowZoom: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        }
      },
      animation: {
        'slight-shake': 'slightShake 0.2s ease-in-out infinite',
        'slow-zoom': 'slowZoom 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'subtle-pulse': 'subtlePulse 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
