/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2021-03-10 17:00:40
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/api/V2/response.js
 */
import { timeToDay, toDenom, toTimestamp, formatTime } from '../../utils/format'
import { createDisplayCoin, percent, twoDecimals, uatoms, toIris, atoms } from '../../utils/num'
import { addressToHex, validatorAddressToAccount } from '../../utils/b32'
import store from '../../store'

const commonResult = (res) => res

export function getNodeInfo(res) {
  const { network, version } = res.node_info || {}
  return {
    network,
    version
  }
}

export function getNodeInfoRes(res) {
  return res
}

export function getAuthAccounts(res) {
  const result = commonResult(res)
  const { type, value } = result
  return {
    type,
    ...value
  }
}

export const postBankAccountsTransfers = (res) => Math.round(res.gas_estimate * 2.3)
export const getStakingParameters = (res) => {
  const data = commonResult(res)
  const { max_validators, unbonding_time } = data.value
  return {
    max_validators,
    unbonding_time: timeToDay(unbonding_time)
  }
}
export const postTxs = (res) => (res)
function formatValidator(item) {
  item.dailyChange = '--'
  item.rewards = '--'
  const { identity, moniker, website, details } = item.description
  item.moniker = moniker
  item.identity = identity
  item.website = website
  item.details = details
  item.tokens = Number(item.tokens).toFixed(2)
  item.voting_power = Number(item.tokens).toFixed(2) // TODO: 单位问题
  item.userAddress = validatorAddressToAccount(item.operator_address)
  item.hexAddress = addressToHex(item.consensus_pubkey)
  item.commission_rate = Number(item.commission.rate)
  item.commission_rate_percent = percent(item.commission_rate)
  item.commission_rate_max = Number(item.commission.max_rate)
  item.commission_rate_max_percent = percent(item.commission_rate_max)
  item.commission_rate_max_change = Number(item.commission.max_change_rate)
  item.commission_rate_max_change_percent = percent(item.commission_rate_max_change)
  if (item.unbonding_time) {
    item.unbonding_time = formatTime(item.unbonding_time)
  }
}
export const getStakingValidators = (res) => {
  let [arr1, arr2, validatorsBonded, params] = res
  const validatorsAll = [...arr1, ...arr2]
  const height = Number(validatorsBonded.block_height)
  const validators = []
  const status = params.status === 'bonded' ? 2 : 0
  for (const item of validatorsAll) {
    if (item.status === status) {
      formatValidator(item)
      validators.push(item)
    }
  }
  validators.sort((current, next) => {
    return Number(next.tokens) - Number(current.tokens);
  })
  return {
    height,
    result: validators
  }
}

export const getStakingValidatorsObj = (res) => {
  const [arr1, arr2] = res
  const data = [...arr1, ...arr2]
  const hexObj = {}
  const addressObj = {}
  const validatorObj = {}
  for (const item of data) {
    formatValidator(item)
    hexObj[item.hexAddress] = item
    addressObj[item.userAddress] = item
    validatorObj[item.operator_address] = item
  }
  return {
    hexObj,
    addressObj,
    validatorObj
  }
}

export const getGovParametersDeposit = (res) => {
  const data = commonResult(res)
  const coin = createDisplayCoin(data.min_deposit[0])
  return {
    min_deposit: coin.amount + coin.denom,
    max_deposit_period: timeToDay(data.max_deposit_period)
  }
}
export const getGovParametersVoting = (res) => {
  const data = commonResult(res)
  return {
    voting_period: timeToDay(data.voting_period)
  }
}
export const getGovParametersTallying = (res) => {
  const data = commonResult(res)
  const { quorum, threshold, veto } = data
  return {
    quorum: percent(quorum),
    threshold: percent(threshold),
    veto: percent(veto)
  }
}
export const getSlashingParameters = (res) => {
  const data = commonResult(res)
  const { max_evidence_age, slash_fraction_downtime, downtime_jail_duration, signed_blocks_window, min_signed_per_window, slash_fraction_double_sign } = data.value
  return {
    max_evidence_age: timeToDay(max_evidence_age, true),
    downtime_jail_duration: timeToDay(downtime_jail_duration),
    signed_blocks_window: Number(signed_blocks_window),
    min_signed_per_window: percent(min_signed_per_window),
    slash_fraction_double_sign: percent(slash_fraction_double_sign),
    slash_fraction_downtime: percent(slash_fraction_downtime)
  }
}

export const getDistributionParameters = (res) => {
  const data = commonResult(res)
  const { community_tax, base_proposer_reward, bonus_proposer_reward, withdraw_addr_enabled } = data.value
  return {
    community_tax: percent(community_tax),
    base_proposer_reward: percent(base_proposer_reward),
    bonus_proposer_reward: percent(bonus_proposer_reward),
    // withdraw_addr_enabled: withdraw_addr_enabled ? "Enabled" : "Disabled"
  }
}

export const getStakingValidatorsDelegations = (res) => {
  const data = commonResult(res)
  let total = 0
  for (const item of data) {
    total += Number(item.shares)
    item.delegator_address = item.delegator_addr
    item.shares_str = atoms(Number(item.shares)) + ' ' + window.chain.unit
  }
  data.sort((now, next) => {
    now.shares_percent = percent(Number(now.shares) / total)
    next.shares_percent = percent(Number(next.shares) / total)
    return Number(next.shares) - Number(now.shares)
  })
  if (data.length === 1) {
    data[0].shares_percent = percent(Number(data[0].shares) / total)
  }
  return data
}

export const getSlashingValidatorsSigningInfo = (res) => {
  const data = commonResult(res)
  return {
    missed_blocks_counter: data.missed_blocks_counter
  }
}

export const getMintingParameters = (result) => {
  const data = commonResult(result)
  const { blocks_per_year, inflation_rate_change } = data
  return {
    blocks_per_year,
    mint_denom: '', // toDenom(data.mint_denom),
    inflation_rate_change: percent(inflation_rate_change),
    inflation_max: percent(data.inflation_max),
    inflation_min: percent(data.inflation_min),
    goal_bonded: percent(data.goal_bonded),
  }
}

export const getMintingInflation = (res) => {
  let data = commonResult(res)
  data = data.value.inflation
  return {
    inflation: percent(data),
    inflation_val: Number(data)
  }
}

export const getMintingAnnualProvisionsn = (res) => {
  const data = commonResult(res)
  return {
    annual_provisions: (Number(data) / 1000000).toFixed(0)
  }
}
// /gov/proposals 方法
function dataFormat(item) {
  item = item.value.BasicProposal
  item.id = item.proposal_id
  item.description_sub = item.description.length > 200 ? (item.description).substr(0, 200) : item.description

  const { voting_start_time, voting_end_time, deposit_end_time, submit_time, total_deposit } = item
  item.total_deposit_str = createDisplayCoin(total_deposit[0])
  item.submit_time = formatTime(submit_time)
  item.voting_start_time = formatTime(voting_start_time)
  item.voting_end_time = formatTime(voting_end_time)
  item.deposit_end_time = formatTime(deposit_end_time)
  const { yes, abstain, no, no_with_veto } = item.tally_result
  const total = Number(yes) + Number(abstain) + Number(no) + Number(no_with_veto)
  item.yes = twoDecimals(yes / total)
  item.yes_percent = percent(yes / total)
  item.abstain = twoDecimals(abstain / total)
  item.abstain_percent = percent(abstain / total)
  item.no = twoDecimals(no / total)
  item.no_percent = percent(no / total)
  item.no_with_veto = twoDecimals(no_with_veto / total)
  item.no_with_veto_percent = percent(no_with_veto / total)
  item.type = item.proposal_type
  // 质押总数
  const bondedTokens = store.state.bondedTokens
  if (bondedTokens) {
    item.join = twoDecimals(total / bondedTokens)
    item.join_percent = percent(total / bondedTokens)
  }

  return item
}

export const getGovProposals = (res) => {
  const data = commonResult(res)
  const arr = []
  for (let item of data) {
    arr.push(dataFormat(item))
  }
  arr.sort((now, next) => {
    return (
      toTimestamp(next.submit_time) - toTimestamp(now.submit_time)
    );
  });
  return arr
}

export const getGovProposalsId = (res) => {
  const data = commonResult(res)
  return dataFormat(data)
}

export const getBlocksLatest = (res) => {
  const { block } = res
  return {
    height: Number(block.header.height)
  }
}
export const getSupplyTotal = (res) => {
  const data = commonResult(res)
  const amount = Number(data)
  const amount_str = amount > 1000000
    ? (amount / 1000000).toFixed(2) + "M"
    : (amount / 1000).toFixed(2) + "K"
  return {
    amount,
    amount_str
  }
}
export const getStakingPool = (res) => {
  const data = commonResult(res)
  let { bonded_tokens } = data
  const bonded_tokens_val = Number(bonded_tokens)
  bonded_tokens = bonded_tokens_val > 1000000
    ? (bonded_tokens_val / 1000000).toFixed(2) + "M"
    : (bonded_tokens_val / 1000).toFixed(2) + "K"
  return {
    bonded_tokens_val,
    bonded_tokens
  }
}

export const getValidatorsetsHeight = (res) => {
  const data = commonResult(res)
  return data.validators
}


export const getTxs = (res) => (res)

export const getGovProposalsDeposits = (res) => {
  const data = commonResult(res) || []
  for (const item of data) {
    item.amountCoin = createDisplayCoin(item.amount[0])
    item.amountCoin_str = item.amountCoin.amount + ' ' + item.amountCoin.denom
  }
  return data
}

// getGovProposalsVotes
export const getGovProposalsVotes = (res) => {
  const data = commonResult(res) || []
  return data
}

export const getBlocksHeight = (res) => {
  return res
}

export const getTxsHash = (res) => (res)
export const getStakingValidatorsValidatorAddress = (res) => {
  const data = (commonResult(res))
  formatValidator(data)
  return data
}
// RPC === 
export const getRpcAbciInfo = (res) => {
  return {
    last_block_height: res.response.last_block_height
  }
}

export const getRpcCommitHeight = (res) => {
  const data = res.result
  const precommits = data.signed_header.commit.precommits
  const obj = {}
  for (const item of precommits) {
    if (item) {
      const { validator_address } = item
      obj[validator_address] = true
    }
  }
  return obj
}
export const getRpcValidators = (res) => {
  const data = commonResult(res)
  return data.result
}

export const getValidatorsetsLatest = (res) => {
  return res
}

export const getRpcBlockchain = (res) => {
  const data = commonResult(res).result
  const last_height = Number(data.last_height)
  const block_metas = []
  for (const item of data.block_metas) {
    const { header, block_id } = item
    const { num_txs, height, last_block_id, time } = header
    header.block_hash = block_id.hash
    header.num_txs = Number(num_txs)
    header.last_block_hash = last_block_id.hash
    header.time = formatTime(time)
    block_metas.push(header)
  }
  return {
    last_height,
    block_metas
  }
}
