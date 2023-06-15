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
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#666cff',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#666cff',
          'base-100': '#2a334c',
          'base-200': '#252d37'
        },
      },
    ],
  },
};
