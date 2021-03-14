import axios from 'axios'

const instance = axios.create({
  baseURL: '/api'
});

// const CancelToken = axios.CancelToken;
instance.interceptors.request.use((config) => {
  // const source = CancelToken.source();
  // config.cancelToken = source.token
  // if (!config.headers.serverCustom) {
  //   const { lcd } = store.state.wallet.currentChain
  //   config.headers.server = lcd
  // }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 请求后，统一处理
instance.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default instance
