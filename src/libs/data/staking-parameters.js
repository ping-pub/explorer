export default class StakingParameters {
  constructor() {
    this.max_entries = 0
    this.historical_entries = 0
    this.unbonding_time = ''
    this.max_validators = 0
    this.bond_denom = ''
  }

  static create(element, chain = '') {
    const self = new StakingParameters()
    if (element != null) {
      if (chain === 'okexchain') {
        // self = element
        self.unbonding_time = element.unbonding_time
        self.max_validators = Number(element.max_bonded_validators)
        self.bond_denom = 'OKT'
      } else {
        self.max_entries = Number(element.max_entries)
        self.historical_entries = Number(element.historical_entries)
        self.unbonding_time = element.unbonding_time
        self.max_validators = Number(element.max_validators)
        self.bond_denom = element.bond_denom
      }
    }
    return self
  }
}
