export default class StakingParameters {
  constructor() {
    this.max_entries = 0
    this.historical_entries = 0
    this.unbonding_time = ''
    this.max_validators = 0
    this.bond_denom = ''
  }

  init(element) {
    if (element != null) {
      this.max_entries = Number(element.max_entries)
      this.historical_entries = Number(element.historical_entries)
      this.unbonding_time = element.unbonding_time
      this.max_validators = Number(element.max_validators)
      this.bond_denom = element.bond_denom
    }
    return this
  }
}
