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
import { formatTokenDenom, getLocalChains } from './data/data'

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
  557: true,
  558: true,
  571: true,
  572: true,
}

export function getPairName(pool, denomTrace, type = 'base') {
  const index = type === 'base' ? 0 : 1
  if (pool && pool.poolAssets) {
    if (pool.poolAssets[index].token.denom.startsWith('ibc')) {
      return formatTokenDenom(denomTrace[pool.poolAssets[index].token.denom]?.base_denom) || '-'
    }
    return formatTokenDenom(pool.poolAssets[index].token.denom)
  }
  return '-'
}

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
    return this.get('/ibc/applications/transfer/v1beta1/denom_traces?pagination.limit=300').then(x => {
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
