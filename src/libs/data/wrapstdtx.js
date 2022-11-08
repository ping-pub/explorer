import compareVersions from 'compare-versions'
import StdTx from './stdtx'

export default class WrapStdTx {
  constructor() {
    this.std = true
    this.code = 0
    this.txhash = ''
    this.data = ''
    this.gas_used = ''
    this.gas_wanted = ''
    this.height = 0
    this.logs = []
    this.timestamp = ''
    this.tx = new StdTx()
    this.info = ''
    this.raw_log = ''
  }

  static create(element, version = '0.40') {
    const self = new WrapStdTx()
    if (compareVersions(version, '0.40') < 1) {
      if (element.txhash) {
        self.txhash = element.txhash
        self.data = element.data
        self.gas_used = element.gas_used
        self.gas_wanted = element.gas_wanted
        self.height = Number(element.height)
        self.logs = element.logs
        self.timestamp = element.timestamp
        self.tx = StdTx.create(element.tx)
      } else {
        self.std = false
        self.raw = element
      }
    } else {
      self.code = element.tx_response.code
      self.txhash = element.tx_response.txhash
      self.data = element.tx_response.data
      self.gas_used = element.tx_response.gas_used
      self.gas_wanted = element.tx_response.gas_wanted
      self.height = Number(element.tx_response.height)
      self.info = element.tx_response.info
      self.logs = element.tx_response.logs
      self.timestamp = element.tx_response.timestamp
      self.tx = StdTx.create(element.tx, version)
      self.raw_log = element.tx_response.raw_log
    }
    self.element = element
    return self
  }
}
