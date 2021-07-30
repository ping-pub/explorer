import { percent } from './data'

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
    this.yes = percent(Number(element.yes) / this.total)
    this.no = percent(Number(element.no) / this.total)
    this.veto = percent(Number(element.no_with_veto) / this.total)
    this.abstain = percent(Number(element.abstain) / this.total)
    this.turnout = percent(subtotal / this.total)
    return this
  }

  total() {
    return this.total
  }
}
