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
        primary: '#666cff',
        main: 'var(--text-main)',
        secondary: 'var(--text-secondary)',
        card: 'var(--bg-card)',
        hover: 'var(--bg-hover)',
        active: 'var(--bg-active)',
      },
    },
  },
  plugins: [],
};
