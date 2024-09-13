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
        "primary": "#FF97D6",
        "secondary": "#F8B994",
        "accent": "#FF97D6",
        "neutral": "#2b3440",
        "base-100": "#ffffff",
        "info": "#3abff8",
        "success": "#31B47A",
        "warning": "#fbbd23",
        "error": "#FB5050",
        //'base-100': "#323029"

      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          "primary": "#FF97D6",
          "secondary": "#F8B994",
          "accent": "#FF97D6",
          "neutral": "#2b3440",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#31B47A",
          "warning": "#fbbd23",
          "error": "#FB5050",
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          "primary": "#FF97D6",
          "secondary": "#F8B994",
          "accent": "#FF97D6",
          "neutral": "#2b3440",
          //"base-100": "#000000",
          "info": "#3abff8",
          "success": "#31B47A",
          "warning": "#fbbd23",
          "error": "#FB5050",
          'base-100': '#2a334c',
          'base-200': '#252d37'
        },
      },
    ],
  },
};
