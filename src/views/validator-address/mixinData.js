/*
 * @Description: 
 * @Author: dingyi
 * @Date: 2020-07-13 09:41:17
 * @lastTime: 2020-12-11 16:00:54
 * @LastEditors: dingyi
 */
import { percent } from '../../utils/num'
import { validatorAddressToAccount } from '../../utils/b32'
import keybase from '../../api/common/keybase'

import mixinEarningRate from './mixinEarningRate'
import mixinUptime from './mixinUptime'
import mixinValidatorsObj from '../validator/mixinValidatorsObj'

export default {
  mixins: [mixinEarningRate, mixinUptime, mixinValidatorsObj],
  computed: {
    total_deposit() {
      return '--'
    }
  },
  data() {
    return {
      loading: false,
      loadingDelegations: false,
      address: '',
      item: {},
      delegationList: [],
      selfShare: {}
    }
  },
  computed: {
    voting_power_percent() {
      if (!this.item.tokens || !this.totalTokens.amount) {
        return '--'
      }
      return percent(this.item.tokens / this.totalTokens.amount)
    }
  },
  created() {
    this.initData()
  },
  activated() {
    this.initData()
  },
  methods: {
    back() {
      this.$router.back()
    },
    initData() {
      const { address } = this.$route.params
      this.address = address
      this.item = {}
      this.getValidatorsAddress(address)
      this.getStakingValidatorsDelegations(address)
      this.initEarningRate()
    },
    async getValidatorsAddress(address) {
      this.loading = true
      const res = await this.$api.fetch("getStakingValidatorsValidatorAddress", {
        validatorAddress: address
      }).catch((e) => { console.log(e) })
      this.loading = false
      if (!res) return
      this.item = res
      // mixinUptime
      this.initUptime()
      // keybase avatar
      this.getKeyBase(res.identity)
    },
    async getStakingValidatorsDelegations(address) {
//      this.loadingDelegations = true
//      const res = await this.$api.fetch('getStakingValidatorsDelegations', {
//        validatorAddress: address
//      })
//      this.loadingDelegations = false
//      if (!res) return
//      this.delegationList = res
//      this.selfDelegations(res)
    },
    // 计算自委托比例
    selfDelegations(list) {
      const account = validatorAddressToAccount(this.address)
      for (const item of list) {
        if (account === item.delegator_address) {
          this.selfShare = item
        }
      }
    },
    async getKeyBase(identity) {
      const res = await keybase({ identity })
      this.item.avatar = res.avatar
    }
  }
}
