import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F1E8',
        cream: '#FDF9F3',
        beige: '#EADFCB',
        sand: '#DCCBB0',
        ink: '#120D0B',
        charcoal: '#1C1512',
        burgundy: '#3D0A18',
        claret: '#5A0F22',
        cherry: '#C4172F',
        tangerine: '#E2571E',
        ember: '#B8451B',
        blush: '#E8B4B8',
        rose: '#C98A91',
        olive: '#3F4A2E',
        oliveSoft: '#69734F',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        label: '0.22em',
      },
      fontSize: {
        'display-sm': ['clamp(2.1rem, 5vw, 3.6rem)', { lineHeight: '0.98', letterSpacing: '-0.026em' }],
        'display-md': ['clamp(2.5rem, 6.4vw, 5.4rem)', { lineHeight: '0.94', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.9rem, 7.6vw, 7.2rem)', { lineHeight: '0.9', letterSpacing: '-0.038em' }],
      },
      transitionTimingFunction: {
        edit: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
export default config;
