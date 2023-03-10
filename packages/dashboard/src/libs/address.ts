import {fromBase64, fromBech32, toBech32, toHex} from '@cosmjs/encoding'
import { sha256 } from '@cosmjs/crypto'

export function decodeAddress(address: string) {
    return fromBech32(address)
}

export function valoperToPrefix(valoper: string) {
    const prefixIndex = valoper.indexOf('valoper')
    if (prefixIndex === -1) return null
    return valoper.slice(0, prefixIndex)
  }
  
  export function operatorAddressToAccount(operAddress: string) {
    const { prefix, data } = fromBech32(operAddress)
    if (prefix === 'iva') { // handle special cases
      return toBech32('iaa', data)
    }
    if (prefix === 'crocncl') { // handle special cases
      return toBech32('cro', data)
    }
    return toBech32(prefix.replace('valoper', ''), data)
  }
  
  export function pubKeyToValcons(pubkey: string, prefix: string) {
    const addressData = sha256(fromBase64(pubkey.key)).slice(0, 20)
    return toBech32(`${prefix}valcons`, addressData)
  }
  
  export function toETHAddress(cosmosAddress: string) {
    return `0x${toHex(fromBech32(cosmosAddress).data)}`
  }
  
  export function addressEnCode(prefix: string, pubkey: Uint8Array) {
    return toBech32(prefix, pubkey)
  }