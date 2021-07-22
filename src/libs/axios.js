import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: 'http://lcd.akash.forbole.com',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

Vue.prototype.$http = axiosIns

export default axiosIns
