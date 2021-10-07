import fetch from 'node-fetch'

export default class OsmosAPI {
  static async get(url) {
    return fetch(url)
  }

  static async getPools() {
    return OsmosAPI.get('/osmosis/gamm/v1beta1/pools')
  }
}
