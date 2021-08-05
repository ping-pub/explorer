export default class Deposit {
  constructor() {
    this.proposal_id = ''
    this.depositor = ''
    this.amount = ''
  }

  init(element) {
    this.proposal_id = element.proposal_id
    this.depositor = element.depositor
    this.amount = element.amount
    return this
  }
}
