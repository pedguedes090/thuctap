/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'none' },
        },
        alertIn: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
        fade: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        rise: 'riseIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        list: 'riseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        route: 'riseIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both',
        pop: 'popIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
        alert: 'alertIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) both',
      }
    },
  },
  plugins: [],
};
