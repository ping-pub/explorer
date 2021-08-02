export default class BlockData {
  constructor() {
    this.txs = []
  }

  static create(element) {
    const self = new BlockData()
    self.txs = element.txs
    return self
  }
}
