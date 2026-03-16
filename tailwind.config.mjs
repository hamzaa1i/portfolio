/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          void: '#030305',
          midnight: '#0a0a12',
          surface: '#111118',
          'accent-cyan': '#00f0ff',
          'accent-purple': '#bf00ff',
          'accent-blue': '#3b82f6',
          'text-primary': '#ffffff',
          'text-secondary': '#71717a',
          'text-muted': '#52525b',
        },
  
        fontFamily: {
          heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
          body: ['"Inter"', 'system-ui', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        },
  
        fontSize: {
          'display': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
          'heading-1': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
          'heading-2': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
          'heading-3': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '500' }],
          'body-lg': ['1.125rem', { lineHeight: '1.7' }],
          'body': ['1rem', { lineHeight: '1.7' }],
          'body-sm': ['0.875rem', { lineHeight: '1.6' }],
          'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        },
  
        spacing: {
          'section': 'clamp(4rem, 10vh, 8rem)',
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
  
        borderRadius: {
          '2xl': '1rem',
          '3xl': '1.5rem',
          '4xl': '2rem',
        },
  
        backdropBlur: {
          xs: '2px',
          '2xl': '40px',
          '3xl': '64px',
        },
  
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float 8s ease-in-out 2s infinite',
          'float-slow': 'float 10s ease-in-out 4s infinite',
          'float-reverse': 'floatReverse 7s ease-in-out 1s infinite',
          'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
          'pulse-glow-delayed': 'pulseGlow 4s ease-in-out 2s infinite',
          'blink': 'blink 1s step-end infinite',
          'orb-1': 'orbMove1 20s ease-in-out infinite',
          'orb-2': 'orbMove2 25s ease-in-out infinite',
          'orb-3': 'orbMove3 30s ease-in-out infinite',
          'spin-slow': 'spin 20s linear infinite',
          'scroll-hint': 'scrollHint 2s ease-in-out infinite',
        },
  
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          floatReverse: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(20px)' },
          },
          pulseGlow: {
            '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
            '50%': { opacity: '0.7', transform: 'scale(1.05)' },
          },
          blink: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' },
          },
          orbMove1: {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '25%': { transform: 'translate(100px, -50px) scale(1.1)' },
            '50%': { transform: 'translate(-50px, 100px) scale(0.9)' },
            '75%': { transform: 'translate(-100px, -100px) scale(1.05)' },
          },
          orbMove2: {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '25%': { transform: 'translate(-80px, 80px) scale(1.15)' },
            '50%': { transform: 'translate(120px, -30px) scale(0.95)' },
            '75%': { transform: 'translate(50px, 120px) scale(1.1)' },
          },
          orbMove3: {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '25%': { transform: 'translate(60px, 100px) scale(0.9)' },
            '50%': { transform: 'translate(-100px, -60px) scale(1.1)' },
            '75%': { transform: 'translate(80px, -80px) scale(1.05)' },
          },
          scrollHint: {
            '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
            '50%': { transform: 'translateY(12px)', opacity: '1' },
          },
        },
  
        transitionTimingFunction: {
          'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
          'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
          'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
        },
  
        transitionDuration: {
          '400': '400ms',
          '600': '600ms',
          '800': '800ms',
          '1200': '1200ms',
        },
  
        zIndex: {
          'behind': '-1',
          'base': '0',
          'content': '10',
          'header': '50',
          'overlay': '60',
          'lightbox': '70',
          'cursor': '100',
        },
  
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'gradient-mesh': 'linear-gradient(135deg, #030305 0%, #0a0a12 50%, #111118 100%)',
        },
  
        screens: {
          'xs': '475px',
          '3xl': '1920px',
        },
      },
    },
    plugins: [],
  };