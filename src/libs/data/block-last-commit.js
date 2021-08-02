import BlockId from './block-id'
import Signature from './signature'

export default class BlockLastCommit {
  constructor() {
    this.height = 0
    this.round = 0
    this.block_id = new BlockId()
    this.signatures = []
  }

  static create(element) {
    const self = new BlockLastCommit()
    self.height = Number(element.height)
    self.round = Number(element.round)
    self.block_id = element.block_id
    self.signatures = element.signatures.map(x => Signature.create(x))
    return self
  }
}
