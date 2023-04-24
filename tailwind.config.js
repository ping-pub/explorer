/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#5973fe',
        yes: '#3fb68b',
        no: '#ff5353',
        info: '#00ddc6',
      },
    },
  },
  plugins: [],
}

