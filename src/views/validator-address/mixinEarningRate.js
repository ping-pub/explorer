export default {
  computed: {
    earningRate() {
      if (!this.inflation_val || !this.tokens.bonded_tokens_val || !this.totalTokens.amount || !this.item.commission_rate) {
        return {
          percent: '--',
          rewards: '--'
        }
      }
      // 收益率 = 膨胀率 / 抵押率
      const value = (this.inflation_val / (this.tokens.bonded_tokens_val / this.totalTokens.amount))
      const percent = (value * 100).toFixed(2) + '%';
      const rewards = ((value * (1 - this.item.commission_rate)) * 100).toFixed(2) + '%'
      return {
        rewards,
        percent,
        value
      }
    },
  },
  data() {
    return {
      totalTokens: {
        amount: null
      },
      tokens: {
        bonded_tokens: '--',
        bonded_tokens_val: null
      },
      inflation_val: null
    }
  },
  methods: {
    initEarningRate() {
      this.getSupplyTotal()
      this.getStakingPool()
      this.getMintingInflation()
    },
    async getSupplyTotal() {
      const res = await this.$api.fetch('getSupplyTotal')
      this.totalTokens = res
    },
    async getStakingPool() {
      const res = await this.$api.fetch('getStakingPool')
      this.tokens = res
    },
    async getMintingInflation() {
      const res = await this.$api.fetch('getMintingInflation')
      this.inflation_val = res.inflation_val
    },
  }
}