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
        flux: {
          red: '#E63946',
          'red-dark': '#C1121F',
          'red-light': '#FF6B6B',
          black: 'var(--flux-black)',
          'black-soft': 'var(--flux-black-soft)',
          'black-card': 'var(--flux-black-card)',
          'black-border': 'var(--flux-black-border)',
          white: 'var(--flux-text)',
          'white-muted': 'var(--flux-text-muted)',
          'white-dim': 'var(--flux-text-dim)',
          gray: 'var(--flux-gray)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(230, 57, 70, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(230, 57, 70, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-flux': 'linear-gradient(135deg, #181818 0%, #2A1010 50%, #181818 100%)',
      },
    },
  },
  plugins: [],
}
