import BlockData from './block-data'
import BlockHeader from './block-header'
import BlockLastCommit from './block-last-commit'

export default class BlockInner {
  constructor() {
    this.header = new BlockHeader()
    this.data = new BlockData()
    this.evidence = { evidence: [] }
    this.last_commit = new BlockLastCommit()
  }

  static create(element) {
    const self = new BlockInner()
    self.header = BlockHeader.create(element.header)
    self.data = BlockData.create(element.data)
    self.evidence = element.evidence
    self.last_commit = BlockLastCommit.create(element.last_commit)
    return self
  }
}
