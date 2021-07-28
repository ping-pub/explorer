const chains = {}
const configs = require.context('.', false, /\.json$/)

configs.keys().forEach(k => {
  const c = configs(k)
  chains[c.chain_name] = c
})

export default {
  namespaced: true,
  state: {
    chains,
  },
  getters: {
    getchains: state => state.chains,
  },
  mutations: {
    setup_sdk_version(state, info) {
      state.chains.chains[info.chain_name].sdk_version = info.version
    },

  },
  actions: {},
}
