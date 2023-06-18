import { useBlockchain } from '@/stores';
import numeral from 'numeral';

const chainStore = useBlockchain()

const themeColors = (theme: string) => {
  if (theme === 'light') {
    return {
      dark: false,
      colors: {
        background: '#F7F7F9',
        surface: '#FFFFFF',
        'surface-variant': '#424242',
        'on-surface-variant': '#EEEEEE',
        primary: chainStore.current?.themeColor || '#666CFF',
        'primary-darken-1': '#3700B3',
        secondary: '#6D788D',
        'secondary-darken-1': '#018786',
        error: '#FF4D49',
        info: '#26C6F9',
        success: '#72E128',
        warning: '#FDB528',
        'on-primary': '#fff',
        'on-secondary': '#fff',
        'on-success': '#fff',
        'on-info': '#fff',
        'on-warning': '#fff',
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
        'on-primary-darken-1': '#fff',
        'on-secondary-darken-1': '#fff',
        'on-error': '#fff',
        'on-perfect-scrollbar-thumb': '#000',
        'on-snackbar-background': '#fff',
        'on-tooltip-background': '#fff',
        'on-alert-background': '#000',
        'on-grey-50': '#000',
        'on-grey-100': '#000',
        'on-grey-200': '#000',
        'on-grey-300': '#000',
        'on-grey-400': '#000',
        'on-grey-500': '#fff',
        'on-grey-600': '#fff',
        'on-grey-700': '#fff',
        'on-grey-800': '#fff',
        'on-grey-900': '#fff',
      },
      variables: {
        'border-color': '#4c4e64',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.6,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.05,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
        'code-color': '#d400ff',
        'overlay-scrim-background': '#4C4E64',
        'overlay-scrim-opacity': 0.5,
        'shadow-key-umbra-opacity': 'rgba(var(--v-theme-on-surface), 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-theme-on-surface), 0.05)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-theme-on-surface), 0.03)',
      },
    };
  }
  return {
    dark: true,
    colors: {
      background: '#282A42',
      surface: '#30334E',
      'surface-variant': '#BDBDBD',
      'on-surface-variant': '#424242',
      primary: chainStore.current?.themeColor || '#666CFF',
      'primary-darken-1': '#3700B3',
      secondary: '#6D788D',
      'secondary-darken-1': '#03DAC5',
      error: '#FF4D49',
      info: '#26C6F9',
      success: '#72E128',
      warning: '#FDB528',
      'on-primary': '#fff',
      'on-secondary': '#fff',
      'on-success': '#fff',
      'on-info': '#fff',
      'on-warning': '#fff',
      'on-background': '#eaeaff',
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
      'on-primary-darken-1': '#fff',
      'on-secondary-darken-1': '#000',
      'on-error': '#fff',
      'on-perfect-scrollbar-thumb': '#fff',
      'on-tooltip-background': '#fff',
      'on-alert-background': '#fff',
      'on-grey-50': '#fff',
      'on-grey-100': '#fff',
      'on-grey-200': '#fff',
      'on-grey-300': '#fff',
      'on-grey-400': '#fff',
      'on-grey-500': '#fff',
      'on-grey-600': '#000',
      'on-grey-700': '#000',
      'on-grey-800': '#000',
      'on-grey-900': '#000',
    },
    variables: {
      'border-color': '#eaeaff',
      'border-opacity': 0.12,
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.6,
      'disabled-opacity': 0.38,
      'idle-opacity': 0.1,
      'hover-opacity': 0.05,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.16,
      'dragged-opacity': 0.08,
      'theme-kbd': '#212529',
      'theme-on-kbd': '#FFFFFF',
      'theme-code': '#343434',
      'theme-on-code': '#CCCCCC',
      'code-color': '#d400ff',
      'overlay-scrim-background': '#101121',
      'overlay-scrim-opacity': 0.6,
      'shadow-key-umbra-opacity': 'rgba(20, 21, 33, 0.08)',
      'shadow-key-penumbra-opacity': 'rgba(20, 21, 33, 0.05)',
      'shadow-key-ambient-opacity': 'rgba(20, 21, 33, 0.03)',
    },
  };
};
// 👉 Colors variables
export const colorVariables = (theme: string) => {
  if (theme === 'light') {
    return {
      themeSecondaryTextColor: 'rgba(76,78,100,0.6)',
      themeDisabledTextColor: 'rgba(76,78,100,0.38)',
      themeBorderColor: 'rgba(76,78,100,0.12)',
      themePrimaryTextColor: 'rgba(76,78,100,0.87)',
    };
  }
  return {
    themeSecondaryTextColor: 'rgba(234,234,255,0.6)',
    themeDisabledTextColor: 'rgba(234,234,255,0.38)',
    themeBorderColor: 'rgba(234,234,255,0.12)',
    themePrimaryTextColor: 'rgba(234,234,255,0.87)',
  };
};
/// Price Chart config
export const getMarketPriceChartConfig = (
  theme: string,
  categories: string[]
) => {
  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } =
    colorVariables(theme);

  return {
    chart: {
      redrawOnParentResize: true,
      width: '100%',
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: {
      theme: 'dark',
      shared: false,
    },
    dataLabels: { enabled: false },
    stroke: {
      // show: false,
      curve: 'smooth',
      width: 1.5,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',

      labels: { colors: themeSecondaryTextColor },
      markers: {
        offsetY: 1,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },

    colors: [themeColors(theme).colors.primary],
    fill: {
      opacity: 0.5,
      type: 'gradient',
    },
    grid: {
      show: true,
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
        formatter: function (value: string) {
          const pattern = Number(value) > 0.01 ? '0.0[0]a' : '0.00[000]';
          return numeral(value).format(pattern);
        },
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: { show: false },

      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor },
      },
      categories,
    },
  };
};

// const donutColors = Array.from({length: 19}, () => (`#${Math.floor(Math.random()*16777215+100000).toString(16)}`))
const donutColors = ["#bbe81a", "#ff5f0b", "#43ebef", "#1999e5", "#230b2c", "#628be8", "#aa5343", "#c9fa89", "#e88ea8", "#72e4a2", "#38cd87", "#515e13", "#7bf8f5", "#83dd6e", "#e8b203", "#7d11d5", "#3e4927", "#f303e2", "#249493", "#50e5e6", "#11deb2", "#a2f9c7", "#2a7bdc", "#47383a", "#226da4", "#966319", "#1bdf99", "#f3ab0c", "#961f50", "#832efd", "#875287", "#4bebe7", "#1d3d2e", "#9caea4", "#2772f5", "#938bf1", "#6228a5", "#24fea5", "#c9bbc8", "#e27225", "#54bd9f", "#babb2d", "#bcf591", "#803b36", "#124f03"]


export const getDonutChartConfig = (
  theme: string,
  labels: string[]
) => {

  const { themeSecondaryTextColor, themePrimaryTextColor } =
    colorVariables(theme);

  return {
    stroke: { width: 0 },
    labels,
    colors: donutColors,
    // colors: [
    //   donutColors.series1,
    //   donutColors.series5,
    //   donutColors.series3,
    //   donutColors.series2,
    // ],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: themeSecondaryTextColor,
              formatter: (val: string) => `${parseInt(val, 10)}`,
            },
            total: {
              show: false,
              fontSize: '1.5rem',
              // label: 'Operational',
              // formatter: () => '31%',
              color: themePrimaryTextColor,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  };
};

