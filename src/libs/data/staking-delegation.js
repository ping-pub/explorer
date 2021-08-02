export default class StakingDelegation {
  constructor() {
    this.delegation = {}
    this.balance = {}
  }

  static create(element) {
    const self = new StakingDelegation()
    self.delegation = element.delegation
    self.balance = element.balance
    return self
  }
}
