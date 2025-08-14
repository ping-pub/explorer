/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yes: 'var(--bryanlabs-green)',
        no: '#ff5353',
        info: 'var(--bryanlabs-blue)',
        main: 'var(--bryanlabs-main-text)',
        secondary: 'var(--text-secondary)',
        active: 'var(--bg-active)',
        'bryanlabs-green': 'var(--bryanlabs-green)',
        'bryanlabs-dark': 'var(--bryanlabs-dark)',
        'bryanlabs-blue': 'var(--bryanlabs-blue)',
        'bryanlabs-black': 'var(--bryanlabs-black)',
        'bryanlabs-white': 'var(--bryanlabs-white)',
        'bryanlabs-gray': 'var(--bryanlabs-gray)',
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
          'base-200': '#252d37',
        },
      },
    ],
  },
};
