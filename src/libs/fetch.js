import fetch from 'node-fetch'
import store from '@/store'
import {
  Proposal, ProposalTally, Proposer, StakingPool, Votes, Deposit,
  Validator,
} from './data'

function commonProcess(res) {
  return res.result
}

// 头像
export async function keybase(identity) {
  return fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`)
    .then(res => res.json())
}

const chainAPI = class ChainFetch {
  getSelectedConfig() {
    this.config = store.state.chains.selected
    return this.config
  }

  async getStakingPool() {
    return this.get('/staking/pool').then(data => new StakingPool().init(commonProcess(data)))
  }

  async getValidatorList() {
    return this.get('/staking/validators').then(data => commonProcess(data).map(i => new Validator().init(i)))
  }

  async getGovernanceTally(pid, total) {
    return this.get(`/gov/proposals/${pid}/tally`).then(data => new ProposalTally().init(commonProcess(data), total))
  }

  getGovernance(pid) {
    return this.get(`/gov/proposals/${pid}`).then(data => {
      const p = new Proposal().init(commonProcess(data), 0)
      p.versionFixed(this.config.sdk_version)
      return p
    })
  }

  async getGovernanceProposer(pid) {
    return this.get(`/gov/proposals/${pid}/proposer`).then(data => new Proposer().init(commonProcess(data))).catch(e => console.log(e))
  }

  async getGovernanceDeposits(pid) {
    return this.get(`/gov/proposals/${pid}/deposits`).then(data => {
      const result = commonProcess(data)
      return Array.isArray(result) ? result.reverse().map(d => new Deposit().init(d)) : result
    })
  }

  async getGovernanceVotes(pid) {
    return this.get(`/gov/proposals/${pid}/votes`).then(data => commonProcess(data).map(d => new Votes().init(d)))
  }

  async getGovernanceList() {
    return Promise.all([this.get('/gov/proposals'), this.get('/staking/pool')]).then(data => {
      const pool = new StakingPool().init(commonProcess(data[1]))
      const ret = []
      commonProcess(data[0]).forEach(e => {
        const g = new Proposal().init(e, pool.bondedToken)
        g.versionFixed(this.config.sdk_version)
        ret.push(g)
      })
      return ret
    })
  }

  async get(url) {
    this.getSelectedConfig()
    const ret = await fetch(this.config.api + url).then(response => response.json()).catch(e => console.log(e))
    return ret
  }
}

export default chainAPI
