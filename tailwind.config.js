/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yes: '#3fb68b',
        no: '#ff5353',
        info: '#00b2ff',
        main: 'var(--text-main)',
        secondary: 'var(--text-secondary)',
        active: 'var(--bg-active)',
      },
      borderRadius: {
        none: '0',
        xs: '.125rem',
        sm: '.25rem',
        DEFAULT: '.5rem',
        lg: '.75rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: '#666cff',
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#666cff',
          'base-100': '#2a334c',
        },
      },
    ],
  },
};
