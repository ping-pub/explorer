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
    const subtotal = Number(element.yes) + Number(element.no) + Number(element.abstain) + Number(element.no_with_veto)
    if (total < 1) {
      this.total = subtotal + 1
    } else {
      this.total = total
    }
    this.yes = Number(element.yes) / this.total
    this.no = Number(element.no) / this.total
    this.veto = Number(element.no_with_veto) / this.total
    this.abstain = Number(element.abstain) / this.total
    this.turnout = subtotal / this.total
    return this
  }

  total() {
    return this.total
  }
}
