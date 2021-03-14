/*
 * @Author: your name
 * @Date: 2020-03-08 00:49:52
 * @lastTime: 2021-03-10 16:49:28
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\views\uptime\mixinData.js
 */
export default {
  props: {
    len: {
      default: 50
    }
  },
  data() {
    return {
      type: "bonded",
      loading: false,
      validators: [],
      validatorsUnbonded: [],
      heightArr: [],
      initHeight: null,
      blockHeight: null,
      blockHeightMax: null,
      blockHeightMin: null,
      precommitObj: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getStakingValidators()
      this.getUnbondedValidators()
    },
    async getUnbondedValidators() {
      const res = await this.$api.fetch('getStakingValidators', { status: window.chain.api === 'V4' ? 'BOND_STATUS_UNBONDED' : 'unbonded' })
      if (!res) return
      this.validatorsUnbonded = res.result
    },
    async getStakingValidators() {
      this.loading = true
      const res = await this.$api.fetch('getStakingValidators', {})
      this.validators = res.result
      await this.initBlockHeight()
    },
    async initBlockHeight() {
      if (window.chain.api === 'V2') {
        const res = await this.$api.fetch('getValidatorsetsLatest')
        this.blockHeight = res.block_height
      } else {
        const res = await this.$api.fetch('getRpcBlockchain', { minHeight: 0, maxHeight: 0 })
        this.blockHeight = res.last_height
      }
      this.initHeight = Number(this.blockHeight)
      this.blockHeightMax = this.blockHeight
      this.switchHeight()
      this.loading = false
    },
    switchHeight() {
      if (Number(this.blockHeightMax) >= Number(this.blockHeight)) {
        this.blockHeightMax = Number(this.blockHeight) - 1
      }
      if (Number(this.blockHeightMax) < this.len) {
        this.blockHeightMax = this.len
      }
      this.blockHeightMin = this.blockHeightMax - this.len + 1;
      this.fetchPage()
    },
    // 分页获取
    async fetchPage() {
      // 先生成高度的数组
      const heightArr = [];
      for (let i = this.blockHeightMax; i >= this.blockHeightMin; i -= 1) {
        const height = i;
        const obj = {
          height,
          precommits: {}
        }
        heightArr.push(obj);
        this.$api.fetch('getRpcCommitHeight', { height }).then((precommits) => {
          obj.precommits = precommits
        })
      }
      this.heightArr = heightArr.reverse();
      this.loading = false
    },
    // 下一页，每页4个
    nextPage() {
      this.blockHeightMax = Number(this.blockHeightMax) - Number(this.len) - 1;
      if (Number(this.blockHeightMax) < this.len) {
        this.blockHeightMax = this.len
      }
      this.blockHeightMin = this.blockHeightMax - this.len;
      this.fetchPage();
    },
    prevPage() {
      this.blockHeightMax = Number(this.blockHeightMax) + Number(this.len) + 1;
      if (Number(this.blockHeightMax) >= Number(this.blockHeight)) {
        this.blockHeightMax = this.blockHeight - 1
      }
      this.blockHeightMin = this.blockHeightMax - this.len;
      this.fetchPage();
    },
  }
}