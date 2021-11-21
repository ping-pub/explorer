import fetch from 'node-fetch'
import { getLocalChains } from './data/data'

export default class OsmosAPI {
  preHandler() {
    this.version = ''
  }

  async get(url) {
    const chains = getLocalChains()
    this.host = chains.osmosis.api
    return fetch(`${this.host}${url}`).then(res => res.json())
  }

  async getOHCL4Pairs(from, to) {
    this.exe_time = ''
    const ohlc = await Promise.all(
      [fetch(`https://api.coingecko.com/api/v3/coins/${from}/ohlc?vs_currency=usd&days=7`).then(res => res.json()),
        fetch(`https://api.coingecko.com/api/v3/coins/${to}/ohlc?vs_currency=usd&days=7`).then(res => res.json())],
    )
    const output = []
    ohlc[0].forEach((e, i) => {
      console.log(e, i, ohlc[1][i])
      const price = [e[0]]
      for (let j = 1; j <= 4; j += 1) {
        price.push(e[j] / ohlc[1][i][j])
      }
      output.push(price)
    })

    return output
  }

  // Custom Module
  async getPools() {
    return this.get('/osmosis/gamm/v1beta1/pools?pagination.limit=700')
  }

  async getIncentivesPools() {
    return this.get('/osmosis/pool-incentives/v1beta1/incentivized_pools?pagination.limit=700')
  }
}
