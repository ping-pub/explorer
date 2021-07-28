import { percent } from './data'

export default class ProposalTally {
  constructor(element, total) {
    this.yes = percent(Number(element.yes) / total)
    this.no = percent(Number(element.no) / total)
    this.veto = percent(Number(element.no_with_veto) / total)
    this.abstain = percent(Number(element.abstain) / total)
    this.turnout = percent((Number(element.yes) + Number(element.no) + Number(element.abstain) + Number(element.no_with_veto)) / total)
    this.total = total
  }

  total() {
    return this.total
  }
}
