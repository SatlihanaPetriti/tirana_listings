/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        bg:       '#07111f',
        surface:  '#0d1f35',
        card:     '#0a1929',
        border:   'rgba(100,180,255,0.10)',
        accent:   '#4fc3f7',
        accent2:  '#81d4fa',
        gold:     '#ffd54f',
        muted:    '#7eacc4',
        success:  '#69f0ae',
        danger:   '#ef9a9a',
        warn:     '#ffb74d',
      },
      backdropBlur: { xs: '4px' },
      animation: {
        'fade-up':   'fadeUp 0.4s ease both',
        'skeleton':  'skeleton 1.4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        skeleton: { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 0.9 } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.35 } },
      },
    },
  },
  plugins: [],
}
