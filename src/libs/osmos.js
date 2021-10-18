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

  // Custom Module
  async getPools() {
    return this.get('/osmosis/gamm/v1beta1/pools?pagination.limit=700')
  }

  async getIncentivesPools() {
    return this.get('/osmosis/pool-incentives/v1beta1/incentivized_pools?pagination.limit=700')
  }
}
