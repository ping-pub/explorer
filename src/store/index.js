/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-28 08:18:40
 * @FilePath: /look-web/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    bondedTokens: ''
  },
  mutations: {
    bondedTokensSet(state, item) {
      state.bondedTokens = item
    }
  },
  actions: {
  },
  modules: {
  }
})


export default store
