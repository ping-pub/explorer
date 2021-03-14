import Vue from 'vue'
import './base'
import App from './App.vue'
import router from './router'
import store from '../store'
import i18n from '../utils/lang'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
