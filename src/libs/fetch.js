import fetch from 'node-fetch'
// import axios from 'axios'
import store from '@/store'
import compareVersions from 'compare-versions'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { toBase64 } from '@cosmjs/encoding'
import {
  Proposal, ProposalTally, Proposer, StakingPool, Votes, Deposit,
  Validator, StakingParameters, Block, ValidatorDistribution, StakingDelegation, WrapStdTx,
} from './data'

function commonProcess(res) {
  if (res && Object.keys(res).includes('result')) {
    return res.result
  }
  return res
}

// 头像
export function keybase(identity) {
  return fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`)
    .then(res => res.json())
}

const chainAPI = class ChainFetch {
  getSelectedConfig() {
    let chain = store.state.chains.selected
    const lschains = localStorage.getItem('chains')
    if (lschains) {
      chain = JSON.parse(lschains)[chain.chain_name]
    }
    if (!chain.sdk_version) {
      chain.sdk_version = '0.33'
    }
    this.config = chain
    return this.config
  }

  isModuleLoaded(name) {
    if (this.config.unload_module) {
      return !this.config.unload_module.includes(name)
    }
    return true
  }

  async getLatestBlock(config = null) {
    return this.get('/blocks/latest', config).then(data => Block.create(data))
  }

  async getBlockByHeight(height) {
    return this.get(`/blocks/${height}`).then(data => Block.create(data))
  }

  async getTxs(hash) {
    const ver = this.getSelectedConfig() ? this.config.sdk_version : '0.41'
    // /cosmos/tx/v1beta1/txs/{hash}
    if (ver && compareVersions(ver, '0.40') < 1) {
      return this.get(`/txs/${hash}`).then(data => WrapStdTx.create(data, ver))
    }
    return this.get(`/cosmos/tx/v1beta1/txs/${hash}`).then(data => WrapStdTx.create(data, ver))
  }

  async getValidatorDistribution(address) {
    return this.get(`/distribution/validators/${address}`).then(data => {
      const ret = ValidatorDistribution.create(commonProcess(data))
      ret.versionFixed(this.config.sdk_version)
      return ret
    })
  }

  async getStakingDelegatorDelegation(delegatorAddr, validatorAddr) {
    return this.get(`/staking/delegators/${delegatorAddr}/delegations/${validatorAddr}`).then(data => StakingDelegation.create(commonProcess(data)))
  }

  async getBankTotal(denom) {
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get(`/supply/total/${denom}`).then(data => ({ amount: commonProcess(data), denom }))
    }
    return this.get(`/bank/total/${denom}`).then(data => commonProcess(data))
  }

  async getBankTotals() {
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get('/supply/total').then(data => commonProcess(data))
    }
    return this.get('/cosmos/bank/v1beta1/supply').then(data => data.supply)
  }

  async getStakingPool() {
    return this.get('/staking/pool').then(data => new StakingPool().init(commonProcess(data)))
  }

  async getMintingInflation() {
    if (this.isModuleLoaded('minting')) {
      return this.get('/minting/inflation').then(data => Number(commonProcess(data)))
    }
    return null
  }

  async getStakingParameters() {
    return this.get('/staking/parameters').then(data => {
      this.getSelectedConfig()
      return StakingParameters.create(commonProcess(data), this.config.chain_name)
    })
  }

  async getValidatorList() {
    return this.get('/staking/validators').then(data => {
      const vals = commonProcess(data).map(i => new Validator().init(i))
      localStorage.setItem(`validators-${this.config.chain_name}`, JSON.stringify(vals))
      return vals
    })
  }

  async getStakingValidator(address) {
    return this.get(`/staking/validators/${address}`).then(data => new Validator().init(commonProcess(data)))
  }

  async getSlashingParameters() {
    if (this.isModuleLoaded('slashing')) {
      return this.get('/slashing/parameters').then(data => commonProcess(data))
    }
    return null
  }

  async getMintParameters() {
    if (this.isModuleLoaded('minting')) {
      return this.get('/minting/parameters').then(data => commonProcess(data))
    }
    return null
  }

  async getDistributionParameters() {
    return this.get('/distribution/parameters').then(data => commonProcess(data))
  }

  async getGovernanceParameterDeposit() {
    return this.get('/gov/parameters/deposit').then(data => commonProcess(data))
  }

  async getGovernanceParameterTallying() {
    return this.get('/gov/parameters/tallying').then(data => commonProcess(data))
  }

  async getGovernanceParameterVoting() {
    return this.get('/gov/parameters/voting').then(data => commonProcess(data))
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
    return this.get(`/gov/proposals/${pid}/proposer`).then(data => new Proposer().init(commonProcess(data)))
  }

  async getGovernanceDeposits(pid) {
    return this.get(`/gov/proposals/${pid}/deposits`).then(data => {
      const result = commonProcess(data)
      return Array.isArray(result) ? result.reverse().map(d => new Deposit().init(d)) : result
    })
  }

  async getGovernanceVotes(pid, next = '', limit = 50) {
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get(`/gov/proposals/${pid}/votes`).then(data => ({
        votes: commonProcess(data).map(d => new Votes().init(d)),
        pagination: {},
      }))
    }
    return this.get(`/cosmos/gov/v1beta1/proposals/${pid}/votes?pagination.key=${encodeURIComponent(next)}&pagination.limit=${limit}`)
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

  async get(url, config = null) {
    if (!config) {
      this.getSelectedConfig()
    }
    const ret = await fetch((config ? config.api : this.config.api) + url).then(response => response.json())
    return ret
  }

  static fetch(host, url) {
    const ret = fetch(host + url).then(response => response.json())
    return ret
  }

  async getAuthAccount(address, config = null) {
    return this.get('/auth/accounts/'.concat(address), config).then(data => commonProcess(data))
  }

  async getBankAccountBalance(address) {
    return this.get('/bank/balances/'.concat(address)).then(data => commonProcess(data))
  }

  async getStakingReward(address) {
    return this.get(`/cosmos/distribution/v1beta1/delegators/${address}/rewards`).then(data => commonProcess(data))
  }

  async getStakingValidators(address) {
    return this.get(`/cosmos/distribution/v1beta1/delegators/${address}/validators`).then(data => commonProcess(data))
  }

  async getStakingDelegations(address, config = null) {
    return this.get(`/cosmos/staking/v1beta1/delegations/${address}`, config).then(data => commonProcess(data))
  }

  async getStakingRedelegations(address, config = null) {
    return this.get(`/cosmos/staking/v1beta1/delegators/${address}/redelegations`, config).then(data => commonProcess(data))
  }

  async getStakingUnbonding(address) {
    return this.get(`/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`).then(data => commonProcess(data))
  }
  // /cosmos/staking/v1beta1/delegations/{delegator_addr}

  static async getBankBalance(baseurl, address) {
    return ChainFetch.fetch(baseurl, '/bank/balances/'.concat(address)).then(data => commonProcess(data))
  }

  static async getIBCDenomTrace(baseurl, hash) {
    const h = hash.substring(hash.indexOf('/'))
    return ChainFetch.fetch(baseurl, '/ibc/applications/transfer/v1beta1/denom_traces/'.concat(h)).then(data => commonProcess(data))
  }

  static async getIBCDenomTraceText(baseurl, hash) {
    return ChainFetch.getIBCDenomTrace(baseurl, hash).then(res => res.denom_trace.base_denom)
  }

  // CoinMarketCap
  static async fetchCoinMarketCap(url) {
    const host = 'https://price.ping.pub'
    return fetch(host + url).then(response => response.json())
  }

  static async fetchTokenQuote(symbol) {
    return ChainFetch.fetchCoinMarketCap(`/quote/${symbol}`)
  }

  async broadcastTx(bodyBytes, config = null) {
    const txString = toBase64(TxRaw.encode(bodyBytes).finish())
    const txRaw = {
      tx_bytes: txString,
      mode: 'BROADCAST_MODE_SYNC',
    }
    return this.post('/cosmos/tx/v1beta1/txs', txRaw, config)
  }

  async post(url = '', data = {}, config = null) {
    if (!config) {
      this.getSelectedConfig()
    }
    // Default options are marked with *
    const response = await fetch((config ? config.api : this.config.api) + url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // credentials: 'same-origin', // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      headers: {
        'Content-Type': 'text/plain',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    // const response = axios.post((config ? config.api : this.config.api) + url, data)
    return response.json() // parses JSON response into native JavaScript objects
  }
}

export default chainAPI
