/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yes: '#3fb68b',
        no: '#ff5353',
        info: '#7a7c7d',
        main: '#7a7c7d',
        secondary: '#7a7c7d',
        active: '#7a7c7d',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#666cff',
          'base-100': '#141415',
          'base-200': '#252d37',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#666cff',
          'base-100': '#141415',
          'base-200': '#252d37',
        },
      },
    ],
  },
};
