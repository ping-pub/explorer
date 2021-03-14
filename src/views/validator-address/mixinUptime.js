/*
 * @Description: 
 * @Author: dingyi
 * @Date: 2020-07-13 09:41:17
 * @lastTime: 2020-12-11 15:58:27
 * @LastEditors: dingyi
 */
import { percent } from '../../utils/num'

export default {
  computed: {
    uptime() {
      const signed_blocks_window = this.parameters.signed_blocks_window
      let missed_blocks_counter = this.signInfo.missed_blocks_counter
      if (!signed_blocks_window || !missed_blocks_counter) return { percent: '--', missed_blocks_counter: '--' }
      const cent = percent(((signed_blocks_window - Number(missed_blocks_counter)) /
        signed_blocks_window))
      return {
        percent: cent,
        missed_blocks_counter
      }
    }
  },
  data() {
    return {
      signInfo: {
        missed_blocks_counter: null
      },
      parameters: {
        signed_blocks_window: null
      }
    }
  },
  methods: {
    initUptime() {
      this.getSlashingValidatorsSigningInfo()
      this.getSlashingParameters()
    },
    async getSlashingValidatorsSigningInfo() {
      const res = await this.$api.fetch('getSlashingValidatorsSigningInfo', { validatorAddress: this.item.consensus_pubkey }).catch((e) => {   })
      if (!res) return
      this.signInfo = res
    },
    async getSlashingParameters() {
      const res = await this.$api.fetch('getSlashingParameters')
      this.parameters = res
    }
  }
}