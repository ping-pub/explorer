<template>
  <div class="container-md px-0">
    <b-row v-if="chainVals">
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
    <b-alert
      class="mt-2"
      variant="success"
      show
    >
      <div class="alert-heading">
        {{ $t('uptimeMyValidators.tips') }}
      </div>
      <div class="alert-body">
        {{ $t('uptimeMyValidators.two_ways') }}
        <li> {{ $t('uptimeMyValidators.pin') }}</li>
        <li> {{ $t('uptimeMyValidators.link') }} <pre>https://ping.pub/cosmos/uptime/my?validators={"sifchain":["FBADE9A30473BB9ED6DFA16BFB3838E028F33650"],"chain_name":["hexAddress"]}</pre></li>
      </div>
    </b-alert>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BAlert,
} from 'bootstrap-vue'
import { consensusPubkeyToHexAddress, getCachedValidators, getLocalChains } from '@/libs/utils'
import { fromHex, toBase64 } from '@cosmjs/encoding'
import UptimeMyChainBlocks from './UptimeMyChainBlocks.vue'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    UptimeMyChainBlocks,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    let pinned = (localStorage.getItem('pinned') || '').split(',').map(x => x.split('#')).reduce((a1, b) => {
      const a = a1
      if (a[b[0]]) {
        a[b[0]].push(b[1])
      } else {
        a[b[0]] = [b[1]]
      }
      return a
    }, {})
    if (this.$route.query.validators) {
      pinned = (JSON.parse(this.$route.query.validators))
    }

    const chainVals = {}
    if (pinned) {
      const configs = getLocalChains()
      Object.keys(pinned).forEach(x => {
        const cached = JSON.parse(getCachedValidators(x))
        if (cached) {
          const validators = []
          pinned[x].forEach(address => {
            const val = cached.find(v => address === this.hex2base64(consensusPubkeyToHexAddress(v.consensus_pubkey)))
            if (val) validators.push({ address, validator: val.description })
          })
          chainVals[x] = validators
        } else {
          this.$http.getValidatorList(configs[x]).then((vals => {
            const validators = []
            pinned[x].forEach(address => {
              const val = vals.find(v => address === this.hex2base64(consensusPubkeyToHexAddress(v.consensus_pubkey)))
              if (val) validators.push({ address, validator: val.description })
            })
            this.$set(this.chainVals, x, validators)
          }))
        }
      })
    }

    return {
      chainVals,
    }
  },
  methods: {
    hex2base64(v) {
      return toBase64(fromHex(v))
    },
  },
}
</script>

<style></style>
