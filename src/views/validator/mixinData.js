/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2021-03-10 16:49:04
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look/src/views/validator/mixinData.js
 */
export default {
  created() {
    this.initData()
  },
  computed: {
    validatorsLength() {
      if (this.earningRate && this.earningRate.value) {
        for (const item of this.validators) {
          item.rewards = ((this.earningRate.value * (1 - item.commission_rate)) * 100).toFixed(2) + '%'
        }
      }
      return this.validators.length || '--'
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
      for (const item of this.validators) {
        item.rewards = ((value * (1 - item.commission_rate)) * 100).toFixed(2) + '%'
      }
      return {
        percent,
        value
      }
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
        percent: (bonded / total * 100).toFixed(2) + '%' ,
        val: bonded / total
      }
    }
  },
  data() {
    return {
      validators: [],
      validatorsUnbonded: [],
      blockHeight: '--',
      tokenTotal: null,
      tokenTotal_str: '--',
      tokens: {
        bonded_tokens: '--',
        bonded_tokens_val: null
      },
      inflation_val: null,
      type: 'bonded'
    }
  },
  methods: {
    initData() {
      this.initValidator()
      this.getSupplyTotal()
      this.getStakingPool()
      this.getMintingInflation()
      this.getUnbondedValidators()
    },
    async getUnbondedValidators() {
      const res = await this.$api.fetch('getStakingValidators', { status: window.chain.api === 'V4' ? 'BOND_STATUS_BONDED' : 'bonded' })
      if (!res) return
      this.validatorsUnbonded = res.result
    },
    async initValidator() {
      this.loading = true
      this.initBlockHeight()
      const res = await this.$api.fetch('getStakingValidators', { status: window.chain.api === 'V4' ? 'BOND_STATUS_BONDED' : 'bonded' })
      if (!res) return
      this.validators = res.result
      this.loading = false
    },
    async initBlockHeight() {
      if (window.chain.api === 'V2') {
        const res = await this.$api.fetch('getValidatorsetsLatest')
        this.blockHeight = res.block_height
      } else {
        const res = await this.$api.fetch('getRpcBlockchain', { minHeight: 0, maxHeight: 0 })
        this.blockHeight = res.last_height
      }
      
      await this.getValidatorsetsHeight()
    },
    async getStakingPool() {
      const res = await this.$api.fetch('getStakingPool')
      this.tokens = res
    },
    async getSupplyTotal() {
      const res = await this.$api.fetch('getSupplyTotal')
      if (!res) return
      this.tokenTotal = res.amount
      this.tokenTotal_str = res.amount_str
    },
    async getMintingInflation() {
      const res = await this.$api.fetch('getMintingInflation')
      this.inflation_val = res && res.inflation_val
    },
    async getValidatorsetsHeight() {
      let height = this.blockHeight - 12500
      if (height <= 0) {
        height = 1
      }
      // 2021.2.19
      // if (window.chain.api === 'V4' && height <= 5200791) {
      //   height = 5200791
      // }
      const [validatorSetsLatest, validatorSets] = await Promise.all([
        this.$api.fetch('getValidatorsetsHeight', { height: this.blockHeight }),
        this.$api.fetch('getValidatorsetsHeight', { height })
      ])
      const validatorSetsObj = {};
      const validatorSetsLatestObj = {};
      if (validatorSets) {
        for (const item of validatorSets) {
          validatorSetsObj[item.pub_key] = Number(item.voting_power);
        }
        for (const item of validatorSetsLatest) {
          validatorSetsLatestObj[item.pub_key] = Number(item.voting_power);
        }
        for (const item of this.validators) {
          item.dailyChange = validatorSetsLatestObj[item.consensus_pubkey] -
            (validatorSetsObj[item.consensus_pubkey] || 0)
        }
      }
    }
  }
}