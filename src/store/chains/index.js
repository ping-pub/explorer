/*
 * @Description: file
 * @Autor: dingyiming
 * @Date: 2021-11-20 15:26:27
 * @LastEditors: dingyiming
 * @LastEditTime: 2021-11-20 15:33:07
 */
import { isTestnet } from '@/libs/utils'
import { sha256 } from '@cosmjs/crypto'
import { toHex } from '@cosmjs/encoding'

let chains = {}

let configs = require.context('../../chains/mainnet', false, /\.json$/)
if (isTestnet()) {
  configs = require.context('../../chains/testnet', false, /\.json$/)
}

const update = {}
configs.keys().forEach(k => {
  const c = configs(k)
  update[c.chain_name] = c
})

chains = update
localStorage.setItem('chains', JSON.stringify(update))
const selected = chains.cosmos

const avatarcache = localStorage.getItem('avatars')

export default {
  namespaced: true,
  state: {
    config: chains,
    selected,
    avatars: avatarcache ? JSON.parse(avatarcache) : {},
    height: 0,
    ibcChannels: {},
    quotes: {},
    defaultWallet: localStorage.getItem('default-wallet'),
    denoms: {},
  },
  getters: {
    getchains: state => state.chains,
    getAvatarById: state => id => state.avatars[id],
  },
  mutations: {
    setup_sdk_version(state, info) {
      state.chains.config[info.chain_name].sdk_version = info.version
    },
    select(state, args) {
      state.chains.selected = state.chains.config[args.chain_name]
    },
    cacheAvatar(state, args) {
      state.chains.avatars[args.identity] = args.url
      localStorage.setItem('avatars', JSON.stringify(state.chains.avatars))
    },
    setHeight(state, height) {
      state.chains.height = height
    },
    setChannels(state, { chain, channels }) {
      state.chains.ibcChannels[chain] = channels
    },
    setQuotes(state, quotes) {
      state.quotes = quotes
    },
    setDefaultWallet(state, defaultWallet) {
      if (defaultWallet && defaultWallet.length > 0) {
        localStorage.setItem('default-wallet', defaultWallet)
        state.chains.defaultWallet = defaultWallet
      }
    },
    setIBCDenoms(state, denoms) {
      state.denoms = denoms
    },
  },
  actions: {
    async getQuotes(context) {
      fetch('https://price.ping.pub/quotes').then(data => data.json()).then(data => {
        context.commit('setQuotes', data)
      })
    },

    async getAllIBCDenoms(context) {
      this.$http.getAllIBCDenoms().then(x => {
        const denomsMap = {}
        x.denom_traces.forEach(trace => {
          const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
          denomsMap[`ibc/${hash.toUpperCase()}`] = trace.base_denom
          // this.$set(this.denoms, `ibc/${hash.toUpperCase()}`, trace.base_denom)
        })
        context.commit('setIBCDenoms', denomsMap)
      })
    },
  },
}
