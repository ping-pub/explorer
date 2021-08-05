let chains = {}

const localChains = localStorage.getItem('chains')
if (localChains) {
  chains = JSON.parse(localChains)
} else {
  const configs = require.context('.', false, /\.json$/)

  configs.keys().forEach(k => {
    const c = configs(k)
    chains[c.chain_name] = c
  })
  localStorage.setItem('chains', JSON.stringify(chains))
}

Object.keys(chains).forEach(key => {
  const chain = chains[key]
  fetch(`${chain.api}/node_info`)
    .then(res => res.json())
    .then(json => {
      const sdk = json.application_version.build_deps.find(e => e.startsWith('github.com/cosmos/cosmos-sdk'))
      const re = /(\d+(\.\d+)*)/i
      const version = sdk.match(re)
      // eslint-disable-next-line prefer-destructuring
      chain.sdk_version = version[0]
      localStorage.setItem('chains', JSON.stringify(chains))
    })
    .catch(e => console.error(`Failed get api vesion of ${key}`, e))
})

export default {
  namespaced: true,
  state: {
    config: chains,
    selected: {},
    avatars: {},
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

  },
  actions: {},
}
