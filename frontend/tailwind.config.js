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
        'dark-bg': '#020617', // slate-950
        'neon-cyan': '#22d3ee',
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
      },
      boxShadow: {
        'glow-cyan': '0 0 15px #22d3ee, 0 0 30px rgba(34, 211, 238, 0.3)',
        'glow-purple': '0 0 15px #a855f7, 0 0 30px rgba(168, 85, 247, 0.3)',
        'glow-card': '0 0 30px rgba(34, 211, 238, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
