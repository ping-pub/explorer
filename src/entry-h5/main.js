/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-22 19:19:39
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-27 21:31:41
 * @FilePath: \look-web\src\entry-h5\main.js
 */
import Vue from 'vue'
import './base'
import App from '../entry-pc/App.vue'
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
