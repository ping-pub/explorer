import fetch from 'node-fetch'
import store from '@/store'
import DefaultHandler from '@/libs/default-handler'
import { Proposal, ProposalTally, StakingPool } from './data'

const requestVersion = async (c, url) => {
  const response = await fetch(url)
  const json = await response.json()
  const sdk = json.application_version.build_deps.find(e => e.startsWith('github.com/cosmos/cosmos-sdk'))
  const re = /(\d+(\.\d+)*)/i
  const version = sdk.match(re)
  console.log(`${c} sdk version:`, version[0])
  store.commit('setup_sdk_version', { chain_name: c, version: version[0] })
  return version[0]
}

function commonProcess(res) {
  return res.result
}

const chainAPI = class ChainFetch {
  constructor(route) {
    const c = route.params.chain
    const has = Object.keys(store.state.chains.chains).findIndex(i => i === c)
    const selected = (has > -1) ? store.state.chains.chains[c] : store.state.chains.chains.cosmos
    if (selected.sdk_version === undefined) {
      const v = requestVersion(c, `${selected.api}/node_info`)
      selected.sdk_version = v
    }
    this.config = selected
    this.handler = new DefaultHandler()
  }

  async getStakingPool() {
    return this.get('/staking/pool').then(data => new StakingPool(commonProcess(data)))
  }

  async getGovernanceTally(pid, total) {
    return this.get(`/gov/proposals/${pid}/tally`).then(data => new ProposalTally(commonProcess(data), total))
  }

  async getGovernanceList() {
    return Promise.all([this.get('/gov/proposals'), this.get('/staking/pool')]).then(data => {
      const pool = new StakingPool(commonProcess(data[1]))
      const ret = []
      commonProcess(data[0]).forEach(e => {
        const g = new Proposal(e, pool.bondedToken)
        g.versionFixed(this.config.sdk_version)
        ret.push(g)
      })
      return ret
    })
  }

  async get(url) {
    const response = await fetch(this.config.api + url)
    return response.json()
  }
}

export default chainAPI
