import fetch from 'node-fetch'
// import axios from 'axios'
import store from '@/store'
import compareVersions from 'compare-versions'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { fromHex, toBase64 } from '@cosmjs/encoding'
import {
  Proposal, ProposalTally, Proposer, StakingPool, Votes, Deposit,
  Validator, StakingParameters, Block, ValidatorDistribution, StakingDelegation, WrapStdTx, getUserCurrency,
} from './utils'
import OsmosAPI from './osmos'

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

export default class ChainFetch {
  constructor() {
    this.osmosis = new OsmosAPI()
    this.EndpointVersion = {
      certik: 'v1alpha1',
    }
  }

  getEndpointVersion() {
    return this.EndpointVersion[this.config.chain_name] || 'v1beta1'
  }

  getSelectedConfig() {
    let chain = store.state.chains.selected
    const lschains = localStorage.getItem('chains')
    if (lschains) {
      chain = JSON.parse(lschains)[chain?.chain_name || 'cosmos']
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

  async getNodeInfo() {
    return this.get('/cosmos/base/tendermint/v1beta1/node_info')
  }

  async getLatestBlock(config = null) {
    const conf = config || this.getSelectedConfig()
    const ver = conf.sdk_version || '0.41'
    if (ver && compareVersions(ver, '0.45') < 1) {
      return this.get('/blocks/latest', config).then(data => Block.create(data)).then(block => {
        block.block.last_commit.signatures.map(s1 => {
          const s = s1
          s.validator_address = toBase64(fromHex(s.validator_address))
          return s
        })
        return block
      })
    }
    return this.get('/cosmos/base/tendermint/v1beta1/blocks/latest', config).then(data => Block.create(data))
  }

  async getBlockByHeight(height, config = null) {
    const conf = config || this.getSelectedConfig()
    const ver = conf.sdk_version || '0.41'
    if (ver && compareVersions(ver, '0.45') < 1) {
      return this.get('/blocks/latest', config).then(data => Block.create(data)).then(block => {
        block.block.last_commit.signatures.map(s1 => {
          const s = s1
          s.validator_address = toBase64(fromHex(s.validator_address))
          return s
        })
        return block
      })
    }
    return this.get(`/cosmos/base/tendermint/v1beta1/blocks/${height}`, config).then(data => Block.create(data))
  }

  async getSlashingSigningInfo(config = null) {
    return this.get('/cosmos/slashing/v1beta1/signing_infos?pagination.limit=500', config)
  }

  async getTxs(hash, config = null) {
    const conf = config || this.getSelectedConfig()
    const ver = conf.sdk_version || '0.41'
    // /cosmos/tx/v1beta1/txs/{hash}
    if (ver && compareVersions(ver, '0.40') < 1) {
      return this.get(`/txs/${hash}`).then(data => WrapStdTx.create(data, ver))
    }
    return this.get(`/cosmos/tx/v1beta1/txs/${hash}`).then(data => WrapStdTx.create(data, ver))
  }

  async getTxsBySender(sender) {
    return this.get(`/cosmos/tx/v1beta1/txs?events=message.sender='${sender}'&pagination.reverse=true&order_by=ORDER_BY_DESC`)
  }

  async getTxsByRecipient(recipient) {
    return this.get(`/cosmos/tx/v1beta1/txs?message.recipient=${recipient}`)
  }

  async getTxsByHeight(height) {
    return this.get(`/cosmos/tx/v1beta1/txs?events=tx.height=${height}`)
  }

  async getValidatorDistribution(address) {
    // return this.get(`/distribution/validators/${address}`).then(data => {
    //   const value = commonProcess(data)
    //   const ret = ValidatorDistribution.create({
    //     operator_address: address,
    //     self_bond_rewards: value.self_bond_rewards,
    //     val_commission: value.val_commission.commission,
    //   })
    //   return ret
    // })
    return Promise.all([
      this.get(`/cosmos/distribution/v1beta1/validators/${address}/commission`, null, true),
      this.get(`/cosmos/distribution/v1beta1/validators/${address}/outstanding_rewards`, null, true),
    ]).then(data => {
      const ret = ValidatorDistribution.create({
        operator_address: address,
        self_bond_rewards: data[1].rewards.rewards,
        val_commission: data[0].commission.commission,
      })
      return ret
    })
  }

  async getStakingDelegatorDelegation(delegatorAddr, validatorAddr) {
    return this.get(`/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations/${delegatorAddr}`).then(data => StakingDelegation.create(commonProcess(data).delegation_response))
  }

  async getBankTotal(denom) {
    if (compareVersions(this.config.sdk_version, '0.46.2') > 0) {
      return this.get(`/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`).then(data => commonProcess(data).amount)
    }
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get(`/supply/total/${denom}`).then(data => ({ amount: commonProcess(data), denom }))
    }
    return this.get(`/cosmos/bank/v1beta1/supply/${denom}`).then(data => commonProcess(data).amount)
  }

  async getBankTotals() {
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get('/supply/total').then(data => commonProcess(data))
    }
    return this.get('/cosmos/bank/v1beta1/supply').then(data => data.supply)
  }

  async getStakingPool() {
    return this.get('/cosmos/staking/v1beta1/pool', null, true).then(data => new StakingPool().init(commonProcess(data.pool)))
  }

  async getMintingInflation() {
    if (this.config.chain_name === 'evmos') {
      return this.get('/evmos/inflation/v1/inflation_rate').then(data => Number(data.inflation_rate / 100 || 0))
    }
    if (this.config.chain_name === 'echelon') {
      return this.get('/echelon/inflation/v1/inflation_rate').then(data => Number(data.inflation_rate / 100 || 0))
    }
    if (this.config.chain_name === 'chain4energy') {
      return this.get('/c4e/minter/v1beta1/inflation').then(data => Number(data.inflation))
    }
    if (this.isModuleLoaded('minting')) {
      return this.get('/cosmos/mint/v1beta1/inflation').then(data => Number(commonProcess(data.inflation)))
    }
    return 0
  }

  async getStakingParameters() {
    return this.get('/cosmos/staking/v1beta1/params', null, true).then(data => {
      this.getSelectedConfig()
      return StakingParameters.create(commonProcess(data.params), this.config.chain_name)
    })
  }

  async getValidatorList(config = null) {
    return this.get('/cosmos/staking/v1beta1/validators?pagination.limit=200&status=BOND_STATUS_BONDED', config, true).then(data => {
      const vals = commonProcess(data.validators).map(i => new Validator().init(i))
      try {
        localStorage.setItem(`validators-${this.config.chain_name}`, JSON.stringify(vals))
      } catch (err) {
        // clear cache
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i)
          if (key.startsWith('validators')) {
            localStorage.removeItem(key)
          }
        }
        // set again
        localStorage.setItem(`validators-${this.config.chain_name}`, JSON.stringify(vals))
      }
      return vals
    })
  }

  async getValidatorUnbondedList() {
    return this.get('/cosmos/staking/v1beta1/validators?pagination.limit=100&status=BOND_STATUS_UNBONDED', null, true).then(data => {
      const result = commonProcess(data.validators)
      const vals = result.validators ? result.validators : result
      return vals.map(i => new Validator().init(i))
    })
  }

  async getValidatorListByStatus(status) {
    return this.get(`/cosmos/staking/v1beta1/validators?status=${status}&pagination.limit=500`, null, true).then(data => {
      const result = commonProcess(data)
      const vals = result.validators ? result.validators : result
      return vals.map(i => new Validator().init(i))
    })
  }

  async getValidatorListByHeight(height, offset) {
    return this.get(`/cosmos/base/tendermint/v1beta1/validatorsets/${height}?pagination.limit=100&pagination.offset=${offset}`).then(data => commonProcess(data))
  }

  async getStakingValidator(address) {
    return this.get(`/cosmos/staking/v1beta1/validators/${address}`, null, true).then(data => new Validator().init(commonProcess(data).validator))
  }

  async getSlashingParameters() {
    if (this.isModuleLoaded('slashing')) {
      return this.get('/cosmos/slashing/v1beta1/params').then(data => commonProcess(data.params))
    }
    return null
  }

  async getMintParameters() {
    if (this.config.chain_name === 'evmos') {
      const result = await this.get('/evmos/inflation/v1/params').then(data => data.params)
      await this.get('/evmos/inflation/v1/period').then(data => {
        Object.entries(data).forEach(x => {
          const k = x[0]
          const v = x[1]
          result[k] = v
        })
      })
      await this.get('/evmos/inflation/v1/total_supply').then(data => {
        Object.entries(data).forEach(x => {
          const k = x[0]
          const v = x[1]
          result[k] = v
        })
      })
      return result
    }
    if (this.config.chain_name === 'echelon') {
      const result = await this.get('/echelon/inflation/v1/params').then(data => data.params)
      await this.get('/echelon/inflation/v1/period').then(data => {
        Object.entries(data).forEach(x => {
          const k = x[0]
          const v = x[1]
          result[k] = v
        })
      })
      await this.get('/echelon/inflation/v1/total_supply').then(data => {
        Object.entries(data).forEach(x => {
          const k = x[0]
          const v = x[1]
          result[k] = v
        })
      })
      return result
    }
    if (this.isModuleLoaded('minting')) {
      return this.get('/cosmos/mint/v1beta1/params').then(data => commonProcess(data.params))
    }
    return null
  }

  async getDistributionParameters() {
    return this.get('/cosmos/distribution/v1beta1/params', null, true).then(data => commonProcess(data.params))
  }

  async getGovernanceParameterDeposit() {
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/params/deposit`).then(data => commonProcess(data.deposit_params))
  }

  async getGovernanceParameterTallying() {
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/params/tallying`).then(data => commonProcess(data.tally_params))
  }

  async getGovernanceParameterVoting() {
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/params/voting`).then(data => commonProcess(data.voting_params))
  }

  async getGovernanceTally(pid, total, conf) {
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/proposals/${pid}/tally`, conf).then(data => new ProposalTally().init(commonProcess(data).tally, total))
  }

  getGovernance(pid) {
    if (this.config.chain_name === 'shentu') {
      return this.get(`/shentu/gov/v1alpha1/proposals/${pid}`).then(data => {
        const p = new Proposal().init(commonProcess(data).proposal, 0)
        return p
      })
    }

    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/proposals/${pid}`).then(data => {
      const p = new Proposal().init(commonProcess(data).proposal, 0)
      p.versionFixed(this.config.sdk_version)
      return p
    })
  }

  async getGovernanceProposer(pid) {
    if (this.config.chain_name === 'shentu') {
      return this.get(`/shentu/gov/v1alpha1/${pid}/proposer`).then(data => new Proposer().init(commonProcess(data)))
    }
    return this.get(`/gov/proposals/${pid}/proposer`).then(data => new Proposer().init(commonProcess(data)))
  }

  async getGovernanceDeposits(pid) {
    if (this.config.chain_name === 'shentu') {
      return this.get(`/shentu/gov/v1alpha1/proposals/${pid}/deposits`).then(data => {
        const result = commonProcess(data)
        return Array.isArray(result) ? result.reverse().map(d => new Deposit().init(d)) : result
      })
    }

    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/proposals/${pid}/deposits`).then(data => {
      const result = commonProcess(data)
      return Array.isArray(result) ? result.reverse().map(d => new Deposit().init(d)) : result
    })
  }

  async getGovernanceVotes(pid, next = '', limit = 50) {
    if (compareVersions(this.config.sdk_version, '0.40') < 0) {
      return this.get(`/cosmos/gov/v1beta1/proposals/${pid}/votes`).then(data => ({
        votes: commonProcess(data).map(d => new Votes().init(d)),
        pagination: {},
      }))
    }
    if (this.config.chain_name === 'shentu') {
      return this.get(`/shentu/gov/v1alpha1/proposals/${pid}/votes?pagination.key=${encodeURIComponent(next)}&pagination.limit=${limit}&pagination.reverse=true`)
    }
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    return this.get(`/cosmos/gov/${ver}/proposals/${pid}/votes?pagination.key=${encodeURIComponent(next)}&pagination.limit=${limit}&pagination.reverse=true`)
  }

  async getGovernanceListByStatus(status, chain = null) {
    const conf = chain || this.config

    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    const url = conf.chain_name === 'shentu' ? `/shentu/gov/v1alpha1/proposals?pagination.limit=100&proposal_status=${status}` : `/cosmos/gov/${ver}/proposals?pagination.limit=100&proposal_status=${status}`
    return this.get(url, conf).then(data => {
      let proposals = commonProcess(data)
      if (Array.isArray(proposals.proposals)) {
        proposals = proposals.proposals
      }
      const ret = []
      if (proposals) {
        proposals.forEach(e => {
          const g = new Proposal().init(e, 0)
          g.versionFixed(this.config.sdk_version)
          ret.push(g)
        })
      }
      return {
        proposals: ret,
        pagination: data.pagination,
      }
    })
  }

  async getGovernanceProposalVote(pid, voter, chain) {
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    const url = this.config.chain_name === 'shentu'
      ? `/shentu/gov/v1alpha1/proposals/${pid}/votes/${voter}`
      : `/cosmos/gov/${ver}/proposals/${pid}/votes/${voter}`
    return this.get(url, chain).then(data => {
      if (data.code === 3) {
        throw new Error('not found')
      }
      return data
    })
  }

  /// does NOT return value as expected
  async getUpgradeCurrentPlan(chain = null) {
    return this.get('/cosmos/upgrade/v1beta1/current_plan', chain)
  }

  async getGovernanceList(next = '', chain = null) {
    const key = next || ''
    const ver = compareVersions(this.config.sdk_version, '0.46.5') < 0 ? 'v1beta1' : 'v1'
    const url = this.config.chain_name === 'shentu'
      ? `/shentu/gov/v1alpha1/proposals?pagination.limit=20&pagination.reverse=true&pagination.key=${key}`
      : `/cosmos/gov/${ver}/proposals?pagination.limit=20&pagination.reverse=true&pagination.key=${key}`
    return this.get(url, chain).then(data => {
      let proposals = commonProcess(data)
      if (Array.isArray(proposals.proposals)) {
        proposals = proposals.proposals
      }
      const ret = []
      if (proposals) {
        proposals.forEach(e => {
          const g = new Proposal().init(e, 0)
          g.versionFixed(this.config.sdk_version)
          ret.push(g)
        })
      }
      return {
        proposals: ret,
        pagination: data.pagination,
      }
    })
  }

  async getAuthAccount(address, config = null) {
    return this.get('/cosmos/auth/v1beta1/accounts/'.concat(address), config).then(data => {
      const result = commonProcess(data)
      return result
    })
  }

  async getBankAccountBalance(address) {
    return this.get('/cosmos/bank/v1beta1/balances/'.concat(address)).then(data => commonProcess(data).balances)
  }

  async getStakingReward(address, config = null) {
    if (compareVersions(config ? config.sdk_version : this.config.sdk_version, '0.40') < 0) {
      return this.get(`/distribution/delegators/${address}/rewards`, config, true).then(data => commonProcess(data))
    }
    return this.get(`/cosmos/distribution/v1beta1/delegators/${address}/rewards`, config, true).then(data => commonProcess(data))
  }

  async getValidatorSlashs(address, config = null) {
    return this.get(`/cosmos/distribution/v1beta1/validators/${address}/slashes`, config, true).then(data => commonProcess(data))
  }

  async getStakingValidators(address) {
    return this.get(`/cosmos/distribution/v1beta1/delegators/${address}/validators?pagination.size=200`, null, true).then(data => commonProcess(data.validators))
  }

  async getStakingDelegations(address, config = null) {
    if (compareVersions(config ? config.sdk_version : this.config.sdk_version, '0.40') < 0) {
      return this.get(`/staking/delegators/${address}/delegations`, config, true).then(data => commonProcess(data).map(x => {
        const xh = x
        if (!xh.delegation) {
          xh.delegation = {
            validator_address: x.validator_address,
            delegator_address: x.delegator_address,
          }
        }
        return xh
      }))
    }
    return this.get(`/cosmos/staking/v1beta1/delegations/${address}`, config, true).then(data => commonProcess(data))
  }

  async getStakingRedelegations(address, config = null) {
    if (compareVersions(config ? config.sdk_version : this.config.sdk_version, '0.40') < 0) {
      return this.get(`/staking/redelegations?delegator=${address}`, config, true).then(data => commonProcess(data))
    }
    return this.get(`/cosmos/staking/v1beta1/delegators/${address}/redelegations`, config, true).then(data => commonProcess(data))
  }

  async getStakingUnbonding(address, config = null) {
    if (compareVersions(config ? config.sdk_version : this.config.sdk_version, '0.40') < 0) {
      return this.get(`/staking/delegators/${address}/unbonding_delegations`, config, true).then(data => commonProcess(data))
    }
    return this.get(`/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`, config, true).then(data => commonProcess(data))
  }

  async getBankBalances(address, config = null) {
    return this.get('/cosmos/bank/v1beta1/balances/'.concat(address), config).then(data => commonProcess(data))
  }

  async getCommunityPool(config = null) {
    return this.get('/cosmos/distribution/v1beta1/community_pool', config, true).then(data => commonProcess(data))
  }

  async getAllIBCDenoms(config = null) {
    const conf = config || this.getSelectedConfig()
    const sdkVersion = conf.sdk_version
    if (compareVersions(sdkVersion, '0.44.2') < 0) {
      return this.get('/ibc/applications/transfer/v1beta1/denom_traces?pagination.limit=500', conf).then(data => commonProcess(data))
    }
    return this.get('/ibc/apps/transfer/v1/denom_traces?pagination.limit=500', conf).then(data => commonProcess(data))
  }

  async getIBCDenomTrace(hash, config = null) {
    const h = hash.substring(hash.indexOf('/') + 1)
    const sdkVersion = config ? config.sdk_version : this.config.sdk_version
    if (compareVersions(sdkVersion, '0.44.2') < 0) {
      return this.get('/ibc/applications/transfer/v1beta1/denom_traces/'.concat(h), config).then(data => commonProcess(data))
    }
    return this.get('/ibc/apps/transfer/v1/denom_traces/'.concat(h), config).then(data => commonProcess(data))
  }

  async getIBCChannels(config = null, key = null) {
    if (key) {
      return this.get('/ibc/core/channel/v1/channels?pagination.key='.concat(key), config).then(data => commonProcess(data))
    }
    return this.get('/ibc/core/channel/v1/channels?pagination.limit=1000', config).then(data => commonProcess(data))
  }

  // eslint-disable-next-line camelcase
  async getIBCChannelClientState(channel_id, port_id, config = null) {
    // eslint-disable-next-line camelcase
    return this.get(`/ibc/core/channel/v1/channels/${channel_id}/ports/${port_id}/client_state`, config).then(data => commonProcess(data))
  }

  // eslint-disable-next-line camelcase
  async getIBCChannel(channel_id, port_id, config = null) {
    // eslint-disable-next-line camelcase
    return this.get(`/ibc/core/channel/v1/channels/${channel_id}/ports/${port_id}`, config).then(data => commonProcess(data))
  }

  static async getBankBalance(baseurl, address) {
    return ChainFetch.fetch(baseurl, '/cosmos/bank/v1beta1/balances/'.concat(address)).then(data => commonProcess(data))
  }

  async getGravityPools() {
    return this.get('/cosmos/liquidity/v1beta1/pools').then(data => commonProcess(data))
  }

  async getMarketChart(days = 14, coin = null) {
    const conf = this.getSelectedConfig()
    const currency = getUserCurrency()
    if (conf.assets[0] && conf.assets[0].coingecko_id) {
      return ChainFetch.fetch(' https://api.coingecko.com', `/api/v3/coins/${coin || conf.assets[0].coingecko_id}/market_chart?vs_currency=${currency}&days=${days}`)
    }
    return null
  }

  async getCoinInfo(coin = null) {
    const conf = this.getSelectedConfig()
    if (conf.assets[0] && conf.assets[0].coingecko_id) {
      return ChainFetch.fetch(' https://api.coingecko.com', `/api/v3/coins/${coin || conf.assets[0].coingecko_id}`)
    }
    return null
  }

  // CoinMarketCap
  static async fetchCoinMarketCap(url) {
    const host = 'https://price.ping.pub'
    return fetch(host + url).then(response => response.json())
  }

  static async fetchTokenQuote(symbol) {
    return ChainFetch.fetchCoinMarketCap(`/quote/${symbol}`)
  }

  // Simulate Execution of tx
  async simulate(bodyBytes, config = null) {
    const txString = toBase64(TxRaw.encode(bodyBytes).finish())
    const txRaw = {
      tx_bytes: txString,
    }
    return this.post('/cosmos/tx/v1beta1/simulate', txRaw, config)
  }

  // Tx Submit
  async broadcastTx(bodyBytes, config = null) {
    const txbytes = bodyBytes.authInfoBytes ? TxRaw.encode(bodyBytes).finish() : bodyBytes
    const txString = toBase64(txbytes)
    const txRaw = {
      tx_bytes: txString,
      mode: 'BROADCAST_MODE_SYNC', // BROADCAST_MODE_SYNC, BROADCAST_MODE_BLOCK, BROADCAST_MODE_ASYNC
    }
    return this.post('/cosmos/tx/v1beta1/txs', txRaw, config).then(res => {
      if (res.code && res.code !== 0) {
        throw new Error(res.message)
      }
      if (res.tx_response && res.tx_response.code !== 0) {
        throw new Error(res.tx_response.raw_log)
      }
      return res
    })
  }

  async post(url = '', data = {}, config = null) {
    if (!config) {
      this.getSelectedConfig()
    }
    const conf = config || this.config
    const index = this.getApiIndex(config)
    // Default options are marked with *
    const response = await fetch((Array.isArray(conf.api) ? conf.api[index] : conf.api) + url, {
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

  async get(url, config = null, fetch_on_provider = false) {
    if (!config) {
      this.getSelectedConfig()
    }
    const conf = config || this.config
    if (fetch_on_provider && conf.provider_chain) {
      return fetch(`${conf.provider_chain.api}${url}`).then(response => response.json())
    }
    const finalurl = (Array.isArray(conf.api) ? conf.api[this.getApiIndex(config)] : conf.api) + url
    // finalurl = finalurl.replaceAll('v1beta1', this.getEndpointVersion())
    return fetch(finalurl).then(response => response.json())
  }

  getApiIndex(config = null) {
    const conf = config || this.config
    const index = Number(localStorage.getItem(`${conf.chain_name}-api-index`) || 0)
    return index < conf.api.length ? index : 0
  }

  async getContractInfo(address, config = null) {
    return this.get(`/cosmwasm/wasm/v1/contract/${address}`, config, true).then(
      data => commonProcess(data.contract_info),
    )
  }

  async queryContract(address, msg, config = null) {
    return this.get(
      `/cosmwasm/wasm/v1/contract/${address}/smart/${encodeURIComponent(
        btoa(msg),
      )}`,
      config,
      true,
    ).then(data => commonProcess(data))
  }

  async resolveStarName(address) {
    const endpoint = 'https://rest.stargaze-apis.com'
    const query = toBase64(Buffer.from(JSON.stringify({ name: { address } })))
    const contract = 'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr'
    return this.getUrl(`${endpoint}/cosmwasm/wasm/v1/contract/${contract}/smart/${query}`)
  }

  async getUrl(url) {
    this.getSelectedConfig()
    return fetch(url).then(res => res.json())
  }

  static fetch(host, url) {
    const ret = fetch((Array.isArray(host) ? host[0] : host) + url).then(response => response.json())
    return ret
  }
}

// export default chainAPI
