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
    boxShadow: {
      'vector': '4px 0px 9px 0px rgba(0, 0, 0, 0.25)',  
    },
    colors: {
      vector: {
        primary: '#9cd3b8',
        bg: 'rgb(0,0,0,0.39)',
        green: 'rgb(41, 51, 48)',
        orange: '#fa7327',
        gray: 'rgba(255, 255, 255, 0.45)',
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
