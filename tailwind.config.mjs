/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void:            'var(--void)',
        midnight:        'var(--midnight)',
        surface:         'var(--surface)',
        elevated:        'var(--elevated)',
        'accent-primary':'var(--accent)',
        'accent-hover':  'var(--accent-hover)',
        'accent-dim':    'var(--accent-dim)',
        'accent-success':'var(--accent-success)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        'text-dim':      'var(--text-dim)',
      },

      fontFamily: {
        heading: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        'display': ['clamp(2.5rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'heading-1': ['clamp(1.75rem, 4.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-2': ['clamp(1.25rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'heading-3': ['clamp(1rem, 2vw, 1.375rem)', { lineHeight: '1.3', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },

      spacing: { 'section': 'clamp(4rem, 12vh, 10rem)', '18': '4.5rem', '128': '32rem' },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },

      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'float-slow': 'float 10s ease-in-out 4s infinite',
        'float-reverse': 'floatReverse 7s ease-in-out 1s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },

      keyframes: {
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
        floatReverse: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(15px)' } },
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:       { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:      { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        glowPulse:    { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },

      zIndex: { 'behind': '-1', 'base': '0', 'content': '10', 'header': '50', 'overlay': '60', 'popup': '70', 'modal': '80', 'cursor': '100' },
      screens: { 'xs': '475px', '3xl': '1920px' },
    },
  },
  plugins: [],
};