/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nl: {
          petrol: {
            DEFAULT: '#006674',
            light: '#088395',
            dark: '#004a55',
            soft: '#e6f4f6',
          },
          gold: {
            DEFAULT: '#EBA83A',
            light: '#F8C673',
            dark: '#CA861B',
            soft: '#FEF8EE',
          },
          coral: {
            DEFAULT: '#E86A58',
            light: '#F29688',
            dark: '#C74A38',
            soft: '#FDEDEA',
          },
          green: {
            DEFAULT: '#3B9E78',
            light: '#65BC9B',
            dark: '#267757',
            soft: '#EAF6F1',
          },
          navy: '#1A365D',
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Quicksand"', '"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 74, 85, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -4px rgba(0, 74, 85, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(235, 168, 58, 0.35)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
