export default class StakingPool {
  constructor() {
    this.element = null
    this.bondedToken = 0
    this.notBondedToken = 0
  }

  init(element) {
    this.element = element
    this.bondedToken = Number(element.bonded_tokens)
    this.notBondedToken = Number(element.not_bonded_tokens)
    return this
  }

  total() {
    return this.bondedToken + this.notBondedToken
  }

  bondedRatio() {
    return (this.bondedToken * 100) / this.total()
  }
}
