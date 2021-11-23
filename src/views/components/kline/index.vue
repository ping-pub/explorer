<template>
  <div
    id="chart-container-id"
    class="kline-chart"
  />
</template>

<script>
/* eslint-disable */
import pako from 'pako'
import { widget, version } from './charting_library/charting_library'
import DataFeeds from './datafeed'
import { TRADINGVIEW_THEME_LIGHT, TRADINGVIEW_THEME_DARK } from './KlineTheme';

const toDouble = time => {
  if (String(time).length < 2) return `0${time}`
  return time
}

export default {
  props: {
    list: [],
  },
  data() {
    return {
      themeLocal: 'dark'
    }
  },
  mounted() {

    const store = {
      ws: new WebSocket('wss://api.huobipro.com/ws'),
      onDataCallback: null,
      onRealTimeCallback: null,
      to: null,
    }

    store.ws.onmessage = e => {
      const reader = new FileReader()

      reader.onload = e => {
        const res = JSON.parse(pako.ungzip(reader.result, { to: 'string' }))

        if (res.ping) {
          store.ws.send(JSON.stringify({ pong: new Date().getTime() }))
        }

        if (res.rep) {
          const datas = []
          for (const data of res.data) {
            datas.push({
              time: data.id * 1000,
              close: data.close,
              open: data.open,
              high: data.high,
              low: data.low,
              volume: data.amount,
            })
          }
          console.log(this.list);
          store.onDataCallback(this.list, { noData: !this.list.length })
        }

        // if (res.tick) {
        //   const data = res.tick

        //   store.onRealTimeCallback({
        //     time: data.id * 1000,
        //     volume: data.amount,
        //     close: data.close,
        //     open: data.open,
        //     high: data.high,
        //     low: data.low,
        //   })
        // }
      }

      reader.readAsArrayBuffer(e.data)
    }
    const tradingViewStyle = (this.themeLocal === 'dark' ? TRADINGVIEW_THEME_DARK : TRADINGVIEW_THEME_LIGHT);

    const tv = new widget({
      debug: false,
      symbol: 'BTCUSDT',
      timezone: 'Asia/Shanghai',
      fullscreen: false,
      autosize: false,
      interval: '5',
      width: '100%',
      height: 520,
      container_id: 'chart-container-id',
      library_path: '/charting_library/',
      locale: 'en',
      datafeed: new DataFeeds(store),
      theme: 'Dark',
      favorites: {
        intervals: ['30', '240', '1D'],
      },  
      disabled_features: [ // 禁用功能
        'volume_force_overlay',
        'left_toolbar',
        'timeframes_toolbar',
        'header_symbol_search',
        'header_compare',
        // 'header_fullscreen_button',
        'header_widget',
        // 'use_localstorage_for_settings',
        'save_chart_properties_to_local_storage',
        // 'header_chart_type',
        // 'display_market_status',
        'symbol_search_hot_key',
        'compare_symbol',
        'border_around_the_chart',
        'remove_library_container_border',
        'symbol_info',
        // 'header_interval_dialog_button',
        // 'show_interval_dialog_on_key_press',
        'volume_force_overlay',
        // 'header_resolutions',
        // 'legend_context_menu',
        // new
        'symbol_info',
        'pane_context_menu',
      ],
      enabled_features: [ // 启用的功能
        'hide_left_toolbar_by_default',
        'pane_context_menu',
        'hide_last_na_study_output',
        'dont_show_boolean_study_arguments',
      ],

      overrides: {
        'paneProperties.background': tradingViewStyle.bg,
        'symbolWatermarkProperties.transparency': 85,
        'scalesProperties.backgroundColor': '#151a1e',
        'scalesProperties.textColor': '#888',

        'paneProperties.vertGridProperties.color': tradingViewStyle.grid,
        'paneProperties.horzGridProperties.color': tradingViewStyle.grid,
        'paneProperties.crossHairProperties.color':
          tradingViewStyle.crosshair,
        'scalesProperties.lineColor': tradingViewStyle.lineColor,
        'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',

        'mainSeriesProperties.style': 1,

        //  Candles styles
        'mainSeriesProperties.candleStyle.upColor': tradingViewStyle.long,
        'mainSeriesProperties.candleStyle.downColor': tradingViewStyle.short,
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderColor': '#C400CB',
        'mainSeriesProperties.candleStyle.borderUpColor':
          tradingViewStyle.long,
        'mainSeriesProperties.candleStyle.borderDownColor':
          tradingViewStyle.short,
        'mainSeriesProperties.candleStyle.wickUpColor': tradingViewStyle.long,
        'mainSeriesProperties.candleStyle.wickDownColor':
          tradingViewStyle.short,

        'study_Overlay@tv-basicstudies.barStyle.upColor': 'blue',
        'study_Overlay@tv-basicstudies.barStyle.downColor': 'blue',

        'study_Overlay@tv-basicstudies.lineStyle.color': 'blue',

        'study_Overlay@tv-basicstudies.areaStyle.color1': 'blue',
        'study_Overlay@tv-basicstudies.areaStyle.color2': 'blue',
        'study_Overlay@tv-basicstudies.areaStyle.linecolor': 'blue',
      },
    })

    tv.onChartReady(() => {
      const chart = tv.chart()

      // 出现均线在0刻度，注意数据类型为number
      const colors = ['#e0d283', '#92c580', '#8dc1d9'];
      [5, 10, 30].forEach((time, index) => {
        // 1.15写法 1.14不同
        chart.createStudy('Moving Average', false, false, [time, 'close', 0], {
          'Plot.linewidth': 2,
          'plot.color.0': colors[index],
          precision: 2,
        })
      })
    })
  },
}
</script>

<style scoped>
</style>