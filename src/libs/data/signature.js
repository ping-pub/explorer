export default class Signature {
  constructor() {
    this.block_id_flag = 2
    this.validator_address = ''
    this.timestamp = ''
    this.signature = ''
  }

  static create(element) {
    const self = new Signature()
    self.block_id_flag = element.block_id_flag
    self.validator_address = element.validator_address
    self.timestamp = element.timestamp
    self.signature = element.signature
    return self
  }
}
