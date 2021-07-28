import { percent } from './data'

export default class StakingPool {
  constructor(element) {
    this.element = element
    this.bondedToken = Number(element.bonded_tokens)
    this.notBondedToken = Number(element.not_bonded_tokens)
  }

  total() {
    return this.bondedToken + this.notBondedToken
  }

  bondedRatio() {
    return percent((this.bondedToken * 100) / this.total)
  }
}
