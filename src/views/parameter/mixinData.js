/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2020-12-11 15:15:26
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/views/parameter/mixinData.js
/pricefeed/parameters
/incentive/parameters
/bep3/parameters
/auction/parameters
 */
export default {
  created() {
    this.initData()
  },
  computed: {
    current() {
      return window.chain
    },
    earningRate() {
      if (!this.inflation_val || !this.bondedRate.val) {
        return {
          percent: '--',
          value: null
        }
      }
      // 收益率 = 膨胀率 / 抵押率
      const value = (this.inflation_val / this.bondedRate.val)
      const percent = (value * 100).toFixed(2) + '%';
      return {
        percent,
        value
      }
    },
    inflation_val() {
      return this.data.inflation_val
    },
    bondedRate() {
      if (!this.tokenTotal || !this.tokens.bonded_tokens_val) {
        return {
          percent: '--'
        }
      }
      const total = this.tokenTotal
      const bonded = this.tokens.bonded_tokens_val
      return {
        percent: (bonded / total * 100).toFixed(2) + '%',
        val: bonded / total
      }
    }
  },
  data() {
    return {
      tokenTotal: '',
      tokenTotal_str: '',
      tokens: {
        bonded_tokens: '--',
        bonded_tokens_val: null
      },
      blockHeight: '--',
      data: {}
    }
  },
  methods: {
    async getSupplyTotal() {
      const res = await this.$api.fetch('getSupplyTotal')
      this.tokenTotal = res.amount
      this.tokenTotal_str = res.amount_str
    },
    async getStakingPool() {
      const res = await this.$api.fetch('getStakingPool')
      this.tokens = res
    },
    async initValidator() {
      this.initBlockHeight()
    },
    async initBlockHeight() {
      const res = await this.$api.fetch('getRpcBlockchain', { minHeight: 0, maxHeight: 0 })
      this.blockHeight = res.last_height
    },
    initData() {
      this.initValidator()
      this.getSupplyTotal()
      this.getStakingPool()
      let apis = [
        'getNodeInfoRes',
        'getStakingParameters',
        'getGovParametersDeposit',
        'getGovParametersVoting',
        'getGovParametersTallying',
        'getSlashingParameters',
        'getDistributionParameters',
        'getMintingParameters',
        'getMintingInflation',
        'getMintingAnnualProvisionsn',
      ]
      if (this.current.chainId === 'e-money') {
        apis = [
          'getStakingParameters',
          'getSlashingParameters',
          'getDistributionParameters'
        ]
      }
      if (this.current.chainId === 'kava-2') {
        apis.push('getKavaCdpParameters')
        apis.push('getKavaPricefeed')
        apis.push('getKavaIncentive')
        apis.push('getKavaBep3')
        apis.push('getKavaAuction')
      }
      for (const item of apis) {
        this.$api.fetch(item).then((res) => {
          const current = JSON.parse(JSON.stringify(this.data))
          this.data = {
            ...current,
            ...res
          }
        })
      }
    }
  }
}