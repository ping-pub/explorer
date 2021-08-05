export default class Proposer {
  constructor() {
    this.proposal_id = ''
    this.proposer = ''
  }

  init(element) {
    if (element != null) {
      this.proposal_id = element.proposal_id
      this.proposer = element.proposer
    }
    return this
  }
}
