import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f6',
          100: '#f7ebe4',
          200: '#efd3c4',
          300: '#e2b09a',
          400: '#d08469',
          500: '#bf6043',
          600: '#a84e34',
          700: '#8c3f2a',
          800: '#733527',
          900: '#5f2e24',
        },
        nude: {
          50:  '#fdfcfb',
          100: '#f5efe8',
          200: '#ecddd0',
          300: '#dfc4ac',
          400: '#cda483',
          500: '#bc8761',
          600: '#a56e4c',
          700: '#89593d',
          800: '#714b35',
          900: '#5e3f2e',
        },
        charcoal: '#1c1c1e',
        pearl: '#faf9f7',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '13': '3.25rem',
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'slide-up':      'slideUp 0.5s ease-out forwards',
        'slide-in-right':'slideInRight 0.3s ease-out forwards',
        'scale-in':      'scaleIn 0.2s ease-out forwards',
        'shimmer':       'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
