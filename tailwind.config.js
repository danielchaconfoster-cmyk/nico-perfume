/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9f4',
          100: '#f6f1e6',
          200: '#ecdec4',
          300: '#e0c69d',
          400: '#d2ab72',
          500: '#c5a880',
          600: '#b08b53',
          700: '#8f6e3e',
          800: '#745735',
          900: '#5f472e',
          950: '#342517',
        },
        noir: {
          900: '#070709',
          850: '#0c0c0f',
          800: '#121217',
          750: '#181820',
          700: '#1f1f2a',
          600: '#2c2c3b',
          500: '#3e3e52',
        },
        emerald: {
          950: '#031a14',
          900: '#062d23',
          800: '#0a4234',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
