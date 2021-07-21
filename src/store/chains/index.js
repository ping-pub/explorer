const chains = {}
const configs = require.context('.', false, /\.json$/)

let selectedChain = {}
configs.keys().forEach(k => {
  const c = configs(k)
  if (c.chain_name === 'cosmos') {
    selectedChain = c
  }
  chains[c.chain_name] = c
})

export default {
  namespaced: true,
  state: {
    selectedChain,
    chains,
  },
  getters: {
    getchains: state => state.chains,
    currentChain: state => chain => state.chains[chain],
  },
  mutations: {

  },
  actions: {},
}
