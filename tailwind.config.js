/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tigers-eye': '#dd9933',
        'chinese-black': {
          100: '#f4f3f3',
          200: '#d7d6d6',
          300: '#b5b2b2',
          400: '#999595',
          500: '#7c7777',
          600: '#595555',
          700: '#3b3939',
          800: '#242222',
          900: '#181717',
        },
      },
      fontFamily: {
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
