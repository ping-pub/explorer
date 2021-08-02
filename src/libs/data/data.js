import dayjs from 'dayjs'
import {
  Bech32, fromBase64, fromHex, toHex,
} from '@cosmjs/encoding'
import { sha256 } from '@cosmjs/crypto'

export function toDay(time) {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

export function percent(num) {
  return parseFloat((num * 100).toFixed(2))
}

export function formatToken(token) {
  let denom = token.denom.toUpperCase()
  if (denom.charAt(0) === 'U') {
    denom = denom.substring(1)
  }
  return `${(token.amount / 1000000).toFixed()} ${denom}`
}

export function tokenFormatter(tokens) {
  if (Array.isArray(tokens)) {
    return tokens.map(t => formatToken(t))
  }
  return formatToken(tokens)
}

export function operatorAddressToAccount(operAddress) {
  const { prefix, data } = Bech32.decode(operAddress)
  return Bech32.encode(prefix.replace('valoper', ''), data)
}

export function consensusPubkeyToHexAddress(consensusPubkey) {
  let raw = null
  if (typeof consensusPubkey === 'object') {
    raw = toHex(fromBase64(consensusPubkey.value))
  } else {
    raw = toHex(Bech32.decode(consensusPubkey).data).toUpperCase().replace('1624DE6420', '')
  }
  const address = toHex(sha256(fromHex(raw))).slice(0, 40).toUpperCase()
  return address
}

export * from 'compare-versions'

export class Data {

}
