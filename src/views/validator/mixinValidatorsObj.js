export default {
  activated() {
    this.getStakingValidatorsObj()
  },
  created() {
    this.getStakingValidatorsObj()
  },
  data() {
    return {
      hexObj: {},
      addressObj: {},
      validatorObj: {}
    }
  },
  methods: {
    async getStakingValidatorsObj() {
      const res = await this.$api.fetch('getStakingValidatorsObj', {})
      this.hexObj = res.hexObj
      this.addressObj = res.addressObj
      this.validatorObj = res.validatorObj
    }
  }
}