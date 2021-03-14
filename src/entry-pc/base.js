/*
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-06-30 14:53:04
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/entry-pc/base.js
 */
import Vue from 'vue'
import '../utils/initChain'
import './element-ui'
import '../components'
import * as api from '../api'
import axios from '../api/axios'

Vue.prototype.$api = api
Vue.prototype.$axios = axios

Vue.filter('shortHash', (val) => {
  if (val && val !== '--') {
    const str = val.substr(0, 8) + "..." + val.substr(-8, 8);
    return str;
  }
  return "--";
})


Vue.filter('miniHash', (val) => {
  if (val && val !== '--') {
    const str = "..." + val.substr(-6, 6);
    return str;
  }
  return "--";
})