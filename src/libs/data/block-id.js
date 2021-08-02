export default class BlockId {
  constructor() {
    this.hash = ''
    this.parts = { total: 0, hash: '' }
  }

  static create(element) {
    const self = new BlockId()
    self.hash = element.hash
    self.parts = element.parts
    return self
  }
}
