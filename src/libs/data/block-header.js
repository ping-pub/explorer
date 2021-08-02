import BlockId from './block-id'

export default class BlockHeader {
  constructor() {
    this.version = {
      block: '0',
    }
    this.chain_id = ''
    this.height = 0
    this.time = '2021-08-02T01:12:43.42506492Z'
    this.last_block_id = new BlockId()
    this.last_commit_hash = ''
    this.data_hash = ''
    this.validators_hash = ''
    this.next_validators_hash = ''
    this.consensus_hash = ''
    this.app_hash = ''
    this.last_results_hash = ''
    this.evidence_hash = ''
    this.proposer_address = ''
  }

  static create(element) {
    const self = new BlockHeader()
    self.version = element.version
    self.chain_id = element.chain_id
    self.height = element.height
    self.time = element.time
    self.last_block_id = element.last_block_id
    self.last_commit_hash = element.last_commit_hash
    self.data_hash = element.data_hash
    self.validators_hash = element.validators_hash
    self.next_validators_hash = element.next_validators_hash
    self.consensus_hash = element.consensus_hash
    self.app_hash = element.app_hash
    self.last_results_hash = element.last_results_hash
    self.evidence_hash = element.evidence_hash
    self.proposer_address = element.proposer_address
    return self
  }
}
