import ValidatorCommission from './validator-commission'
import ValidatorDescription from './valdiator-description'

export default class Validator {
  constructor() {
    this.operator_address = 'cosmosvaloper16xyempempp92x9hyzz9wrgf94r6j9h5f2w4n2l'
    this.consensus_pubkey = 'cosmosvalconspub1zcjduepq0vu2zgkgk49efa0nqwzndanq5m4c7pa3u4apz4g2r9gspqg6g9cs3k9cuf'
    this.jailed = true
    this.status = 0
    this.tokens = 0
    this.delegator_shares = 0
    this.description = new ValidatorDescription()
    this.bond_height = 0
    this.bond_intra_tx_counter = 0
    this.unbonding_height = 0
    this.unbonding_time = '1970-01-01T00:00:00Z'
    this.commission = new ValidatorCommission()
    this.min_self_delegation = 1
  }

  init(element) {
    this.operator_address = element.operator_address
    this.consensus_pubkey = element.consensus_pubkey
    this.jailed = element.jailed
    this.status = element.status
    this.tokens = Number(element.tokens)
    this.delegator_shares = Number(element.delegator_shares)
    this.description = new ValidatorDescription().init(element.description)
    this.bond_height = Number(element.bond_height)
    this.bond_intra_tx_counter = element.bond_intra_tx_counter
    this.unbonding_height = element.unbonding_height
    this.unbonding_time = element.unbonding_time
    this.commission = new ValidatorCommission().init(element.commission)
    this.min_self_delegation = element.min_self_delegation
    return this
  }
}
