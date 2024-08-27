import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import daisyuiTheme from "daisyui/src/theming/themes";

export default <Config>{
  darkMode: ['class'],
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yes: '#a0ecfd',
        no: '#ff5353',
        info: '#00b2ff',
        main: 'var(--text-main)',
        active: 'var(--bg-active)',
        'base-100': 'var(--base-100)',
				'base-200': 'var(--base-200)',
				'base-300': 'var(--base-300)',
        secondary: 'var(--text-secondary)',
      },
      fontFamily: {
        supermolot: ['Supermolot', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiTheme.light,
          primary: '#666cff',
          '--base-100': '#fff',
          '--base-200': '#e5e5e5',
          '--base-300': '#eaeaea'
        },
      },
      {
        dark: {
          ...daisyuiTheme.dark,
          primary: '#f71866',
          '--base-100': '#252528',
          '--base-200': '#252528',
          '--base-300': '#19191A'
        },
      },
    ],
  },
};
