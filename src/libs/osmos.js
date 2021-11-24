/*
 * @Description: file
 * @Autor: dingyiming
 * @Date: 2021-11-22 21:20:10
 * @LastEditors: dingyiming
 * @LastEditTime: 2021-11-23 11:19:51
 */
import fetch from 'node-fetch'
import { getLocalChains } from './data/data'

export default class OsmosAPI {
  constructor() {
    this.pairs = {
      ATOM: { coingecko: 'cosmos', minDenom: 'uatom', ibcDenomHash: 'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4' },
      OSMO: { coingecko: 'osmosis', minDenom: 'uosmo', ibcDenomHash: 'uosmo' },
      IRIS: { coingecko: 'iris-network', minDenom: 'uiris', ibcDenomHash: 'ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0' },
      AKT: { coingecko: 'akash-network', minDenom: 'uakt', ibcDenomHash: 'ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0' },
    }
  }

  preHandler() {
    this.version = ''
  }

  async get(url) {
    const chains = getLocalChains()
    this.host = chains.osmosis.api
    return fetch(`${this.host}${url}`).then(res => res.json())
  }

  async getOHCL4Pairs(from, to) {
    if (from && to) {
      this.exe_time = ''
      return Promise.all(
        [fetch(`https://api.coingecko.com/api/v3/coins/${from}/ohlc?vs_currency=usd&days=1`).then(res => res.json()),
          fetch(`https://api.coingecko.com/api/v3/coins/${to}/ohlc?vs_currency=usd&days=1`).then(res => res.json())],
      ).then(ohlc => {
        console.log(ohlc)
        const output = []
        ohlc[0].forEach((e, i) => {
          const price = [e[0]]
          for (let j = 1; j <= 4; j += 1) {
            price.push(e[j] / ohlc?.[1]?.[i]?.[j])
          }
          output.push(price)
        })
        const result = []
        for (let i = 0; i < output.length; i += 1) {
          const itemArr = output[i]
          result.push({
            time: itemArr[0],
            volume: 0,
            open: itemArr[1],
            high: itemArr[2],
            low: itemArr[3],
            close: itemArr[4],
          })
        }
        return result
      })
    }
    return null
  }

  getCoinGeckoId(symbol) {
    return symbol ? this.pairs[symbol.toUpperCase()].coingecko : ''
  }

  getIBCDenomHash(symbol) {
    return symbol ? this.pairs[symbol.toUpperCase()].ibcDenomHash : ''
  }

  getMinDenom(symbol) {
    return symbol ? this.pairs[symbol.toUpperCase()].minDenom : ''
  }

  // Custom Module
  async getPools() {
    return this.get('/osmosis/gamm/v1beta1/pools?pagination.limit=700')
  }

  async getIncentivesPools() {
    return this.get('/osmosis/pool-incentives/v1beta1/incentivized_pools?pagination.limit=700')
  }
}
