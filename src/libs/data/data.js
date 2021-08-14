import {
  Bech32, fromBase64, fromHex, toHex,
} from '@cosmjs/encoding'
import { sha256 } from '@cosmjs/crypto'
// ledger
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
// import Cosmos from '@ledgerhq/hw-app-cosmos'
import CosmosApp from 'ledger-cosmos-js'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(localeData)
dayjs.extend(duration)
dayjs.extend(relativeTime)

export async function connectLedger(transport = 'usb') {
  const trans = await transport === 'usb' ? TransportWebUSB.create() : TransportWebBLE.create()
  return new CosmosApp(trans)
}
const COSMOS_PATH = [44, 118, 0, 0, 0]

export async function getLedgerAddress(transport = 'blu') {
  const trans = transport === 'usb' ? await TransportWebUSB.create() : await TransportWebBLE.create()

  trans.setDebugMode(true)
  const cosmos = new CosmosApp(trans)
  return cosmos.getAddressAndPubKey(COSMOS_PATH, 'cosmos')
}

export function getLocalObject(name) {
  const text = localStorage.getItem(name)
  if (text) {
    return JSON.parse(text)
  }
  return null
}

export function getLocalChains() {
  return getLocalObject('chains')
}

export function getLocalAccounts() {
  return getLocalObject('accounts')
}

export function toDuration(value) {
  return dayjs.duration(value).humanize()
}

export function toDay(time, format = 'long') {
  if (format === 'long') {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  }
  if (format === 'date') {
    return dayjs(time).format('YYYY-MM-DD')
  }
  if (format === 'time') {
    return dayjs(time).format('HH:mm:ss')
  }
  if (format === 'from') {
    return dayjs(time).fromNow()
  }
  if (format === 'to') {
    return dayjs(time).toNow()
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export function percent(num) {
  return parseFloat((num * 100).toFixed(2))
}

export function abbr(string, length = 6, suffix = '...') {
  if (string && string.length > length) {
    return `${string.substring(0, length)}${suffix}`
  }
  return string
}

export function abbrRight(string, length = 6, suffix = '...') {
  if (string && string.length > length) {
    return `${string.substring(string.length - length)}${suffix}`
  }
  return string
}

export function abbrMessage(msg) {
  if (Array.isArray(msg)) {
    return msg.map(x => abbrMessage(x)).join(', ')
  }
  return msg.typeUrl.substring(msg.typeUrl.lastIndexOf('.') + 1).replace('Msg', '')
}

export function isStringArray(value) {
  let is = false
  if (Array.isArray(value)) {
    is = value.findIndex(x => typeof x === 'string') > -1
  }
  return is
}

export function isToken(value) {
  let is = false
  if (Array.isArray(value)) {
    is = value.findIndex(x => Object.keys(x).includes('denom')) > -1
  }
  return is
}

export function formatTokenDenom(tokenDenom) {
  if (tokenDenom) {
    let denom = tokenDenom.toUpperCase()
    if (denom.charAt(0) === 'U') {
      denom = denom.substring(1)
    } else if (denom === 'BASECRO') {
      denom = 'CRO'
    }
    return denom
  }
  return tokenDenom
}

export function formatTokenAmount(tokenAmount, fraction = 2, denom = 'uatom') {
  if (denom.startsWith('u')) {
    // for special case
  }
  const amount = tokenAmount / 1000000
  if (amount > 10) {
    return parseFloat(amount.toFixed(fraction))
  }
  return parseFloat(amount)
}

export function formatToken(token) {
  if (token) {
    return `${formatTokenAmount(token.amount, 2, token.denom)} ${formatTokenDenom(token.denom)}`
  }
  return token
}

const COUNT_ABBRS = ['', 'K', 'M', 'B', 't', 'q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'T', 'Qt', 'Qd', 'Sd', 'St']

export function formatNumber(count, withAbbr = false, decimals = 2) {
  const i = count === 0 ? count : Math.floor(Math.log(count) / Math.log(1000))
  let result = parseFloat((count / (1000 ** i)).toFixed(decimals))
  if (withAbbr && COUNT_ABBRS[i]) {
    result += `${COUNT_ABBRS[i]}`
  }
  return result
}

export function tokenFormatter(tokens) {
  if (Array.isArray(tokens)) {
    return tokens.map(t => formatToken(t)).join()
  }
  return formatToken(tokens)
}

export function operatorAddressToAccount(operAddress) {
  const { prefix, data } = Bech32.decode(operAddress)
  if (prefix === 'iva') { // handle special cases
    return Bech32.encode('iaa', data)
  }
  if (prefix === 'crocncl') { // handle special cases
    return Bech32.encode('cro', data)
  }
  return Bech32.encode(prefix.replace('valoper', ''), data)
}

// TODO, not tested
export function pubkeyToAccountAddress(pubkey, prefix) {
  return Bech32.encode(prefix, pubkey, 40)
}

export function addressDecode(address) {
  return Bech32.decode(address)
}

export function addressEnCode(prefix, pubkey) {
  return Bech32.encode(prefix, pubkey)
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

export function getCachedValidators(chainName) {
  const locals = localStorage.getItem(`validators-${chainName}`)
  return locals
}

export function isHexAddress(v) {
  const re = /^[A-Z\d]{40}$/
  return re.test(v)
}

export function getStakingValidatorByHex(chainName, hex) {
  const locals = localStorage.getItem(`validators-${chainName}`)
  if (locals) {
    const val = JSON.parse(locals).find(x => consensusPubkeyToHexAddress(x.consensus_pubkey) === hex)
    if (val) {
      return val.description.moniker
    }
  }
  return abbr(hex)
}

export function getStakingValidatorByAccount(chainName, addr) {
  const locals = localStorage.getItem(`validators-${chainName}`)
  if (locals) {
    const val = JSON.parse(locals).find(x => operatorAddressToAccount(x.operator_address) === addr)
    if (val) {
      return val.description.moniker
    }
  }
  return addr
}

export * from 'compare-versions'

export class Data {

}
