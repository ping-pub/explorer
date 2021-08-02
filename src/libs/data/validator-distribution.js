import compareVersions from 'compare-versions'

export default class ValidatorDistribution {
  constructor() {
    this.element = {}
    this.operator_address = ''
    this.self_bond_rewards = []
    this.val_commission = []
  }

  static create(element) {
    const self = new ValidatorDistribution()
    self.element = element
    self.operator_address = element.operator_address
    self.self_bond_rewards = element.self_bond_rewards
    self.val_commission = element.val_commission
    return self
  }

  versionFixed(ver) {
    if (compareVersions(ver, '0.40') >= 0) {
      this.val_commission = this.element.val_commission.commission
    }
  }
}
