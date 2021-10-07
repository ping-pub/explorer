let chains = {}

const configs = require.context('.', false, /\.json$/)

const update = {}
configs.keys().forEach(k => {
  const c = configs(k)
  update[c.chain_name] = c
})

// const localChains = localStorage.getItem('chains')
// if (localChains) {
//   chains = JSON.parse(localChains)
// } else {
chains = update
localStorage.setItem('chains', JSON.stringify(update))
const selected = chains.cosmos

// }

// Object.keys(update).forEach(key => {
//   const chain = update[key]
//   if (!chain.sdk_version) {
//     fetch(`${chain.api}/node_info`)
//       .then(res => res.json())
//       .then(json => {
//         const { build_deps } = json.application_version
//         // eslint-disable-next-line camelcase
//         if (build_deps) {
//           const sdk = build_deps.find(e => e.startsWith('github.com/cosmos/cosmos-sdk'))
//           const re = /(\d+(\.\d+)*)/i
//           const version = sdk.match(re)
//           // eslint-disable-next-line prefer-destructuring
//           chain.sdk_version = version[0]
//         } else {
//           chain.sdk_version = json.node_info.version
//         }
//         localStorage.setItem('chains', JSON.stringify(update))
//       })
//   }
// })

export default {
  namespaced: true,
  state: {
    config: chains,
    selected,
    avatars: {},
    height: 0,
    ibcChannels: {},
    quotes: {},
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
  },
  actions: {
    async getQuotes(context) {
      fetch('https://price.ping.pub/quotes').then(data => data.json()).then(data => {
        context.commit('setQuotes', data)
      })
    },
  },
}
