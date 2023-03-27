import {fromBase64, fromBech32, fromHex, toBase64, toBech32, toHex} from '@cosmjs/encoding'
import { Ripemd160, sha256 } from '@cosmjs/crypto'
import { cosmos } from '@ping-pub/codegen'
import type { PubKey } from '@ping-pub/codegen/src/cosmos/crypto/ed25519/keys'

export function decodeAddress(address: string) {
    return fromBech32(address)
}

export function valoperToPrefix(valoper?: string) {
    if(!valoper) return ''
    const prefixIndex = valoper.indexOf('valoper')
    if (prefixIndex === -1) return null
    return valoper.slice(0, prefixIndex)
  }
  
  export function operatorAddressToAccount(operAddress?: string) {
    if(!operAddress) return ''
    const { prefix, data } = fromBech32(operAddress)
    if (prefix === 'iva') { // handle special cases
      return toBech32('iaa', data)
    }
    if (prefix === 'crocncl') { // handle special cases
      return toBech32('cro', data)
    }
    return toBech32(prefix.replace('valoper', ''), data)
  }
  
  export function decodeKey(consensusPubkey: {typeUrl: string, value: Uint8Array}) {
    let raw = null
    if (consensusPubkey.typeUrl === '/cosmos.crypto.ed25519.PubKey') {
      const pubkey = cosmos.crypto.ed25519.PubKey.decode(consensusPubkey.value)
      return pubkey
    }
  
    if (consensusPubkey.typeUrl === '/cosmos.crypto.secp256k1.PubKey') {
      const pubkey = cosmos.crypto.secp256k1.PubKey.decode(consensusPubkey.value)
      return pubkey
    }
    return raw
  
  }
export function consensusPubkeyToHexAddress(consensusPubkey?: {typeUrl: string, value: Uint8Array}) {
  if(!consensusPubkey) return ""
  let raw = ""
  if (consensusPubkey.typeUrl === '/cosmos.crypto.ed25519.PubKey') {
    const pubkey = decodeKey(consensusPubkey)   
    if(pubkey) return toHex(sha256(pubkey.key)).slice(0, 40).toUpperCase()
  }

  if (consensusPubkey.typeUrl === '/cosmos.crypto.secp256k1.PubKey') {
    const pubkey = decodeKey(consensusPubkey)
    if(pubkey) return toHex(new Ripemd160().update(sha256(pubkey.key)).digest())
  }
  return raw

}

  export function pubKeyToValcons(consensusPubkey: {typeUrl: string, value: Uint8Array}, prefix: string) {
    const pubkey = decodeKey(consensusPubkey)
    if(pubkey) {
      const addressData = sha256(pubkey.key).slice(0, 20)
      return toBech32(`${prefix}valcons`, addressData)
    }
  }
  
  export function toETHAddress(cosmosAddress: string) {
    return `0x${toHex(fromBech32(cosmosAddress).data)}`
  }
  
  export function addressEnCode(prefix: string, pubkey: Uint8Array) {
    return toBech32(prefix, pubkey)
  }