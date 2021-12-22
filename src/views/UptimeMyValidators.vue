<template>
  <div class="container-md px-0">
    <b-row>
      <b-col
        v-for="(x,index) in Object.keys(chainVals)"
        :key="index"
        sm="12"
        md="4"
        class="text-truncate"
      >
        <uptime-my-chain-blocks
          :chain="x"
          :validators="chainVals[x]"
        />

      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import { consensusPubkeyToHexAddress, getCachedValidators } from '@/libs/utils'
import UptimeMyChainBlocks from './UptimeMyChainBlocks.vue'

export default {
  components: {
    BRow,
    BCol,
    UptimeMyChainBlocks,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    const pinned = (localStorage.getItem('pinned') || '').split(',').map(x => x.split('#')).reduce((a1, b) => {
      const a = a1
      if (a[b[0]]) {
        a[b[0]].push(b[1])
      } else {
        a[b[0]] = [b[1]]
      }
      return a
    }, {})

    const chainVals = {}
    Object.keys(pinned).forEach(x => {
      const cached = JSON.parse(getCachedValidators(x))
      const validators = []
      pinned[x].forEach(address => {
        const val = cached.find(v => address === consensusPubkeyToHexAddress(v.consensus_pubkey))
        if (val) validators.push({ address, validator: val.description })
      })
      chainVals[x] = validators
    })

    return {
      chainVals,
    }
  },
}
</script>

<style></style>
