/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#f5f0e6',
          1: '#efe5d1',
          2: '#d8cfbd',
          3: '#ff9f1c',
          4: '#e54b2b',
          5: '#111111',
        },
        border: {
          subtle: '#8c8377',
          soft: '#423c35',
          muted: '#111111',
          strong: '#111111',
        },
        accent: {
          red: '#e54b2b',
          redBright: '#ff9f1c',
          redMuted: '#ffd84d',
          redGlow: '#efe5d1',
          redBorder: '#111111',
        },
        text: {
          primary: '#111111',
          secondary: '#423c35',
          tertiary: '#6d665c',
          inverse: '#f5f0e6',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'subtle-glow': 'subtleGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        subtleGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 30px rgba(196,69,105,0.20)',
        'glow-red-sm': '0 0 15px rgba(196,69,105,0.12)',
        'card': '0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset',
        'card-hover': '0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
        'neo': '0 8px 16px rgba(0,0,0,0.4)',
      },
      spacing: {
        'gutter': '1rem',
      },
    },
  },
  plugins: [],
}
