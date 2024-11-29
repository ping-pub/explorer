/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9cd3b8',
        bg: '#293330',
        orange: '#fa7327',
      }
    },
    colors: {
      vector: {
        primary: '#9cd3b8',
        bg: '#293330',
        orange: '#fa7327',
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
     themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "blue",
          secondary: "teal",
          ".input":{
            'background-color': '#293330',
          }
        },
      },
    ],
  },
};
