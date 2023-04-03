import type { VuetifyOptions } from 'vuetify'
import { resolveVuetifyTheme } from './@core/utils/vuetify'
import { themeConfig } from '@themeConfig'

export const staticPrimaryColor = '#666CFF'

const theme: VuetifyOptions['theme'] = {
  defaultTheme: resolveVuetifyTheme(),
  themes: {
    light: {
      dark: false,
      colors: {
        'primary': localStorage.getItem(`${themeConfig.app.title}-lightThemePrimaryColor`) || staticPrimaryColor,
        'on-primary': '#fff',
        'secondary': '#6D788D',
        'on-secondary': '#fff',
        'success': '#72E128',
        'on-success': '#fff',
        'info': '#26C6F9',
        'on-info': '#fff',
        'warning': '#FDB528',
        'on-warning': '#fff',
        'error': '#FF4D49',
        'background': '#F7F7F9',
        'on-background': '#4c4e64',
        'on-surface': '#4c4e64',
        'perfect-scrollbar-thumb': '#DBDADE',
        'snackbar-background': '#212121',
        'tooltip-background': '#262732',
        'alert-background': '#F7F7F9',
        'grey-50': '#FAFAFA',
        'grey-100': '#F4F5FA',
        'grey-200': '#F5F5F7',
        'grey-300': '#E0E0E0',
        'grey-400': '#BDBDBD',
        'grey-500': '#9E9E9E',
        'grey-600': '#757575',
        'grey-700': '#616161',
        'grey-800': '#424242',
        'grey-900': '#212121',
      },

      variables: {
        'code-color': '#d400ff',
        'border-color': '#4c4e64',
        'hover-opacity': 0.05,
        'overlay-scrim-background': '#4C4E64',
        'overlay-scrim-opacity': 0.5,

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(var(--v-theme-on-surface), 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-theme-on-surface), 0.05)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-theme-on-surface), 0.03)',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': localStorage.getItem(`${themeConfig.app.title}-darkThemePrimaryColor`) || staticPrimaryColor,
        'on-primary': '#fff',
        'secondary': '#6D788D',
        'on-secondary': '#fff',
        'success': '#72E128',
        'on-success': '#fff',
        'info': '#26C6F9',
        'on-info': '#fff',
        'warning': '#FDB528',
        'on-warning': '#fff',
        'error': '#FF4D49',
        'background': '#282A42',
        'on-background': '#eaeaff',
        'surface': '#30334E',
        'on-surface': '#eaeaff',
        'perfect-scrollbar-thumb': '#4A5072',
        'snackbar-background': '#F5F5F5',
        'on-snackbar-background': '#30334E',
        'tooltip-background': '#464A65',
        'alert-background': '#282A42',
        'grey-50': '#2A2E42',
        'grey-100': '#41435c',
        'grey-200': '#3A3E5B',
        'grey-300': '#5E6692',
        'grey-400': '#7983BB',
        'grey-500': '#8692D0',
        'grey-600': '#AAB3DE',
        'grey-700': '#B6BEE3',
        'grey-800': '#CFD3EC',
        'grey-900': '#E7E9F6',
      },
      variables: {
        'code-color': '#d400ff',
        'border-color': '#eaeaff',
        'hover-opacity': 0.05,
        'overlay-scrim-background': '#101121',
        'overlay-scrim-opacity': 0.6,

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(20, 21, 33, 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(20, 21, 33, 0.05)',
        'shadow-key-ambient-opacity': 'rgba(20, 21, 33, 0.03)',
      },
    },
  },
}

export default theme
