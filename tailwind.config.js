/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'vector': "url('/src/assets/vector.svg')",
      },
      colors: {
      vector: {
        primary: '#9cd3b8',
        bg: 'rgb(0,0,0,0.39)',
        green: 'rgb(41, 51, 48)',
        orange: '#fa7327',
        gray: 'rgba(255, 255, 255, 0.45)',
      }
    },
    },
    boxShadow: {
      'vector': '4px 0px 9px 0px rgba(0, 0, 0, 0.25)',
    },
    
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
            'background-color': '#161616',
          },
          // ".btn":{
          //   'background-color': '#324239',
          //   'border-color': '#324239',
          // },
          ".btn-primary":{
            'background-color': '#324239',
            'border-color': '#324239',
          },
          ".btn-primary:hover":{
            'background-color': '#324239',
            'border-color': '#324239',
          },
          ".modal-box .btn-circle":{
            'background-color': '#212121',
            'border-color': '#212121',
          },
          ".modal-box w.btn-circle:hover":{
            'background-color': '#212121',
            'border-color': '#212121',
          },
          ".bg-info": {
            'background-color': '#293330',
            'border-color': '#293330',
          },
          ".modal-box": {
            'background-color': '#212121',
          },
          ".select": {
            'background-color': '#161616',
          },
          ".table-zebra tbody tr:nth-child(even) ": {
            'background-color': '#161616',
          },
          ".table tr.hover:nth-child(even):hover": {
            'background-color': '#101010',
          },
          ".text-secondary" : {
            'color': '#9cd3b8',
          },
          ".table tr.hover:hover" : {
            'background-color': '#101010',
          }
        },
      },
    ],
  },
};
