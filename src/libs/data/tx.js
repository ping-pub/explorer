import { sha256 } from '@cosmjs/crypto'
import { fromBase64, toHex } from '@cosmjs/encoding'
import Token from './token'

export default class Tx {
  constructor() {
    this.hash = ''
    this.fee = [new Token()]
    this.memo = ''
    this.messages = []
    this.signatures = []
    this.time = null
  }

  static create(element) {
    const self = new Tx()
    self.hash = ''
    self.fee = element.authInfo.fee.amount
    self.memo = element.body.memo
    self.messages = element.body.messages
    self.signatures = element.signatures
    return self
  }

  setHash(raw) {
    this.hash = toHex(sha256(fromBase64(raw))).toUpperCase()
  }
}
