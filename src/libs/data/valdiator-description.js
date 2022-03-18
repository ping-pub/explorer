export default class ValidatorDescription {
  constructor() {
    this.moniker = 'razumv | DOUBLE TOP'
    this.identity = '0DD21F2C7157838C'
    this.website = 'https://doubletop.io'
    this.security_contact = 'string'
    this.details = 'string'
  }

  init(element) {
    if (element != null) {
      this.moniker = element.moniker
      this.identity = element.identity
      this.website = element.website
      this.security_contact = element.security_contact
      this.details = element.details
    }
    return this
  }
}
