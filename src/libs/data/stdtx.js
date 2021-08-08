import compareVersions from 'compare-versions'
import Token from './token'

export default class StdTx {
  constructor() {
    this.type = ''
    this.fee = [new Token()]
    this.gas = 0
    this.memo = ''
    this.messages = null
    this.signatures = []
    this.timeout_height = 0
  }

  static create(element, version = '0.40') {
    const self = new StdTx()
    if (compareVersions(version, '0.40') < 1) {
      self.type = element.type
      self.fee = element.value.fee.amount
      self.gas = element.value.fee.gas
      self.memo = element.value.memo
      self.messages = element.value.msg
      self.signatures = element.value.signatures
      self.timeout_height = 0
    } else {
      self.type = element['@type']
      self.fee = element.auth_info.fee.amount
      self.gas = element.auth_info.fee.gas_limit
      self.memo = element.body.memo
      self.messages = element.body.messages
      self.signatures = element.signatures
      self.timeout_height = element.body.timeout_height
    }
    return self
  }
}
