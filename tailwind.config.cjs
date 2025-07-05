/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f6f6',
          100: '#e0e0e0',
          200: '#c7c7c7',
          300: '#a0a0a0',
          400: '#7a7a7a',
          500: '#545454',
          600: '#3f3f3f',
          700: '#2d2d2d',
          800: '#1e1e1e',
          900: '#111111',
        },
        eggshell: {
          100: '#fffbea',
          200: '#fff7d6',
          300: '#fff3c2',
        },
        accent: {
          500: '#facc15', // bright amber for highlights
          600: '#eab308',
          700: '#ca8a04',
        },
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.2' }],
        'sm': ['0.9375rem', { lineHeight: '1.25' }],
        'base': ['1.125rem', { lineHeight: '1.35' }],
        'lg': ['1.375rem', { lineHeight: '1.4' }],
        'xl': ['1.625rem', { lineHeight: '1.45' }],
        '2xl': ['2rem', { lineHeight: '1.2' }],
        '3xl': ['2.5rem', { lineHeight: '1.2' }],
      },
      spacing: {
        '2': '0.5rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}; 