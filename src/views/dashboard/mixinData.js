/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @lastTime: 2020-12-11 10:21:42
 * @FilePath: /look-web/src/views/dashboard/mixinData.js
 */
// import { getChain } from '../../api/common/getChain'
import { switchChain } from '../../utils/initChain'
import chains from '../../chains'

const isDev = location.hostname === 'localhost'

export default {
  computed: {
    current() {
      return window.chain
    }
  },
  data() {
    return {
      chains,
      loading: false,
    }
  },
  // activated() {
  //   this.initChain()
  // },
  // created() {
  //   this.initChain()
  // },
  methods: {
    initChain() {
      // this.loading = true
      // const res = await getChain()
      // this.loading = false
      // this.chains = isDev ? chains : res.data
      this.chains = chains
    },
    goAddChain() {
      // window.location.href = 'https://github.com/ping-pub/look'
      this.$router.push('/chain-add')
    },
    switchChain(chain) {
      switchChain(chain)
    }
  }
}
