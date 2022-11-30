export default class ProposalTally {
  constructor() {
    this.total = 0
    this.yes = 0
    this.no = 0
    this.veto = 0
    this.abstain = 0
    this.turnout = 0
  }

  init(element, total) {
    const subtotal = Number(element.yes || element.yes_count) + Number(element.no || element.no_count) + Number(element.abstain || element.abstain_count) + Number(element.no_with_veto || element.no_with_veto_count)
    if (total < 1) {
      this.total = subtotal + 1
    } else {
      this.total = total
    }
    this.yes = Number(element.yes || element.yes_count) / this.total
    this.no = Number(element.no || element.no_count) / this.total
    this.veto = Number(element.no_with_veto || element.no_with_veto_count) / this.total
    this.abstain = Number(element.abstain || element.abstain_count) / this.total
    this.turnout = subtotal / this.total
    return this
  }

  total() {
    return this.total
  }
}
