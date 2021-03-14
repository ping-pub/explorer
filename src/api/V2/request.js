/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2021-03-10 16:46:43
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\api\V2\request.js
 */
const get = (url) => ({ method: 'get', url, headers: { server: window.chain.lcd } })
const getRpc = (url) => ({ method: 'get', url, headers: { server: window.chain.rpc } })

// RPC ===
export const getRpcCommitHeight = ({ height }) => (getRpc(`/commit?height=${height}`))
export const getRpcBlockchain = ({ minHeight, maxHeight }) => (getRpc(`/blockchain?minHeight=${minHeight}&maxHeight=${maxHeight}`))
export const getRpcValidators = ({ height }) => (getRpc(`/validators?height=${height}`))
// 获取最新高度
export const getRpcAbciInfo = () => (getRpc('/abci_info'))
// LCD ===
// node info
// Auth
export const getAuthAccounts = ({ address }) => (get(`/auth/accounts/${address}`))
export const getValidatorsetsLatest = () => (get('/validatorsets/latest'))
// Blocks
export const getBlocksLatest = () => (get('/blocks/latest'))
export const getBlocksHeight = ({ height }) => (get(`/blocks/${height}`))
// Distribution
export const getDistributionParameters = () => (get('/params?module=distr'))
// Gov
export const getGovParametersDeposit = () => (false) //(get('/gov/parameters/deposit'))
export const getGovParametersVoting = () => (false)// (get('/gov/parameters/voting'))
export const getGovParametersTallying = () => (false) //(get('/gov/parameters/tallying'))
export const getGovProposals = () => (get('/gov/proposals'))
export const getGovProposalsId = ({ id }) => (get(`/gov/proposals/${id}`))
export const getGovProposalsDeposits = ({ proposalId }) => (get(`/gov/proposals/${proposalId}/deposits`))
export const getGovProposalsVotes = ({ proposalId }) => (get(`/gov/proposals/${proposalId}/votes`))
// Slashing
export const getSlashingParameters = () => (get('/params?module=slashing'))
export const getSlashingValidatorsSigningInfo = ({ validatorAddress }) => (get(`/slashing/validators/${validatorAddress}/signing-info`))
export const getSupplyTotal = () => (get('/supply/total'))
export const getStakingPool = () => (get('/stake/pool'))
export const getStakingParameters = () => (get('/stake/parameters'))
export const getStakingValidators = ({ status }) => {
  const requests = [
    get(`/stake/validators?page=1&size=100`),
    get(`/stake/validators?page=2&size=100`),
    get(`/validatorsets/latest`)
  ]
  if (!status) {
    status = 'bonded'
  }
  return {
    type: 'array',
    params: {
      status
    },
    requests
  }
}
export const getStakingValidatorsObj = ({ status }) => {
  return {
    type: 'array',
    requests: [
      get(`/stake/validators?page=1&size=100`),
      get(`/stake/validators?page=2&size=100`),
    ]
  }
}
export const getStakingValidatorsValidatorAddress = ({ validatorAddress }) => (get(`/stake/validators/${validatorAddress}`))
export const getStakingValidatorsDelegations = ({ validatorAddress }) => (get(`/stake/validators/${validatorAddress}/delegations`))
// Minting
export const getMintingParameters = () => (get('/params?module=mint'))
export const getMintingInflation = () => (get('/params?module=mint'))
export const getMintingAnnualProvisionsn = () => (false)// (get('/minting/annual-provisions'))
// Node
export const getNodeInfo = () => (get('/node_info'))
export const getNodeInfoRes = () => (get('/node-info'))
// Tx
export const getTxs = ({ height }) => {
  const config = get('/txs')
  config.params = {
    'tx.height': height
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

