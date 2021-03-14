/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-15 19:48:48
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-25 22:04:23
 * @FilePath: \look-web\src\views\chain-add\mixinData.js
 */

import { addChain } from '../../api/common/addChain'

export default {
  activated() {
    this.initForm()
  },
  created() {
    this.initForm()
  },
  data() {
    return {
      form: {
        name: "",
        chainId: "",
        logo: "",
        lcd: "",
        rpc: "",
        version: "0.32.7",
        unit: "ATOM",
        prefix: "cosmos",
        api: "V1",
        type: "GoZ",
        desc: ""
      }
    };
  },
  methods: {
    initForm() {
      this.form = {
        name: "",
        chainId: "",
        logo: "/static/chains/cosmoshub.svg",
        lcd: "",
        rpc: "",
        version: "0.32.7",
        unit: "ATOM",
        prefix: "cosmos",
        api: "V1",
        type: "GoZ",
        desc: ""
      }
    },
    async submitChain() {
      const res = await addChain(this.form)
      if (res.code === 1) {
        this.$message.success(this.$t('message.chaindadd_success'))
        this.$router.push('/dashboard')
      }
    },
    goAddChain() {
      // window.location.href = 'https://github.com/ping-pub/look'
      this.$router.push('/chain-add')
    }
  }
}
