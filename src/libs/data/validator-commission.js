export default class ValidatorCommission {
  constructor() {
    this.rate = '0'
    this.max_rate = '0'
    this.max_change_rate = '0'
    this.update_time = '1970-01-01T00:00:00Z'
  }

  init(element) {
    if (element != null) {
      this.rate = element.commission_rates.rate
      this.max_rate = element.commission_rates.max_rate
      this.max_change_rate = element.commission_rates.max_change_rate
      this.update_time = element.update_time
    }
    return this
  }
}
