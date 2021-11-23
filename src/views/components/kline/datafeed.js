/* eslint-disable */

const resolutionFormat = (resolution, name, to) => {
  name = name.toLocaleLowerCase()
  let req = `market.${name}.kline.${resolution}min`
  let minutes = resolution

  if (resolution.includes('D')) {
    if (resolution.length < 2) resolution = `1${resolution}`
    req = `market.${name}.kline.${parseInt(resolution)}day`
    minutes = parseInt(resolution) * 24 * 60
  } else if (resolution.includes('W')) {
    if (resolution.length < 2) resolution = `1${resolution}`
    req = `market.${name}.kline.${parseInt(resolution)}week`
    minutes = parseInt(resolution) * 24 * 60 * 7
  } else if (resolution.includes('M')) {
    if (resolution.length < 2) resolution = `1${resolution}`
    req = `market.${name}.kline.${parseInt(resolution)}mon`
    minutes = parseInt(resolution) * 24 * 60 * 30
  } else if (resolution / 60 > 1) {
    req = `market.${name}.kline.${resolution / 60}hour`
  }

  let from = null
  if (to) {
    from = to - 200 * minutes * 60
    if (resolution.includes('M') || resolution.includes('W')) { // 周线月线控制条数，时间超出火币规定范围, ws报错
      from = to - 50 * minutes * 60
    }
  }

  return {
    minutes,
    req,
    from,
    to,
  }
}

class DataFeeds {
  constructor(store) {
    this.store = store
    this.ws = store.ws
  }

  onReady(callback) {
    const defaultConfiguration = {
      symbols_type: [],
      supported_resolutions: ['30', '240', '1D'],
      supports_marks: true,
      supports_timescale_marks: false,
      supports_time: false,
    }

    callback(defaultConfiguration)
  }

  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
    // 赋值回调
    if (firstDataRequest) {
      this.store.to = null
      this.store.onDataCallback = onDataCallback
    }

    const to = this.store.to || rangeEndDate
    const reso = resolutionFormat(resolution, symbolInfo.name, to)
    this.store.to = reso.from

    this.store.firstDataRequest = firstDataRequest
    this.store.sub = reso.req
    this.store.ticker = symbolInfo.name

    if (this.ws) {
      const that = this
      let timer = setInterval(() => {
        try {
          if (this.ws.readyState === 1) {
            clearInterval(timer)
            timer = null
            that.ws.send(JSON.stringify({
              req: reso.req,
              id: 'id10',
              from: reso.from,
              to: reso.to,
            }))
          }
        } catch (err) {
          console.log(err)
        }
      }, 500)
    }
  }

  subscribeBars(symbolInfo, resolution, onRealTimeCallback, listenerGUID, onResetCacheNeededCallback) {
    this.store.onRealTimeCallback = onRealTimeCallback

    this.ws.send(JSON.stringify({
      sub: this.store.sub,
      id: 'id11',
    }))
  }

  unsubscribeBars() {
    this.ws.send(JSON.stringify({
      unsub: this.store.sub,
      id: 'id12',
    }))
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const newSymbol = {
      timezone: 'Asia/Shanghai',
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      session: '24x7',
      has_seconds: false,
      has_daily: true,
      has_weekly_and_monthly: true,
      has_no_volume: false,
      has_empty_bars: true,
      description: '',
      has_intraday: true,
      supported_resolutions: ['30','240', '1D'],
      pricescale: 100000000, // 价格精度
      volume_precision: 3, // 数量精度
      symbol: symbolName,
      ticker: symbolName,
      name: symbolName,
      pricescale: Math.pow(10, 4) || 8, // todo
      volume_precision: 3 || 3,
    }

    onSymbolResolvedCallback(newSymbol)
  }
}

export default DataFeeds
