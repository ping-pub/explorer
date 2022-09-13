/*
 * @Description: file
 * @Autor: dingyiming
 * @Date: 2021-11-22 21:20:10
 * @LastEditors: dingyiming
 * @LastEditTime: 2021-11-25 00:45:16
 */
import { sha256 } from '@cosmjs/crypto'
import { toHex } from '@cosmjs/encoding'
import fetch from 'node-fetch'
import { formatTokenDenom, getLocalChains } from './utils'

export const poolIds = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  10: true,
  13: true,
  15: true,
  461: true,
  482: true,
  497: true,
  498: true,
  548: true,
  // 557: true,
  // 558: true,
  // 571: true,
  // 572: true,
}

export const CoinGeckoMap = {
  ATOM: ['cosmos'],
  OSMO: ['osmosis'],
  IRIS: ['iris-network'],
  AKT: ['akash-network'],
  LUNA: ['terra-luna'],
  UST: ['terrausd'],
  KRT: ['terra-krw'],
  BAND: ['band-protocol'],
  CRO: ['crypto-com-chain'],
  KAVA: ['kava'],
  OKT: ['okexchain'],
  CTK: ['certik'],
  XPRT: ['persistence'],
  REGEN: ['regen'],
  SCRT: ['secret'],
  DVPN: ['sentinel'],
  ION: ['ion'],
  ROWAN: ['sifchain'],
  IOV: ['starname'],
  BTSG: ['bitsong'],
  NGM: ['e-money'],
  EEUR: ['e-money-eur'],
  LIKE: ['likecoin'],
  JUNO: ['juno-network'],
  STGZ: ['stargaze-protocol'],
  VDL: ['vidulum'],
  XKI: ['ki'],
  INJ: ['injective-protocol'],
  POINT: ['point-network'],
}

export function getChainConfigForSymbol(symbol) {
  const key = CoinGeckoMap[symbol]
  if (key) {
    const confs = getLocalChains()
    return Object.values(confs).find(x => x.coingecko === key[0])
  }
  return null
}

export function getPairName(pool, denomTrace, type = 'base', isFormat = true) {
  const index = type === 'base' ? 0 : 1
  if (pool && pool.poolAssets) {
    const denom = pool.poolAssets[index].token.denom.startsWith('ibc')
      ? denomTrace[pool.poolAssets[index].token.denom]?.base_denom : pool.poolAssets[index].token.denom
    return isFormat ? formatTokenDenom(denom) : denom
  }
  return '-'
}

export default class OsmosAPI {
  preHandler() {
    this.version = ''
  }

  async get(url) {
    const chains = getLocalChains()
    const conf = chains.osmosis
    const index = this.getApiIndex(conf)
    this.host = Array.isArray(conf.api) ? conf.api[index] : conf.api
    return fetch(`${this.host}${url}`).then(res => res.json())
  }

  getApiIndex(config = null) {
    const conf = config || this.config
    const index = Number(localStorage.getItem(`${conf.chain_name}-api-index`) || 0)
    return index < conf.api.length ? index : 0
  }

  async getMarketData(from, to, days = 14) {
    if (from && to) {
      this.exe_time = ''
      return Promise.all(
        [fetch(`https://api.coingecko.com/api/v3/coins/${from}/market_chart?vs_currency=usd&days=${days}`).then(res => res.json()),
          fetch(`https://api.coingecko.com/api/v3/coins/${to}/market_chart?vs_currency=usd&days=${days}`).then(res => res.json())],
      ).then(data => {
        const output = []
        if (data.length >= 2) {
          data[0].prices.forEach((x, i) => {
            if (data[1].prices[i]) {
              output.push([x[0], (x[1] / data[1].prices[i][1]).toFixed(6)])
            }
          })
        }
        return { prices: output }
      })
    }
    return { prices: [] }
  }

  async getOHCL4Pairs(from, to) {
    if (from && to) {
      this.exe_time = ''
      return Promise.all(
        [fetch(`https://api.coingecko.com/api/v3/coins/${from}/ohlc?vs_currency=usd&days=1`).then(res => res.json()),
          fetch(`https://api.coingecko.com/api/v3/coins/${to}/ohlc?vs_currency=usd&days=1`).then(res => res.json())],
      ).then(ohlc => {
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
          result.push([
            itemArr[0],
            itemArr[1], // open
            itemArr[2], // high
            itemArr[3], // low
            itemArr[4], // close
            0, // volume
          ])
        }
        return result
      })
    }
    return null
  }

  // Custom Module
  async getPools() {
    const tradeable = []
    Object.keys(poolIds).forEach(k => {
      if (poolIds[k]) {
        tradeable.push(k)
      }
    })
    return this.get('/osmosis/gamm/v1beta1/pools?pagination.limit=700').then(res => {
      const output = res.pools.filter(x => tradeable.includes(x.id))
      return output
    })
  }

  async getDenomTraces() {
    return this.get('/ibc/apps/transfer/v1/denom_traces?pagination.limit=500').then(x => {
      const combined = {}
      x.denom_traces.forEach(item => {
        const k = 'ibc/'.concat(toHex(sha256(new TextEncoder('utf-8').encode(`${item.path}/${item.base_denom}`))).toUpperCase())
        combined[k] = item
      })
      return combined
    })
  }

  async getIncentivesPools() {
    return this.get('/osmosis/pool-incentives/v1beta1/incentivized_pools?pagination.limit=700')
  }
}
