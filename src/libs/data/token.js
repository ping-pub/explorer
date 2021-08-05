export default class Token {
  constructor() {
    this.amount = 0
    this.denom = ''
  }

  static create(element) {
    const self = new Token()
    self.amount = Number(element.amount)
    self.denom = element.denom
    return self
  }
}
