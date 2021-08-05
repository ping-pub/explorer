export default class Votes {
  constructor() {
    this.proposal_id = 0
    this.voter = ''
    this.option = ''
  }

  init(element) {
    this.proposal_id = element.proposal_id
    this.voter = element.voter
    this.option = element.option
    return this
  }
}
