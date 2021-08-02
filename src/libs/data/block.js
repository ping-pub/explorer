import BlockId from './block-id'
import BlockInner from './block-inner'

export default class Block {
  constructor() {
    this.block_id = new BlockId()
    this.block = new BlockInner()
  }

  static create(element) {
    const self = new Block()
    self.block_id = BlockId.create(element.block_id)
    self.block = BlockInner.create(element.block)
    return self
  }
}
