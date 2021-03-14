/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2020-12-11 15:29:37
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/api/V1/request.js
 */
const get = (url) => ({ method: 'get', url, headers: { server: window.chain.lcd } })
const getRpc = (url) => ({ method: 'get', url, headers: { server: window.chain.rpc } })

export const getKavaCdpParameters = () => (get('/cdp/parameters'))
export const getKavaPricefeed = () => (get('/pricefeed/parameters'))
export const getKavaIncentive = () => (get('/incentive/parameters'))
export const getKavaBep3 = () => (get('/bep3/parameters'))
export const getKavaAuction = () => (get('/auction/parameters'))

// RPC ===
export const getRpcCommitHeight = ({ height }) => (getRpc(`/commit?height=${height}`))
export const getRpcBlockchain = ({ minHeight, maxHeight }) => (getRpc(`/blockchain?minHeight=${minHeight}&maxHeight=${maxHeight}`))
export const getRpcValidators = ({ height }) => (getRpc(`/validators?height=${height}`))
export const getRpcGenesis = () => (getRpc('/genesis'))
export const getRpcConsensus_state = () => (getRpc('/consensus_state'))
// 获取最新高度
export const getRpcAbciInfo = () => (getRpc('/abci_info'))
// LCD ===
// node info
// Auth
export const getAuthAccounts = ({ address }) => (get(`/auth/accounts/${address}`))
// Blocks
export const getBlocksLatest = () => (get('/blocks/latest'))
export const getBlocksHeight = ({ height }) => (get(`/blocks/${height}`))
// Distribution
export const getDistributionParameters = () => (get('/distribution/parameters'))
export const getDistributionDelegatorsRewards = ({ delegatorAddress }) => (get(`/distribution/delegators/${delegatorAddress}/rewards`))
// Gov
export const getGovParametersDeposit = () => (get('/gov/parameters/deposit'))
export const getGovParametersVoting = () => (get('/gov/parameters/voting'))
export const getGovParametersTallying = () => (get('/gov/parameters/tallying'))
// goverance
export const getGovProposals = () => (get('/gov/proposals'))
export const getGovProposalsId = ({ id }) => (get(`/gov/proposals/${id}`))
export const getGovProposalsDeposits = ({ proposalId }) => (get(`/gov/proposals/${proposalId}/deposits`))
export const getGovProposalsVotes = ({ proposalId }) => (get(`/gov/proposals/${proposalId}/votes`))
// committee
export const getCommitteeCommittees = () => {}
export const getCommitteeCommitteesId = ({ id }) => (get(`/committee/committees/${id}`))
// Slashing
export const getSlashingParameters = () => (get('/slashing/parameters'))
export const getSlashingValidatorsSigningInfo = ({ validatorAddress }) => (get(`/slashing/validators/${validatorAddress}/signing_info`))
export const getSupplyTotal = () => (get('/supply/total'))
export const getStakingPool = () => (get('/staking/pool'))
export const getStakingParameters = () => (get('/staking/parameters'))
export const getStakingValidators = ({ status }) => (get(`/staking/validators?status=${status || 'bonded'}`))
export const getStakingValidatorsObj = ({ status }) => (get(`/staking/validators?status=${status || 'bonded'}`))
export const getStakingValidatorsValidatorAddress = ({ validatorAddress }) => (get(`/staking/validators/${validatorAddress}`))
export const getStakingDelegatorsDelegations = ({ delegatorAddress }) => (get(`/staking/delegators/${delegatorAddress}/delegations`))
export const getStakingValidatorsDelegations = ({ validatorAddress }) => (get(`/staking/validators/${validatorAddress}/delegations`))
// Minting
export const getMintingParameters = () => (get('/minting/parameters'))
export const getMintingInflation = () => (get('/minting/inflation'))
export const getMintingAnnualProvisionsn = () => (get('/minting/annual-provisions'))
// Node
export const getNodeInfo = () => (get('/node_info'))
export const getNodeInfoRes = () => (get('/node_info'))
// Tx
export const getTxs = ({ height }) => {
  const config = get('/txs')
  config.params = {
    'tx.height': height
  }
  return config
}
export const getTxsHistory = ({ address, page,  }) => {
  const config = get('/txs')
  config.params = {
    page,
    limit: 10,
    'message.sender': address
  }
  return config
}
export const getTxsHash = ({ hash }) => (get(`/txs/${hash}`))
// Validators
export const getValidatorsetsHeight = ({ height }) => (get(`/validatorsets/${height}`))

// POST ===
// post Send coins from one account to another
export function postBankAccountsTransfers({ address, chain_id, account_number, sequence, amount, denom, memo, simulate }) {
  return {
    method: 'post',
    url: `/bank/accounts/${address}/transfers`,
    data: {
      base_req: {
        "from": address,
        "memo": memo || "Sent via look.ping.pub",
        chain_id,
        account_number,
        sequence,
        "gas": "200000",
        "gas_adjustment": "2.3",
        "fees": [
          Coin({ amount, denom })
        ],
        simulate
      },
      "amount": [
        Coin({ amount, denom })
      ]
    }
  }
}

// post Broadcast a signed tx
export function postTxs({ txBroadcast }) {
  const config = get('/txs')
  config.method = 'post'
  config.data = { ...txBroadcast }
  return config
}

function Coin({ amount, denom }) {
  return {
    amount: String(amount),
    denom
  };
}

