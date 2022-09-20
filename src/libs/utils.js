import {
  Bech32, fromBase64, fromBech32, fromHex, toBase64, toBech32, toHex,
} from '@cosmjs/encoding'
import { sha256, stringToPath } from '@cosmjs/crypto'
// ledger
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import CosmosApp from 'ledger-cosmos-js'
import { LedgerSigner } from '@cosmjs/ledger-amino'
import { ethToEvmos } from '@tharsis/address-converter'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import RIPEMD160 from 'ripemd160'
import localeData from 'dayjs/plugin/localeData'
import { $themeColors } from '@themeConfig'
// import { SigningStargateClient } from '@cosmjs/stargate'
// import PingWalletClient from './data/signing'
import { SigningStargateClient } from '@cosmjs/stargate'
import { getSigningClient } from './client/SigningEthermintClient.ts'
import EthereumLedgerSigner from './client/EthereumLedgerSigner.ts'
import SigningKeplerEthermintClient from './client/SigningKeplrEthermintClient'

dayjs.extend(localeData)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
})

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

export function getLocalTxHistory() {
  return getLocalObject('txHistory')
}

export function setLocalTxHistory(tx) {
  const newTx = tx
  const txs = getLocalTxHistory()
  if (txs) {
    txs.push(newTx)
    return localStorage.setItem('txHistory', JSON.stringify(txs))
  }
  return localStorage.setItem('txHistory', JSON.stringify([newTx]))
}

export async function connectLedger(transport = 'usb') {
  const trans = await transport === 'usb' ? TransportWebUSB.create() : TransportWebBLE.create()
  return new CosmosApp(trans)
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

export function toETHAddress(cosmosAddress) {
  return `0x${toHex(fromBech32(cosmosAddress).data)}`
}

export function addressDecode(address) {
  if (address.startsWith('0x')) {
    return fromBech32(ethToEvmos(address))
  }
  return fromBech32(address)
}

export function addressEnCode(prefix, pubkey) {
  return toBech32(prefix, pubkey)
}

export function getUserCurrency() {
  const currency = localStorage.getItem('currency')
  return currency || 'usd'
}

export function setUserCurrency(currency) {
  localStorage.setItem('currency', currency)
}

export function chartColors() {
  const colors = [
    '#8A2BE2', '#9ACD32', '#000080', '#008080', '#DC143C',
    '#7FFFD4', '#B8860B', '#EEE8AA', '#FFFAFA', '#FDF5E6',
    '#C0C0C0', '#E6E6FA', '#FFFAF0', '#2E8B57', '#DCDCDC',
    '#FF1493', '#4682B4', '#191970', '#FF8C00', '#FFFFE0',
    '#696969', '#FFFACD', '#DEB887', '#4169E1', '#9932CC',
    '#B0C4DE', '#556B2F', '#FFE4E1', '#F5FFFA', '#8FBC8F',
    '#B22222', '#90EE90', '#FFFF00', '#4B0082', '#DB7093',
    '#F8F8FF', '#006400', '#6610f2', '#FFA500', '#7FFF00',
    '#87CEFA', '#5F9EA0', '#483D8B', '#CD5C5C', '#ADFF2F',
    '#2F4F4F', '#00FF7F', '#FFF5EE', '#F4A460', '#808000',
    '#000000', '#00FA9A', '#000000', '#EE82EE', '#F5DEB3',
    '#0000FF', '#BA55D3', '#FFF0F5', '#F5F5DC', '#0000CD',
    '#FFD700', '#708090', '#6B8E23', '#800000', '#7B68EE',
    '#FFA07A', '#800080', '#B0E0E6', '#00FFFF', '#00BFFF',
    '#7CFC00', '#778899', '#FF7F50', '#E0FFFF', '#6495ED',
    '#008B8B', '#DDA0DD', '#CD853F', '#FFFFF0', '#98FB98',
    '#9400D3', '#D2691E', '#FF0000', '#008000', '#00008B',
    '#C71585', '#FFB6C1', '#8B4513', '#20c997', '#FAEBD7',
    '#E9967A', '#FFEFD5', '#FFE4C4', '#D8BFD8', '#A52A2A',
    '#8B0000', '#32CD32', '#BDB76B', '#FF0000', '#DAA520',
    '#800000', '#9370DB', '#F08080', '#FAF0E6', '#FF6347',
    '#FF4500', '#FFFF00', '#808080', '#00CED1', '#FFC0CB',
    '#FF00FF', '#F0FFFF', '#A9A9A9', '#F0E68C', '#1E90FF',
    '#FFDAB9', '#228B22', '#F0FFF0', '#66CDAA', '#ADD8E6',
    '#DA70D6', '#A0522D', '#FFE4B5', '#48D1CC', '#D2B48C',
    '#FFEBCD', '#8B008B', '#3CB371', '#87CEEB', '#6A5ACD',
    '#FFDEAD', '#FF69B4', '#BC8F8F', '#D3D3D3', '#00FF00',
    '#FAFAD2', '#AFEEEE', '#40E0D0', '#FFF8DC', '#20B2AA',
    '#00FFFF', '#FA8072', '#F0F8FF']
  return Object.values($themeColors).concat(colors)
}

export function extractAccountNumberAndSequence(ret) {
  let { account } = ret
  if (account && account.base_vesting_account) { // vesting account
    account = account.base_vesting_account?.base_account
  } else if (account && account.base_account) { // evmos based account
    account = account.base_account
  }
  const accountNumber = account.account_number
  const sequence = account?.sequence || 0

  return {
    accountNumber,
    sequence,
  }
}

export function getUserCurrencySign() {
  let s = ''
  switch (getUserCurrency()) {
    case 'cny':
    case 'jpy':
      s = '¥'
      break
    case 'krw':
      s = '₩'
      break
    case 'eur':
      s = '€'
      break
    default:
      s = '$'
  }
  return s
}

export function consensusPubkeyToHexAddress(consensusPubkey) {
  let raw = null
  if (typeof consensusPubkey === 'object') {
    if (consensusPubkey['@type'] === '/cosmos.crypto.ed25519.PubKey') {
      raw = toBase64(fromHex(toHex(sha256(fromBase64(consensusPubkey.key))).slice(0, 40)))
      return raw
    }
    // /cosmos.crypto.secp256k1.PubKey
    if (consensusPubkey['@type'] === '/cosmos.crypto.secp256k1.PubKey') {
      raw = toBase64(fromHex(new RIPEMD160().update(Buffer.from(sha256(fromBase64(consensusPubkey.key)))).digest('hex')))
      return raw
    }
    if (consensusPubkey.type === 'tendermint/PubKeySecp256k1') {
      raw = new RIPEMD160().update(Buffer.from(sha256(fromBase64(consensusPubkey.value)))).digest('hex').toUpperCase()
      return raw
    }
    raw = sha256(fromBase64(consensusPubkey.value))
  } else {
    raw = sha256(fromHex(toHex(fromBech32(consensusPubkey).data).toUpperCase().replace('1624DE6420', '')))
  }
  const address = toHex(raw).slice(0, 40).toUpperCase()
  return address
}

function toSignAddress(addr) {
  const { data } = addressDecode(addr)
  return addressEnCode('cosmos', data)
}

function getHdPath(address) {
  let hdPath = "m/44'/118/0'/0/0"
  Object.values(getLocalAccounts()).forEach(item => {
    const curr = item.address.find(i => i.addr === address)
    if (curr && curr.hdpath) {
      hdPath = curr.hdpath
    }
  })
  //  m/0'/1/2'/2/1000000000
  return stringToPath(hdPath)
}

function isEvmosBasedChain(chainId) {
  const re = /[_]{1}[\d]{4,5}[\\-]{1}[\d]+$/g
  return re.test(chainId)
}

export async function sign(device, chainId, signerAddress, messages, fee, memo, signerData) {
  const hdpath = getHdPath(signerAddress)
  let client
  if (device.startsWith('ledger')) {
    client = await getSigningClient(device, hdpath)
  } else {
    if (!window.getOfflineSigner || !window.keplr) {
      throw new Error('Please install keplr extension')
    }
    await window.keplr.enable(chainId)
    const signer = window.getOfflineSigner(chainId)
    if (isEvmosBasedChain(chainId)) {
      client = await SigningKeplerEthermintClient.offline(signer)
    } else {
      client = await SigningStargateClient.offline(signer)
    }
  }
  const coinType = Number(hdpath[1])
  const addr = device.startsWith('ledger') && coinType !== 60 ? toSignAddress(signerAddress) : signerAddress
  return client.sign(addr, messages, fee, memo, signerData)
}

// import address from ledger
async function getLedgerAppName(coinType, device, hdpath) {
  let ledgerAppName = 'Cosmos'
  switch (coinType) {
    case 60:
      return EthereumLedgerSigner.create(device, hdpath) // 'Ethereum'
    case 529:
      ledgerAppName = 'Secret' // 'Secret'
      break
    case 852:
      ledgerAppName = 'Desmos' // 'Desmos'
      break
    case 330:
      ledgerAppName = 'Terra' // 'Terra'
      break
    case 118:
    default:
  }
  const transport = await (device === 'ledgerBle' ? TransportWebBLE.create() : TransportWebUSB.create())
  return new LedgerSigner(transport, { hdPaths: [hdpath], ledgerAppName })
}

export async function getLedgerAddress(transport = 'blu', hdPath = "m/44'/118/0'/0/0") {
  const protocol = transport === 'usb' ? await TransportWebUSB.create() : await TransportWebBLE.create()
  // extract Cointype from from HDPath
  const coinType = Number(stringToPath(hdPath)[1])
  const signer = await getLedgerAppName(coinType, protocol, stringToPath(hdPath))
  return signer.getAccounts()
}
/// end import address from ledger

export function toDuration(value) {
  return dayjs.duration(value).humanize()
}

// unit(y M d h m s ms)
export function timeIn(time, amount, unit = 's') {
  const input = dayjs(time).add(amount, unit)
  return dayjs().unix() > input.unix()
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
    const sum = msg.map(x => abbrMessage(x)).reduce((s, c) => {
      const sh = s
      if (sh[c]) {
        sh[c] += 1
      } else {
        sh[c] = 1
      }
      return sh
    }, {})
    const output = []
    Object.keys(sum).forEach(k => {
      output.push(sum[k] > 1 ? `${k}×${sum[k]}` : k)
    })
    return output.join(', ')
  }
  if (msg['@type']) {
    return msg['@type'].substring(msg['@type'].lastIndexOf('.') + 1).replace('Msg', '')
  }
  if (msg.typeUrl) {
    return msg.typeUrl.substring(msg.typeUrl.lastIndexOf('.') + 1).replace('Msg', '')
  }
  return msg.type.substring(msg.type.lastIndexOf('/') + 1).replace('Msg', '')
}

export function abbrAddress(address, length = 10) {
  return address.substring(0, length).concat('...', address.substring(address.length - length))
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
  } else {
    is = Object.keys(value).includes('denom')
  }
  return is
}

export function formatTokenDenom(tokenDenom) {
  if (tokenDenom && tokenDenom.code === undefined) {
    let denom = tokenDenom.denom_trace ? tokenDenom.denom_trace.base_denom : tokenDenom
    const chains = getLocalChains()
    const selected = localStorage.getItem('selected_chain')
    const selChain = chains[selected]
    const nativeAsset = selChain.assets.find(a => (a.base === denom))
    if (nativeAsset) {
      denom = nativeAsset.symbol
    } else {
      const config = Object.values(chains)
      config.forEach(x => {
        if (x.assets) {
          const asset = x.assets.find(a => (a.base === denom))
          if (asset) denom = asset.symbol
        }
      })
    }
    return denom.length > 10 ? `${denom.substring(0, 7).toUpperCase()}..${denom.substring(denom.length - 3)}` : denom.toUpperCase()
  }
  return ''
}

export function getUnitAmount(amount, tokenDenom) {
  const denom = tokenDenom.denom_trace ? tokenDenom.denom_trace.base_denom : tokenDenom
  let exp = String(denom).startsWith('gravity') ? 18 : 6
  const config = Object.values(getLocalChains())

  config.forEach(x => {
    if (x.assets) {
      const asset = x.assets.find(a => (a.base === denom))
      if (asset) exp = asset.exponent
    }
  })
  // eslint-disable-next-line no-undef
  return String(BigInt(Number(amount) * (10 ** exp)))
}

export function numberWithCommas(x) {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function formatTokenAmount(tokenAmount, decimals = 2, tokenDenom = 'uatom', format = true) {
  const denom = tokenDenom.denom_trace ? tokenDenom.denom_trace.base_denom : tokenDenom
  let amount = 0
  let exp = String(denom).startsWith('gravity') ? 18 : 6
  const config = Object.values(getLocalChains())

  config.forEach(x => {
    if (x.assets) {
      const asset = x.assets.find(a => (a.base === denom))
      if (asset) exp = asset.exponent
    }
  })
  amount = Number(Number(tokenAmount)) / (10 ** exp)
  if (amount > 10) {
    if (format) { return numberWithCommas(parseFloat(amount.toFixed(decimals))) }
    return parseFloat(amount.toFixed(decimals))
  }
  return parseFloat(amount.toFixed(exp))
}

export function isTestnet() {
  return (window.location.hostname.startsWith('testnet')
    || window.location.search.indexOf('testnet') > -1)
}

export function formatToken(token, IBCDenom = {}, decimals = 2, withDenom = true) {
  if (token) {
    const denom = IBCDenom[token.denom] || token.denom
    if (withDenom) {
      return `${formatTokenAmount(token.amount, decimals, denom)} ${formatTokenDenom(denom)}`
    }
    return formatTokenAmount(token.amount, decimals, denom)
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

export function tokenFormatter(tokens, denoms = {}, decimal = 2) {
  if (Array.isArray(tokens)) {
    return tokens.map(t => formatToken(t, denoms, decimal)).join(', ')
  }
  return formatToken(tokens, denoms, 2)
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

export function getStakingValidatorOperator(chainName, addr, length = -1) {
  const locals = localStorage.getItem(`validators-${chainName}`)
  if (locals) {
    const val = JSON.parse(locals).find(x => x.operator_address === addr)
    if (val) {
      return val.description.moniker
    }
  }
  if (length > 0) {
    return addr.substring(addr.length - length)
  }
  return addr
}

export * from 'compare-versions'

export * from './data'
export class Data {

}
