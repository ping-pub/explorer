/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2021-02-19 15:38:37
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\api\V1\response.js
 */
import { timeToDay, toDenom, toTimestamp, formatTime } from '../../utils/format'
import { createDisplayCoin, percent, twoDecimals, uatoms, atoms } from '../../utils/num'
import { addressToHex, validatorAddressToAccount, base64ToPubkey } from '../../utils/b32'
import dayjs from 'dayjs'
import store from '../../store'

const commonResult = (res) => res.result

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

export function getKavaCdpParameters(res) {
  let result = commonResult(res); 
  result.debt_auction_lot = timeToDay(result.debt_auction_lot)
  result.surplus_auction_lot = timeToDay(result.surplus_auction_lot)
  result.debt_auction_threshold = timeToDay(result.debt_auction_threshold)
  result.surplus_auction_threshold = timeToDay(result.surplus_auction_threshold)
  result.savings_distribution_frequency = timeToDay(result.savings_distribution_frequency)
  result.debt_param.savings_rate = percent(result.debt_param.savings_rate)
  return result
}
export function getKavaPricefeed(res) { let result = commonResult(res); return result }
export function getKavaIncentive(res) { 
  let result = commonResult(res);
  for (const item of result.rewards) {
    item.duration = timeToDay(item.duration)
    item.claim_duration = timeToDay(item.claim_duration)
    item.time_lock = timeToDay(item.time_lock)
  }
  return result }
export function getKavaBep3(res) { let result = commonResult(res); return result }
export function getKavaAuction(res) { 
  let result = commonResult(res);
  result.max_auction_duration = timeToDay(result.max_auction_duration)
  result.bid_duration = timeToDay(result.bid_duration)
  result.increment_collateral = percent(result.increment_collateral)
  result.increment_surplus = percent(result.increment_surplus)
  result.increment_debt = percent(result.increment_debt)
  return result;
}

export function getAuthAccounts(res) {
  const result = commonResult(res)
  const { type, value } = result
  let coins = value.coins[0]
  coins = createDisplayCoin(coins)
  return {
    type,
    available: coins.amount,
    ...value
  }
}

export const postBankAccountsTransfers = (res) => Math.round(res.gas_estimate * 2.3)
export const getStakingParameters = (res) => {
  const data = commonResult(res)
  const { max_entries, max_validators, unbonding_time, bond_denom } = data
  return {
    max_entries,
    max_validators,
    unbonding_time: timeToDay(unbonding_time),
    bond_denom: toDenom(bond_denom)
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
  item.voting_power = atoms(Number(item.tokens)).toFixed(2) + ' ' + window.chain.unit // TODO: 单位问题
  item.userAddress = validatorAddressToAccount(item.operator_address)
  item.hexAddress = addressToHex(base64ToPubkey(item.consensus_pubkey.value))
  item.commission_rate = Number(item.commission.commission_rates.rate)
  item.commission_rate_percent = percent(item.commission_rate)
  item.commission_rate_max = Number(item.commission.commission_rates.max_rate)
  item.commission_rate_max_percent = percent(item.commission_rate_max)
  item.commission_rate_max_change = Number(item.commission.commission_rates.max_change_rate)
  item.commission_rate_max_change_percent = percent(item.commission_rate_max_change)
  if (item.unbonding_time) {
    item.unbonding_time = formatTime(item.unbonding_time)
  }
}
export const getStakingValidators = (res) => {
  const data = commonResult(res)
  data.sort((current, next) => {
    formatValidator(current)
    formatValidator(next)
    return Number(next.tokens) - Number(current.tokens);
  })
  if (data.length === 1) formatValidator(data[0])
  return {
    result: data
  }
}

export const getStakingValidatorsObj = (res) => {
  const data = commonResult(res)
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
  const { max_evidence_age, slash_fraction_downtime, downtime_jail_duration, signed_blocks_window, min_signed_per_window, slash_fraction_double_sign } = data
  return {
    max_evidence_age: timeToDay(max_evidence_age),
    downtime_jail_duration: timeToDay(downtime_jail_duration),
    signed_blocks_window: Number(signed_blocks_window),
    min_signed_per_window: percent(min_signed_per_window),
    slash_fraction_double_sign: percent(slash_fraction_double_sign),
    slash_fraction_downtime: percent(slash_fraction_downtime)
  }
}

export const getDistributionParameters = (res) => {
  const data = commonResult(res)
  const { community_tax, base_proposer_reward, bonus_proposer_reward, withdraw_addr_enabled } = data
  return {
    community_tax: percent(community_tax),
    base_proposer_reward: percent(base_proposer_reward),
    bonus_proposer_reward: percent(bonus_proposer_reward),
    withdraw_addr_enabled: withdraw_addr_enabled ? "Enabled" : "Disabled"
  }
}

export const getStakingValidatorsDelegations = (res) => {
  const data = commonResult(res)
  let total = 0
  for (const item of data) {
    total += Number(item.shares)
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
    mint_denom: toDenom(data.mint_denom),
    inflation_rate_change: percent(inflation_rate_change),
    inflation_max: percent(data.inflation_max),
    inflation_min: percent(data.inflation_min),
    goal_bonded: percent(data.goal_bonded),
  }
}

export const getMintingInflation = (res) => {
  const data = commonResult(res)
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
  const content = item.proposal_content || item.content
  item.title = content.value.title;
  item.description = content.value.description
  item.description_sub = item.description.length > 200 ? (item.description).substr(0, 200) : item.description

  const { voting_start_time, voting_end_time, deposit_end_time, submit_time, total_deposit } = item
  item.total_deposit_str = total_deposit && total_deposit[0] && createDisplayCoin(total_deposit[0]) || '--'
  item.submit_time = formatTime(submit_time)
  item.voting_start_time = formatTime(voting_start_time)
  item.voting_end_time = formatTime(voting_end_time)
  item.deposit_end_time = formatTime(deposit_end_time)

  // item.final_tally_result
  const { yes, abstain, no, no_with_veto } = item.final_tally_result
  // 参与总数
  const total = yes && (Number(yes) + Number(abstain) + Number(no) + Number(no_with_veto)) || 1
  item.yes = yes && twoDecimals(yes / total) || '--'
  item.yes_percent = yes && percent(yes / total) || '--'
  item.abstain = abstain && twoDecimals(abstain / total) || '--'
  item.abstain_percent = abstain && percent(abstain / total) || '--'
  item.no = no && twoDecimals(no / total) || '--'
  item.no_percent = no && percent(no / total) || '--'
  item.no_with_veto = no_with_veto && twoDecimals(no_with_veto / total) || '--'
  item.no_with_veto_percent = no_with_veto && percent(no_with_veto / total) || '--'
  item.type = content.type

  // 质押总数
  const bondedTokens = store.state.bondedTokens
  if (bondedTokens) {
    item.join = twoDecimals(total / bondedTokens)
    item.join_percent = percent(total / bondedTokens)
  }
}

// kava 投票接口
function formateCommitee(data) {
  for (const item of data) {
    item.vote_threshold_str = Number(item.vote_threshold).toFixed(2)
    item.proposal_duration_str = item.proposal_duration
  }
}
export function getCommitteeCommittees(res) {
  const data = commonResult(res)
  formateCommitee(data)
  return data
}
export const getCommitteeCommitteesId = (res) => {
  const data = commonResult(res)
  formateCommitee(data)
  return data
}
export const getGovProposals = (res) => {
  const data = commonResult(res)
  data.sort((now, next) => {
    dataFormat(now)
    dataFormat(next)
    return (
      toTimestamp(next.submit_time) - toTimestamp(now.submit_time)
    );
  });
  if (data.length === 1) dataFormat(data[0])
  return data
}

export const getGovProposalsId = (res) => {
  const data = commonResult(res)
  dataFormat(data)
  return data
}

export const getBlocksLatest = (res) => {
  const { block } = res
  return {
    height: Number(block.header.height)
  }
}
export const getSupplyTotal = (res) => {
  const data = commonResult(res)
  const amount = Number(data[0].amount)
  const amount_str = amount > 1000000
    ? (amount / 1000000 / 1000000).toFixed(2) + "M"
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
    ? (bonded_tokens_val / 1000000 / 1000000).toFixed(2) + "M"
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

export const getTxsHistory = (res) => {
  res.txs.sort((current, next) => {
    const dayCurrent = dayjs(current.timestap).valueOf()
    const dayNext = dayjs(next.timestap).valueOf()
    return dayCurrent - dayNext
  })
  return res
}

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

export const getStakingDelegatorsDelegations = (res) => {
  const data = commonResult(res)
  let delegated = 0
  for (const item of data) {
    item.shares = atoms(Number(item.shares))
    delegated += Number(item.shares)
  }
  delegated += ''
  return {
    delegated,
    delegations: data
  }
}

export const getDistributionDelegatorsRewards = (res) => {
  const data = commonResult(res)
  const rewards = data.rewards || []
  const obj = {}
  for (const item of rewards) {
    const coin = createDisplayCoin(item.reward[0])
    item.amount = coin.amount
    obj[item.validator_address] = {
      amount: item.amount
    }
  }
  const total = data.total[0] ? createDisplayCoin(data.total[0]) : { amount: '0' }
  return {
    rewardObj: obj,
    reward: total.amount,
    rewards
  }
}

// RPC === 
export const getRpcAbciInfo = (res) => {
  return {
    last_block_height: res.response.last_block_height
  }
}

export const getRpcCommitHeight = (res) => {
  const data = commonResult(res)
  const precommits = (data.signed_header && data.signed_header.commit && data.signed_header.commit.precommits) || (data.signed_header && data.signed_header.commit && data.signed_header.commit.signatures)
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
  return data
}

// 创世节点
export const getRpcGenesis = (res) => {
  const data = commonResult(res)
  data.genesis_time = data.genesis.genesis_time
  return data
}

export const getRpcConsensus_state = (res) => {
  const data = commonResult(res)
  const height_vote_set = data.round_state.height_vote_set
  return {
    height_vote_set
  }
}

export const getRpcBlockchain = (res) => {
  const data = commonResult(res)
  const last_height = Number(data.last_height)
  const block_metas = []
  for (const item of data.block_metas) {
    const { header, block_id } = item
    const { num_txs, height, last_block_id, time } = header
    header.block_hash = block_id.hash
    header.num_txs = num_txs && Number(num_txs) || (item.num_txs && Number(item.num_txs))
    header.last_block_hash = last_block_id.hash
    header.time = formatTime(time)
    block_metas.push(header)
  }
  return {
    last_height,
    block_metas
  }
}
