<template>
  <b-card v-if="assets">
    <b-card-title>
      Assets
    </b-card-title>
    <b-table
      :items="assets"
      :fields="cfield"
      hover
      striped
      sticky-header="true"
      responsive="xs"
    />
  </b-card>
</template>

<script>
import { sha256 } from '@cosmjs/crypto'
import { toHex } from '@cosmjs/encoding'
import { BTable, BCardTitle, BCard } from 'bootstrap-vue'
import { formatNumber, formatTokenAmount, formatTokenDenom } from '@/libs/utils'

export default {
  components: {
    BCard,
    BTable,
    BCardTitle,
  },
  data() {
    return {
      islive: true,
      assets: [],
      denoms: {},
      cfield: [
        {
          key: 'denom',
          formatter: this.formatDenom,
          tdClass: 'text-nowrap text-truncate overflow-hidden',
        },
        'abbr',
        {
          key: 'amount',
        },
      ],
    }
  },
  created() {
    this.$http.getAllIBCDenoms().then(x => {
      x.denom_traces.forEach(trace => {
        const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
        this.$set(this.denoms, `ibc/${hash.toUpperCase()}`, trace.base_denom)
      })
    })
    this.$http.getBankTotals().then(res => {
      const toshow = res.sort()
      this.assets = toshow.reverse().map(x => {
        const xh = x
        xh.abbr = x.amount > 1 ? formatNumber(formatTokenAmount(x.amount, 0, x.denom), true, 2) : x.amount
        return xh
      })
    })
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    formatDenom(v) {
      return formatTokenDenom(this.denoms[v] ? this.denoms[v] : v)
    },
  },
}
</script>

<style>
</style>
